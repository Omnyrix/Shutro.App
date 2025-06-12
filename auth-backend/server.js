const express = require("express");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const USERS_DIR = path.join(__dirname, "users_info");

// Ensure the users_info directory exists
if (!fs.existsSync(USERS_DIR)) fs.mkdirSync(USERS_DIR);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

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
        // If error reading a file, skip to the next.
        continue;
      }
    }
    if (!found) {
      return res.status(404).json({ error: "User not found" });
    }
  }

  try {
    const userData = yaml.load(fs.readFileSync(userFile, "utf8"));
    // Return the username and email (fallback to identifier if email is missing)
    return res.json({ username: userData.username, email: userData.email || identifier });
  } catch (e) {
    return res.status(500).json({ error: "Failed to read user data" });
  }
});

// Register user endpoint
app.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ error: "Missing fields" });
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
  const createdTime = Date.now(); // Store time of registration

  fs.writeFileSync(userFile, yaml.dump({ email: lowerEmail, username: lowerUsername, password, code, createdTime }), "utf8");
  console.log(`🔑 Demo verification code for ${lowerEmail}: ${code}`);
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

    // Removed time check; immediately delete the file if code doesn't match.
    if (tempUser.code !== code) {
      fs.unlinkSync(userFile);
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Hash the password and finalize account
    const passwordHash = bcrypt.hashSync(tempUser.password, 10);
    const finalData = {
      email: tempUser.email,
      username: tempUser.username.toLowerCase(),
      password: passwordHash,
      verified: true,
      createdTime: tempUser.createdTime
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
    return res.status(400).json({ error: "User not found" });
  }
  try {
    const user = yaml.load(fs.readFileSync(userFile, "utf8"));
    if (!user.verified) return res.status(401).json({ error: "Account not verified" });
    if (bcrypt.compareSync(password, user.password)) {
      return res.json({ success: true });
    } else {
      return res.status(401).json({ error: "Incorrect password" });
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🟢 Server running on http://localhost:${PORT}`);
});
