// netlify/functions/fetchPageMap.js

export async function handler(event, context) {
  const token = process.env.TOKEN_POSTER;

  const githubApiUrl =
    'https://api.github.com/repos/videomurottal/srt/contents/pages.json?ref=refs/heads/main';

  try {
    const response = await fetch(githubApiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3.raw',
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Error fetching page map: ${response.statusText}`,
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Server error: ${error.message}`,
    };
  }
}
