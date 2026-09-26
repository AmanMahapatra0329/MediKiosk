const form = document.getElementById('forgotForm');
    const requestState = document.getElementById('requestState');
    const confirmState = document.getElementById('confirmState');
    const confirmedEmail = document.getElementById('confirmedEmail');
    const emailInput = document.getElementById('email');

    confirmState.style.display = 'none';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // TODO: replace with actual request to your backend
      confirmedEmail.textContent = emailInput.value;
      requestState.style.display = 'none';
      confirmState.style.display = 'block';
      startCountdown();
    });

    // --- Resend countdown (confirmation state) ---
    const resendBtn = document.getElementById('resendBtn');
    const countdownEl = document.getElementById('countdown');
    const resendText = document.getElementById('resendText');
    let timer;

    function startCountdown() {
      let seconds = 30;
      resendBtn.disabled = true;
      resendText.style.display = 'inline';
      countdownEl.textContent = '00:30';

      clearInterval(timer);
      timer = setInterval(() => {
        seconds -= 1;
        const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
        const ss = String(seconds % 60).padStart(2, '0');
        countdownEl.textContent = `${mm}:${ss}`;
        if (seconds <= 0) {
          clearInterval(timer);
          resendText.style.display = 'none';
          resendBtn.disabled = false;
        }
      }, 1000);
    }

    resendBtn.addEventListener('click', () => {
      // TODO: trigger actual resend request here
      startCountdown();
    });


// Reset Password email 
async function EmailVerification() {
    const targetmail = document.getElementById('email').value;
    console.log("Email being sent:", targetmail);
    const response = await fetch('/accounts/api/passwordreset/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: targetmail
        })
    });
    console.log("Response:", response.status);
}


const submitbutton = document.getElementById('mailsubmit');
submitbutton.addEventListener('click',EmailVerification);


