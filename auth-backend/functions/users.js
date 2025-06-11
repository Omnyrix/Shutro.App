let users = [];

exports.handler = async (event) => {
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  }
  if (event.httpMethod === "POST") {
    const { username, password, email } = JSON.parse(event.body);
    if (users.find(u => u.username === username)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Username already exists" }),
      };
    }
    users.push({ username, password, email });
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  }
  return { statusCode: 405, body: "Method Not Allowed" };
};