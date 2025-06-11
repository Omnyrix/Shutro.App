const express = require("express");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const bcrypt = require("bcrypt");
const cors = require("cors");
const https = require("https");

const app = express();
const USERS_DIR = path.join(__dirname, "users_info");
const AVATAR_DIR = path.join(__dirname, "avatars");

if (!fs.existsSync(USERS_DIR)) fs.mkdirSync(USERS_DIR);
if (!fs.existsSync(AVATAR_DIR)) fs.mkdirSync(AVATAR_DIR);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/avatars", express.static(AVATAR_DIR)); // Serve avatars

// Get user data (username and avatar)
app.get("/user/:email", (req, res) => {
  const email = req.params.email.toLowerCase();
  const userFile = path.join(USERS_DIR, `${email}.yml`);
  if (!fs.existsSync(userFile)) return res.status(404).json({ error: "User not found" });

  try {
    const userData = yaml.load(fs.readFileSync(userFile, "utf8"));
    res.json({ username: userData.username, avatar: `/avatars/${userData.username}.png` });
  } catch {
    res.status(500).json({ error: "Failed to read user data" });
  }
});

// Serve avatar image
app.get("/user-icon/:username.png", (req, res) => {
  const username = req.params.username.toLowerCase();
  const avatarPath = path.join(AVATAR_DIR, `${username}.png`);

  if (!fs.existsSync(avatarPath)) return res.status(404).send("Avatar not found");
  res.sendFile(avatarPath);
});

// Register user
app.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  const lowerUsername = username.toLowerCase();

  if (!email || !username || !password) return res.status(400).json({ error: "Missing fields" });

  const userFile = path.join(USERS_DIR, `${email}.yml`);
  if (fs.existsSync(userFile)) return res.status(400).json({ error: "Email already exists" });

  // Ensure username uniqueness
  const files = fs.readdirSync(USERS_DIR);
  for (const file of files) {
    if (!file.endsWith(".yml")) continue;
    try {
      const userData = yaml.load(fs.readFileSync(path.join(USERS_DIR, file), "utf8"));
      if (userData.username.toLowerCase() === lowerUsername) {
        return res.status(400).json({ error: "Username already taken" });
      }
    } catch {}
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  fs.writeFileSync(userFile, yaml.dump({ email, username: lowerUsername, password, code }), "utf8");
  console.log(`🔑 Demo verification code for ${email}: ${code}`);
  res.json({ success: true, message: "Verification code sent", code });
});

// Verify user & download avatar
app.post("/verify", async (req, res) => {
  const { email, code } = req.body;
  const userFile = path.join(USERS_DIR, `${email}.yml`);

  if (!fs.existsSync(userFile)) return res.status(400).json({ error: "User not found" });

  try {
    const tempUser = yaml.load(fs.readFileSync(userFile, "utf8"));
    if (tempUser.code !== code) {
      fs.unlinkSync(userFile); // Delete on failed verification
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Download avatar
    const avatarPath = path.join(AVATAR_DIR, `${tempUser.username}.png`);
    https.get("https://picsum.photos/128/128", (response) => {
      const avatarUrl = response.headers.location;

      https.get(avatarUrl, (imageRes) => {
        const fileStream = fs.createWriteStream(avatarPath);
        imageRes.pipe(fileStream);
        fileStream.on("finish", () => {
          const passwordHash = bcrypt.hashSync(tempUser.password, 10);
          const finalData = {
            email: tempUser.email,
            username: tempUser.username.toLowerCase(),
            password: passwordHash,
            verified: true,
          };
          fs.writeFileSync(userFile, yaml.dump(finalData), "utf8");
          console.log(`✅ Avatar saved for ${email} at /avatars/${tempUser.username}.png`);
          res.json({ success: true });
        });
      });
    });
  } catch (err) {
    res.status(500).json({ error: "Verification failed" });
  }
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const lowerUsername = username.toLowerCase();
  const files = fs.readdirSync(USERS_DIR);

  for (const file of files) {
    if (!file.endsWith(".yml")) continue;
    try {
      const user = yaml.load(fs.readFileSync(path.join(USERS_DIR, file), "utf8"));
      if (user.username === lowerUsername) {
        if (!user.verified) return res.status(401).json({ error: "Account not verified" });
        if (bcrypt.compareSync(password, user.password)) return res.json({ success: true });
        return res.status(401).json({ error: "Incorrect password" });
      }
    } catch {}
  }

  res.status(400).json({ error: "User not found" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🟢 Server running on http://localhost:${PORT}`);
});
