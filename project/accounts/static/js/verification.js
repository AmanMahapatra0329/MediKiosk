// --- Auto-advance between OTP boxes ---
const inputs = Array.from(document.querySelectorAll('.otp-input'));

inputs.forEach((input, i) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value && i < inputs.length - 1) {
      inputs[i + 1].focus();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !input.value && i > 0) {
      inputs[i - 1].focus();
    }
  });

  input.addEventListener('paste', (e) => {
    e.preventDefault();
    const digits = (e.clipboardData.getData('text') || '').replace(/[^0-9]/g, '').split('');
    digits.forEach((digit, idx) => {
      if (inputs[i + idx]) inputs[i + idx].value = digit;
    });
    const next = inputs[Math.min(i + digits.length, inputs.length - 1)];
    next.focus();
  });
});

// --- Resend countdown ---
const resendBtn = document.getElementById('resendBtn');
const countdownEl = document.getElementById('countdown');
const resendText = document.getElementById('resendText');
let seconds = 30;

const timer = setInterval(() => {
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

resendBtn.addEventListener('click', () => {
  resendBtn.disabled = true;
  seconds = 30;
  resendText.style.display = 'inline';
  countdownEl.textContent = '00:30';
  // TODO: trigger actual resend request here
});

const emid = sessionStorage.getItem("verification_email");
console.log(emid);

const targetmail = document.getElementById('targetEmail');
targetmail.innerText = emid;

async function OTPSubmission() {
  console.log('function is running!');
  let otp = [];
  otp.push(document.getElementById('digit1').value);
  otp.push(document.getElementById('digit2').value);
  otp.push(document.getElementById('digit3').value);
  otp.push(document.getElementById('digit4').value);
  otp.push(document.getElementById('digit5').value);
  otp.push(document.getElementById('digit6').value);
  console.log(otp);

  let verificationcode = otp.join("");
  const response = await fetch('/accounts/api/emailverification/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: emid,
      code: verificationcode
    })
  });
  const data = await response.json();
  console.log(data);
  // const data = await response.json();
  // window.location.replace('/');
  if (response.ok) {
    window.location.replace('/');
  } else {
    console.log('error');
  }
}
const submitbutton = document.querySelector('#submitotp');
submitbutton.addEventListener('click', () => {
  console.log('submit button is clicked!');
  OTPSubmission();
});