// netlify/functions/fetchPrivateAuth.js
exports.handler = async function () {
  const GITHUB_TOKEN = process.env.TOKEN_AUTH; // Simpan di Netlify Env
  const repo = 'tafsirnetlifyapp/privateauth';        // REPO PRIVAT
  const filePath = 'private_auth.json';

  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  });

  if (!res.ok) {
    return {
      statusCode: res.status,
      body: JSON.stringify({ error: 'Gagal mengambil hash' })
    };
  }

  const data = await res.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
