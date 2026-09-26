const form = document.getElementById('resetForm');
    const formState = document.getElementById('formState');
    const confirmState = document.getElementById('confirmState');
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-password');

    confirmState.style.display = 'none';

    // --- Show/hide password toggles ---
    document.querySelectorAll('.toggle-visibility').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const showing = target.type === 'text';
        target.type = showing ? 'password' : 'text';
        btn.classList.toggle('showing', !showing);
        btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
      });
    });

    // --- Submit + match validation ---
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (newPassword.value.length < 8 || newPassword.value !== confirmPassword.value) {
        form.classList.add('has-error');
        return;
      }

      form.classList.remove('has-error');
      // TODO: replace with actual request to your backend
      formState.style.display = 'none';
      confirmState.style.display = 'block';
    });

    [newPassword, confirmPassword].forEach(input => {
      input.addEventListener('input', () => form.classList.remove('has-error'));
    });

//new password 

const params = new URLSearchParams(window.location.search)

async function UpdatedPassword(){
  const userid = params.get("user_id");
  const token = params.get("token");
  await fetch('/accounts/')
}