const fetch = require('node-fetch');

exports.handler = async function () {
  const GITHUB_TOKEN = process.env.TOKEN_AUTH;
  const repo = 'tafsirnetlifyapp/posterauth'; // Ganti dengan repo privat kamu
  const filePath = 'private_auth.js';

  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  });

  if (!res.ok) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Gagal ambil hash" })
    };
  }

  const content = await res.text();
  return {
    statusCode: 200,
    body: content
  };
};
