exports.handler = async () => {
  const token = process.env.GITHUB_PAT;

  if (!token) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Token tidak ditemukan." })
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ GITHUB_TOKEN: token })
  };
};
