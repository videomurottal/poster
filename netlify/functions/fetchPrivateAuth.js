// netlify/functions/fetchAuth.js

exports.handler = async function () {
  const GITHUB_TOKEN = process.env.TOKEN_AUTH;
  const repo = 'tafsirnetlifyapp/posterauth'; // ← Ganti dengan repo privat kamu
  const filePath = 'private_auth.js'; // bisa juga private_auth.js kalau pakai JS

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
      body: `Gagal fetch: ${res.statusText}`
    };
  }

  const content = await res.text(); // bisa .json() jika kamu yakin isinya JSON
  return {
    statusCode: 200,
    body: content
  };
};
