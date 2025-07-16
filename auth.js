(async function () {
  // Ambil hash password dari Netlify Function
  const res = await fetch('/.netlify/functions/fetchPrivateAuth');
  const data = await res.json();
  const correctHash = data.hash;

  // Tunggu klik tombol "Masuk"
  document.getElementById('submitPassword').addEventListener('click', async () => {
    const input = document.getElementById('passwordInput').value.trim();
    const userHash = await sha256(input);

    if (userHash === correctHash) {
      document.getElementById('passwordModal').style.display = 'none';
      document.body.classList.remove('blurred');
    } else {
      document.getElementById('errorText').innerText = '❌ Password salah. Coba lagi.';
    }
  });

  // Fungsi hash SHA-256
  async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  }
})();
