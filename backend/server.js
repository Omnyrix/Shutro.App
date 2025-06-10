require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let users = [];
let pendingVerifications = {}; // { email: { code, username, passwordHash } }

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

transporter.verify(function(error, success) {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter is ready");
  }
});

app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: "Username already exists" });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Email already registered" });
  }
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const passwordHash = bcrypt.hashSync(password, 10);
  pendingVerifications[email] = { code, username, passwordHash };

  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}`,
    });
    res.json({ success: true, message: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send verification email" });
  }
});

app.post("/verify", (req, res) => {
  const { email, code } = req.body;
  const pending = pendingVerifications[email];
  if (!pending || pending.code !== code) {
    return res.status(400).json({ error: "Invalid verification code" });
  }
  users.push({ username: pending.username, password: pending.passwordHash, email });
  delete pendingVerifications[email];
  res.json({ success: true });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  res.json({ success: true });
});

app.get("/users", (req, res) => {
  res.json(users.map(u => ({ username: u.username, email: u.email })));
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));