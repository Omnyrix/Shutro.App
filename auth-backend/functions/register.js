const bcrypt = require("bcryptjs");

let users = [];

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  const { username, password, email } = JSON.parse(event.body);
  if (users.find(u => u.username === username)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Username already exists" }),
    };
  }
  const hash = bcrypt.hashSync(password, 10);
  users.push({ username, password: hash, email });
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};