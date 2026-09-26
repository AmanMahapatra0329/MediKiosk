/**
 * WhatsApp UI Chat Widget JavaScript
 * Handles text input, auto-expansion, message rendering, sound effects, 
 * conversational reply flow, emojis, and local persistence.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const chatCard = document.getElementById('waChatCard');
  const chatBody = document.getElementById('waChatBody');
  const textarea = document.getElementById('waTextarea');
  const actionBtn = document.getElementById('waActionBtn');
  const emojiToggle = document.getElementById('waEmojiToggle');
  const emojiDrawer = document.getElementById('waEmojiDrawer');
  const emojiClose = document.getElementById('waEmojiClose');
  const menuToggle = document.getElementById('waMenuToggle');
  const menuDropdown = document.getElementById('waMenuDropdown');
  const clearChatBtn = document.getElementById('waClearChatBtn');
  const expandToggle = document.getElementById('waExpandToggle');
  const backdrop = document.getElementById('waBackdrop');
  const typingBubble = document.getElementById('waTypingBubble');
  const contactStatus = document.getElementById('waContactStatus');
  const micToast = document.getElementById('waMicToast');

  if (!chatCard || !chatBody || !textarea || !actionBtn) return;

  // Sound synthesis via Web Audio API (Native, no external audio files required)
  let audioCtx = null;
  let soundEnabled = true;

  function playPopSound(isIncoming = false) {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (isIncoming) {
        // WhatsApp incoming chime
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.3);
      } else {
        // WhatsApp outgoing swoosh
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.14);
      }
    } catch (e) {
      // Audio not supported or blocked by browser policy
    }
  }

  // Format Time (12hr format: e.g. 9:41 PM)
  function formatCurrentTime(dateObj = new Date()) {
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minStr} ${ampm}`;
  }

  // Escape HTML to prevent injection
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // SVG Icons
  const doubleTickSVG = `
    <svg class="wa-double-tick" viewBox="0 0 16 11">
      <path d="M11.07.28a.75.75 0 0 0-1.06 0L5.3 4.99l-2.04-2.04a.75.75 0 0 0-1.06 1.06l2.57 2.57a.75.75 0 0 0 1.06 0l5.24-5.24a.75.75 0 0 0 0-1.06zm4.18 0a.75.75 0 0 0-1.06 0l-5.24 5.24a.75.75 0 0 0 0 1.06l2.57 2.57a.75.75 0 0 0 1.06 0l4.73-4.73a.75.75 0 0 0 0-1.06l-2.06-2.08z"/>
    </svg>
  `;

  const micIconSVG = `
    <svg viewBox="0 0 24 24">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
    </svg>
  `;

  const sendIconSVG = `
    <svg viewBox="0 0 24 24">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  `;

  // Storage key
  const STORAGE_KEY = 'meridian_patient_wa_chat_clean_v1';

  // Clear any legacy storage containing old predefined messages
  try {
    localStorage.removeItem('meridian_patient_wa_chat_v1');
  } catch (e) { }

  // Load chat messages from LocalStorage (starts clean with no predefined messages)
  function loadMessages() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const msgs = JSON.parse(saved);
        if (msgs && msgs.length > 0) {
          msgs.forEach(msg => appendMessageDOM(msg.text, msg.type, msg.time, false));
          scrollToBottom(false);
        }
      } catch (err) {
        console.error('Error loading chat history', err);
      }
    }
  }

  // Save current messages to LocalStorage
  function saveMessage(text, type, time) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      let msgs = saved ? JSON.parse(saved) : [];
      msgs.push({ text, type, time });
      if (msgs.length > 50) msgs = msgs.slice(-50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
    } catch (err) {
      console.warn('Storage save error', err);
    }
  }

  // Scroll chat to bottom
  function scrollToBottom(smooth = true) {
    setTimeout(() => {
      chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }, 50);
  }

  // Append message DOM element
  function appendMessageDOM(text, type = 'outgoing', time = null, save = true) {
    const timeStr = time || formatCurrentTime();

    const row = document.createElement('div');
    row.className = `wa-msg-row ${type}`;

    let innerContent = '';
    if (type === 'incoming') {
      innerContent = `
        <div class="wa-bubble">
          <p class="wa-msg-text">${escapeHTML(text)}</p>
          <span class="wa-bubble-meta">
            ${timeStr}
          </span>
        </div>
      `;
    } else {
      innerContent = `
        <div class="wa-bubble">
          <p class="wa-msg-text">${escapeHTML(text)}</p>
          <span class="wa-bubble-meta">
            ${timeStr}
            ${doubleTickSVG}
          </span>
        </div>
      `;
    }

    row.innerHTML = innerContent;

    // Insert before typing bubble
    chatBody.insertBefore(row, typingBubble);
    scrollToBottom(true);

    if (save) {
      saveMessage(text, type, timeStr);
    }
  }

  // Adjust Textarea Height & Action Button State
  function handleInputChange() {
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 100);
    textarea.style.height = `${newHeight}px`;

    const text = textarea.value.trim();
    if (text.length > 0) {
      if (!actionBtn.classList.contains('send-mode')) {
        actionBtn.classList.remove('mic-mode');
        actionBtn.classList.add('send-mode');
        actionBtn.innerHTML = sendIconSVG;
        actionBtn.setAttribute('title', 'Send message (Enter)');
      }
    } else {
      if (!actionBtn.classList.contains('mic-mode')) {
        actionBtn.classList.remove('send-mode');
        actionBtn.classList.add('mic-mode');
        actionBtn.innerHTML = micIconSVG;
        actionBtn.setAttribute('title', 'Voice Message');
      }
    }
  }

  textarea.addEventListener('input', handleInputChange);

  // Send message on Enter (Shift+Enter for new line)
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Action button click: Send or Mic Toast
  actionBtn.addEventListener('click', () => {
    if (actionBtn.classList.contains('send-mode')) {
      sendMessage();
    } else {
      if (micToast) {
        micToast.classList.add('active');
        setTimeout(() => {
          micToast.classList.remove('active');
        }, 2200);
      }
    }
  });

  // Send Message Logic
  function sendMessage(customText = null) {
    const text = customText !== null ? customText.trim() : textarea.value.trim();
    if (!text) return;

    // Append outgoing message
    appendMessageDOM(text, 'outgoing');
    playPopSound(false);

    // Clear input
    if (customText === null) {
      textarea.value = '';
      textarea.style.height = 'auto';
      handleInputChange();
      textarea.focus();
    }

    // Trigger conversation flow reply
    triggerAssistantReply(text);
  }

  // API endpoint for fetching questions
  async function getQuestion(question_id) {
    try {
      let token = localStorage.getItem('access');
      let response = await fetch(`/patients/api/get/questions/${question_id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 && typeof RefreshAccessToken === 'function') {
        token = await RefreshAccessToken();
        if (token) {
          response = await fetch(`/patients/api/get/questions/${question_id}/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        }
      }

      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (e) {
      console.error('Error fetching question:', e);
      return null;
    }
  }

  // API endpoint for posting user response
  async function PostQuestionResponse(userText = "") {
    try {
      let token = localStorage.getItem('access');
      let response = await fetch('/patients/api/post/response/', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: userText
        })
      });

      if (response.status === 401 && typeof RefreshAccessToken === 'function') {
        token = await RefreshAccessToken();
        if (token) {
          response = await fetch('/patients/api/post/response/', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              question: userText
            })
          });
        }
      }

      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (e) {
      console.error('Error posting question response:', e);
      return null;
    }
  }

  // Auto-clear chat after all responses collected
  function autoClearChat() {
    contactStatus.textContent = 'Clearing chat...';
    contactStatus.classList.remove('typing');
    setTimeout(() => {
      // Wipe localStorage
      localStorage.removeItem(STORAGE_KEY);
      // Remove all message rows from DOM
      const messages = chatBody.querySelectorAll('.wa-msg-row');
      messages.forEach(m => m.remove());
      // Reset status
      contactStatus.textContent = 'online';
    }, 4000);
  }

  // Conversational Flow Response Logic
  async function triggerAssistantReply(patientText) {
    // Show typing status
    contactStatus.textContent = 'typing...';
    contactStatus.classList.add('typing');
    typingBubble.classList.add('active');
    scrollToBottom(true);

    try {
      // 1. Post user input to PostQuestionResponse endpoint
      const postData = await PostQuestionResponse(patientText);
      let reply = '';
      let isConversationComplete = false;

      if (postData && postData.question_number !== undefined && postData.question_number !== null) {
        // 2. Fetch the corresponding question using question_number
        const questionData = await getQuestion(postData.question_number);
        if (questionData && questionData.question) {
          reply = questionData.question;
        } else {
          // question_number present but question fetch failed — treat as end
          reply = "All your responses have been recorded. Thank you! The chat will now clear.";
          isConversationComplete = true;
        }
      } else {
        // question_number is null/undefined → all questions answered
        reply = "All your responses have been recorded. Thank you! The chat will now clear.";
        isConversationComplete = true;
      }

      // Deliver response after natural typing interval
      setTimeout(() => {
        typingBubble.classList.remove('active');
        contactStatus.textContent = 'online';
        contactStatus.classList.remove('typing');
        appendMessageDOM(reply, 'incoming');
        playPopSound(true);

        // If conversation is complete, auto-clear after a short pause
        if (isConversationComplete) {
          setTimeout(() => autoClearChat(), 2500);
        }
      }, 600);

    } catch (err) {
      console.error("Error in triggerAssistantReply:", err);
      setTimeout(() => {
        typingBubble.classList.remove('active');
        contactStatus.textContent = 'online';
        contactStatus.classList.remove('typing');
        appendMessageDOM("Your response has been recorded, a doctor will review it and get back to you soon.", 'incoming');
        playPopSound(true);
      }, 600);
    }
  }

  // Emoji Drawer Toggle
  if (emojiToggle && emojiDrawer) {
    emojiToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuDropdown.classList.remove('active');
      emojiDrawer.classList.toggle('active');
    });

    if (emojiClose) {
      emojiClose.addEventListener('click', () => {
        emojiDrawer.classList.remove('active');
      });
    }

    // Emoji clicks
    emojiDrawer.addEventListener('click', (e) => {
      const item = e.target.closest('.wa-emoji-item');
      if (!item) return;
      const emoji = item.textContent.trim();
      textarea.value += emoji;
      handleInputChange();
      textarea.focus();
    });
  }

  // 3-Dot Menu Dropdown Toggle
  if (menuToggle && menuDropdown) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      emojiDrawer.classList.remove('active');
      menuDropdown.classList.toggle('active');
    });
  }

  // Clear Chat Button (clears completely without adding any predefined text)
  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', () => {
      menuDropdown.classList.remove('active');
      if (confirm('Clear chat history on this device?')) {
        localStorage.removeItem(STORAGE_KEY);
        const messages = chatBody.querySelectorAll('.wa-msg-row');
        messages.forEach(m => m.remove());
      }
    });
  }

  // Sound Toggle Button in Menu
  const soundToggleBtn = document.getElementById('waSoundToggleBtn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggleBtn.textContent = soundEnabled ? '🔔 Sound: ON' : '🔕 Sound: OFF';
      menuDropdown.classList.remove('active');
    });
  }

  // Expand / Fullscreen Toggle
  if (expandToggle) {
    expandToggle.addEventListener('click', () => {
      const isExp = chatCard.classList.toggle('wa-expanded');
      if (backdrop) {
        if (isExp) backdrop.classList.add('active');
        else backdrop.classList.remove('active');
      }
      expandToggle.setAttribute('title', isExp ? 'Collapse chat' : 'Expand chat');
      scrollToBottom(false);
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      chatCard.classList.remove('wa-expanded');
      backdrop.classList.remove('active');
      expandToggle.setAttribute('title', 'Expand chat');
    });
  }

  // Close floating menus on click outside
  document.addEventListener('click', (e) => {
    if (emojiDrawer && !emojiDrawer.contains(e.target) && e.target !== emojiToggle) {
      emojiDrawer.classList.remove('active');
    }
    if (menuDropdown && !menuDropdown.contains(e.target) && e.target !== menuToggle) {
      menuDropdown.classList.remove('active');
    }
  });

  // Initial load
  loadMessages();
});
