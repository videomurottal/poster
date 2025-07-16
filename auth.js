document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('authForm');
  const passwordInput = document.getElementById('authPassword');
  const errorText = document.getElementById('authError');

  // Ambil hash dari Netlify Function
  const res = await fetch('/.netlify/functions/fetchPrivateAuth');
  const { hash: correctHash } = await res.json();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = passwordInput.value.trim();
    const userHash = await sha256(input);

    if (userHash === correctHash) {
      document.getElementById('authModal').style.display = 'none';
      document.body.classList.remove('blurred');

      // 🔓 Load konten hanya setelah password cocok
      if (typeof loadAyat === 'function') loadAyat();
    } else {
      errorText.textContent = '❌ Password salah. Coba lagi.';
    }
  });

  // SHA-256 function
  async function sha256(text) {
    const encoder = new TextEncoder('abc123');
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b =>
      b.toString(16).padStart(2, '0')
    ).join('');
  }
});
