(async function () {
  const res = await fetch('/.netlify/functions/fetchPrivateAuth');
  const data = await res.json();
  const correctHash = data.hash;

  document.getElementById('submitPassword').addEventListener('click', async () => {
    const input = document.getElementById('passwordInput').value.trim();
    const userHash = await sha256(input);

    if (userHash === correctHash) {
      document.getElementById('passwordModal').style.display = 'none';
      document.body.classList.remove('blurred'); // Optional
    } else {
      document.getElementById('errorText').innerText = '❌ Password salah. Coba lagi.';
    }
  });

  async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  }
})();
