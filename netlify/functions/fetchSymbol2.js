// netlify/functions/fetchSymbol2.js
export async function handler(event, context) {
  const token = process.env.TOKEN_POSTER;

  const githubApiUrl =
    'https://api.github.com/repos/tafsirnetlifyapp/qurantext/contents/symbol2.json?ref=refs/heads/main';

  try {
    const response = await fetch(githubApiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3.raw',
      },
    });

    if (!response.ok) {
      return { statusCode: response.status, body: await response.text() };
    }

    const data = await response.text();
    return {
      statusCode: 200,
      body: data,
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (err) {
    return { statusCode: 500, body: `Error: ${err.message}` };
  }
}
