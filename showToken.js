// netlify/functions/showToken.js
export async function handler() {
  return {
    statusCode: 200,
    body: process.env.TOKEN_POSTER
      ? `✅ TOKEN terdeteksi: ${process.env.TOKEN_POSTER.slice(0, 8)}...`
      : '❌ TOKEN tidak terbaca!',
  };
}
