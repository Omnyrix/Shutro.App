const bcrypt = require("bcryptjs");

let users = [];

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  const { username, password } = JSON.parse(event.body);
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Invalid credentials" }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};