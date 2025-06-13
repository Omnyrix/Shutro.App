require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const bcrypt = require("bcrypt");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");

const app = express();
const USERS_DIR = path.join(__dirname, "users_info");

// Ensure the users_info directory exists
if (!fs.existsSync(USERS_DIR)) fs.mkdirSync(USERS_DIR);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Logging middleware: Log every request to the console.
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Create Nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL_ADDRESS,
    pass: process.env.GOOGLE_EMAIL_PASSWORD,
  },
});

/**
 * Helper function to verify the Turnstile token.
 * Returns the response from Cloudflare.
 */
async function verifyTurnstileToken(token, remoteip) {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) {
    throw new Error("TURNSTILE_SECRET environment variable is not set.");
  }
  const verificationData = new URLSearchParams();
  verificationData.append("secret", secret);
  verificationData.append("response", token);
  verificationData.append("remoteip", remoteip);

  const cfRes = await axios.post(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    verificationData.toString(),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return cfRes.data;
}

// New route for Turnstile verification, used independently
app.post("/verify-turnstile", async (req, res) => {
  const { turnstileToken } = req.body;
  if (!turnstileToken) {
    return res.status(400).json({ error: "Missing turnstile token" });
  }
  try {
    const result = await verifyTurnstileToken(turnstileToken, req.ip);
    if (!result.success) {
      console.error("Turnstile verification failed:", result);
      return res.status(400).json({ error: "Human varification failed. Please reload the page", details: result });
    }
    res.json({ success: true, details: result });
  } catch (err) {
    console.error(
      "Turnstile verification error:",
      err.response ? err.response.data : err.message
    );
    return res.status(500).json({
      error: "Human varification failed. Please reload the page",
      details: err.response ? err.response.data : err.message,
    });
  }
});

// GET user data (return username and email)
app.get("/user/:identifier", (req, res) => {
  const identifier = req.params.identifier.toLowerCase();
  let userFile = path.join(USERS_DIR, `${identifier}.yml`);

  // If there's no file by that name, try to find a matching username.
  if (!fs.existsSync(userFile)) {
    const files = fs.readdirSync(USERS_DIR);
    let found = false;
    for (const file of files) {
      if (!file.endsWith(".yml")) continue;
      try {
        const filePath = path.join(USERS_DIR, file);
        const userData = yaml.load(fs.readFileSync(filePath, "utf8"));
        // Compare usernames in lowercase for an exact match.
        if (userData.username && userData.username.toLowerCase() === identifier) {
          userFile = filePath;
          found = true;
          break;
        }
      } catch (err) {
        continue;
      }
    }
    if (!found) {
      return res.status(404).json({ error: "User not found" });
    }
  }
  try {
    const userData = yaml.load(fs.readFileSync(userFile, "utf8"));
    return res.json({ 
      username: userData.username, 
      email: userData.email || identifier,
      demo: userData.demo || false
    });
  } catch (e) {
    return res.status(500).json({ error: "Failed to read user data" });
  }
});


