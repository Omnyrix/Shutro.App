import { useState } from "react";
import { setCookie } from "../utils/cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

async function validateEmailWithMailboxLayer(email: string): Promise<{ isValid: boolean; error?: string }> {
  const apiKey = import.meta.env.VITE_MAILBOXLAYER_API_KEY;
  if (!apiKey) return { isValid: false, error: "Email verification API key not set." };
  try {
    const res = await axios.get(
      `https://apilayer.net/api/check?access_key=${apiKey}&email=${encodeURIComponent(email)}`
    );
    if (res.data.format_valid && res.data.smtp_check) {
      return { isValid: true };
    }
    return { isValid: false, error: "Email address is not valid or does not exist." };
  } catch {
    return { isValid: false, error: "Failed to verify email address." };
  }
}

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "verify">("form");
  const [enteredCode, setEnteredCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHuman, setIsHuman] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (!isHuman) {
      setError("Please confirm you are not a robot.");
      setLoading(false);
      return;
    }

    const { isValid, error: emailError } = await validateEmailWithMailboxLayer(email);
    setLoading(false);

    if (!isValid) {
      setError(emailError || "Invalid email address.");
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/register`, {
        username: username.replace(/\s/g, ""), // Remove spaces
        password,
        email,
      });
      setLoading(false);
      if (res.data.success) {
        setStep("verify");
        setError("");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Backend not connected");
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${backendUrl}/verify`, { email, code: enteredCode });
      if (res.data.success) {
        setCookie("session", username.replace(/\s/g, "")); // Remove spaces before setting session
        navigate("/home");
      } else {
        setError("Verification failed.");
        setTimeout(() => location.reload(), 1000); // Auto-reload after 1 second
      }
    } catch (err) {
      setError("Verification failed.");
      setTimeout(() => location.reload(), 1000); // Auto-reload after 1 second
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-80">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-white">Register</h1>
        </div>
        {step === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <input
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value.replace(/\s/g, ""))} // Remove spaces on input change
              required
            />
            <input
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <input
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Confirm Password"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="robot-check"
                checked={isHuman}
                onChange={e => setIsHuman(e.target.checked)}
                className="mr-2"
                required
              />
              <label htmlFor="robot-check" className="text-white text-sm">I am not a robot</label>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <button
              className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition"
              type="submit"
              disabled={loading}
            >
              {loading ? "Checking Email..." : "Register"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="text-white text-center mb-2">Enter the 6-digit code sent to your email.</div>
            <input
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Verification Code"
              value={enteredCode}
              onChange={e => setEnteredCode(e.target.value)}
              required
            />
            {error && <div className="text-red-500">{error}</div>}
            <button className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition" type="submit">
              Verify & Complete Registration
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          <a href="/auth/login" className="text-blue-400 underline">Already have an account?</a>
        </div>
      </div>
    </div>
  );
}
