(async function () {
  const res = await fetch('/.netlify/functions/fetchPrivateAuth');
  const data = await res.json();
  const correctHash = data.hash;

  const promptMessage = "Masukkan secret untuk mengakses halaman:";
  const errorMessage = "Password salah. Coba lagi.";

  const userInput = prompt(promptMessage);
  const userHash = await sha256(userInput);

  if (userHash !== correctHash) {
    document.body.innerHTML = `<h2 style="text-align:center;color:red">${errorMessage}</h2>`;
    throw new Error("❌ Akses ditolak");
  }

  // Fungsi hash SHA-256
  async function sha256(str) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(hash))
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
  }
})();