// Register user endpoint
app.post("/register", async (req, res) => {
  const { email, username, password, turnstileToken } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }
  if (!turnstileToken) {
    return res.status(400).json({ error: "Missing turnstile token" });
  }
  
  // Verify Turnstile token using our helper function.
  try {
    const verificationResult = await verifyTurnstileToken(turnstileToken, req.ip);
    if (!verificationResult.success) {
      console.error("Turnstile verification failed:", verificationResult);
      return res.status(400).json({ error: "Human varification failed. Please reload the page" });
    }
  } catch (err) {
    console.error(
      "Turnstile verification error:",
      err.response ? err.response.data : err.message
    );
    return res.status(500).json({ error: "Human varification failed. Please reload the page" });
  }

  const lowerEmail = email.toLowerCase();
  const lowerUsername = username.toLowerCase();
  const userFile = path.join(USERS_DIR, `${lowerEmail}.yml`);
  if (fs.existsSync(userFile)) {
    return res.status(400).json({ error: "Email already exists" });
  }

  // Check for username uniqueness
  const files = fs.readdirSync(USERS_DIR);
  for (let file of files) {
    if (!file.endsWith(".yml")) continue;
    try {
      const userData = yaml.load(fs.readFileSync(path.join(USERS_DIR, file), "utf8"));
      if (userData.username.toLowerCase() === lowerUsername) {
        return res.status(400).json({ error: "Username already taken" });
      }
    } catch (e) {}
  }

  // Generate verification code and store registration timestamp
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const createdTime = Date.now();

  // Save the temporary registration data
  fs.writeFileSync(
    userFile,
    yaml.dump({ email: lowerEmail, username: lowerUsername, password, code, createdTime }),
    "utf8"
  );
  console.log(`🔑 Demo verification code for ${lowerEmail}: ${code}`);

  // Send verification email using Gmail SMTP
  const mailOptions = {
    from: process.env.GOOGLE_EMAIL_ADDRESS,
    to: lowerEmail,
    subject: "Your Verification Code",
    text: `Hello ${username},\n\nYour verification code is: ${code}\n\nThank you for registering!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending verification email:", error);
      // Optionally, delete the user file if required.
      // fs.unlinkSync(userFile);
    } else {
      console.log("Verification email sent:", info.response);
    }
  });

  res.json({ success: true, message: "Verification code sent", code });
});

// Verify user endpoint (removes time check)
app.post("/verify", async (req, res) => {
  const { email, code } = req.body;
  const lowerEmail = email.toLowerCase();
  const userFile = path.join(USERS_DIR, `${lowerEmail}.yml`);
  if (!fs.existsSync(userFile)) {
    return res.status(400).json({ error: "User not found" });
  }
  try {
    const tempUser = yaml.load(fs.readFileSync(userFile, "utf8"));
    if (tempUser.code !== code) {
      fs.unlinkSync(userFile);
      return res.status(400).json({ error: "Invalid verification code" });
    }
    const passwordHash = bcrypt.hashSync(tempUser.password, 10);
    const finalData = {
      email: tempUser.email,
      username: tempUser.username.toLowerCase(),
      password: passwordHash,
      verified: true,
      createdTime: tempUser.createdTime,
    };
    fs.writeFileSync(userFile, yaml.dump(finalData), "utf8");
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Verification failed" });
  }
});

// Login endpoint (uses email for login)
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const lowerEmail = email.toLowerCase();
  const userFile = path.join(USERS_DIR, `${lowerEmail}.yml`);
  if (!fs.existsSync(userFile)) {
    return res.status(400).json({ error: "Incorrect email or password." });
  }
  try {
    const user = yaml.load(fs.readFileSync(userFile, "utf8"));
    if (!user.verified) return res.status(401).json({ error: "Account not verified" });
    if (bcrypt.compareSync(password, user.password)) {
      return res.json({ success: true });
    } else {
      return res.status(401).json({ error: "Incorrect email or password." });
    }
  } catch (e) {
    return res.status(500).json({ error: "Login failed" });
  }
});

// Re-register endpoint for changing password
app.post("/re-register", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  const lowerEmail = email.toLowerCase();
  const userFile = path.join(USERS_DIR, `${lowerEmail}.yml`);
  if (!fs.existsSync(userFile)) {
    return res.status(404).json({ error: "User not found" });
  }
  try {
    const userData = yaml.load(fs.readFileSync(userFile, "utf8"));
    if (!bcrypt.compareSync(currentPassword, userData.password)) {
      return res.status(401).json({ error: "Incorrect current password" });
    }
    const newHash = bcrypt.hashSync(newPassword, 10);
    userData.password = newHash;
    fs.writeFileSync(userFile, yaml.dump(userData), "utf8");
    res.json({ success: true, message: "Password updated successfully" });
  } catch (e) {
    res.status(500).json({ error: "Failed to update password" });
  }
});

// New route for creating a demo account.
app.post("/demo", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Missing username for demo account" });
  }
  const lowerUsername = username.toLowerCase();
  const userFile = path.join(USERS_DIR, `${lowerUsername}.yml`);
  if (fs.existsSync(userFile)) {
    return res.status(400).json({ error: "An account with that name already exists" });
  }
  const demoData = {
    username: lowerUsername,
    email: `${lowerUsername}@demo.com`,
    demo: true,
    createdTime: Date.now(),
  };

  try {
    fs.writeFileSync(userFile, yaml.dump(demoData), "utf8");
    res.json({ success: true, message: "It's a demo account", account: demoData });
  } catch (e) {
    res.status(500).json({ error: "Failed to create demo account" });
  }
});

// New DELETE route for deleting a demo account.
app.delete("/demo/:identifier", (req, res) => {
  const identifier = req.params.identifier.toLowerCase();
  const userFile = path.join(USERS_DIR, `${identifier}.yml`);
  if (!fs.existsSync(userFile)) {
    return res.status(404).json({ error: "Demo account not found" });
  }
  try {
    const userData = yaml.load(fs.readFileSync(userFile, "utf8"));
    if (!userData.demo) {
      return res.status(400).json({ error: "Not a demo account" });
    }
    fs.unlinkSync(userFile);
    return res.json({ success: true, message: "Demo account deleted" });
  } catch (e) {
    return res.status(500).json({ error: "Failed to delete demo account" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🟢 Server running on http://localhost:${PORT}`);
});
