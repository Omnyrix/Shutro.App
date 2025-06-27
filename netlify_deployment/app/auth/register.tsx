import { useState, useEffect } from "react";
import { setCookie } from "../utils/cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Turnstile from "../components/Turnstile";
import Loading from "./auth_reg_loading";
import { AnimatePresence } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKSTAGE_URL || import.meta.env.VITE_BACKEND_URL;

export default function Register() {
  const [pageLoading, setPageLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTurnstileKey((prev) => prev + 1);

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
    if (!turnstileToken) {
      setError("Please confirm you are not a robot.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/register`, {
        username: username.replace(/\s/g, ""),
        password,
        email,
        turnstileToken,
      });
      setLoading(false);
      if (res.data.success) {
        setCookie("verification", email.toLowerCase());
        navigate("/auth/verify");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.error || "Sorry, servers down. Please try again later.");
    }
  }

  const showMismatch = confirm.length > 0 && password !== confirm;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <AnimatePresence>
        {pageLoading && <Loading />}
      </AnimatePresence>

      {!pageLoading && (
        <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-80">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-white">Register</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <input
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.replace(/\s/g, ""))
              }
              required
              pattern="(?=.*[A-Za-z].*[A-Za-z].*[A-Za-z])[A-Za-z0-9]+"
              title="Username must contain only letters and numbers with no spaces and at least 3 letters."
            />
            <input
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                className="w-full border border-gray-700 bg-gray-800 text-white p-2 pr-10 rounded focus:outline-none focus:border-blue-500"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 opacity-70 hover:opacity-100"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative">
              <input
                className="w-full border border-gray-700 bg-gray-800 text-white p-2 pr-10 rounded focus:outline-none focus:border-blue-500"
                placeholder="Confirm Password"
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 opacity-70 hover:opacity-100"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {showMismatch && (
              <div className="text-yellow-500 text-center text-sm">
                Passwords do not match.
              </div>
            )}
            <div className="flex items-center">
              <Turnstile
                key={turnstileKey}
                sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY || ""}
                onVerify={(token) => {
                  console.log("Turnstile token received:", token);
                  setTurnstileToken(token);
                }}
                scale={0.8}
              />
            </div>
            <button
              className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition"
              type="submit"
              disabled={loading || (confirm.length > 0 && password !== confirm)}
            >
              {loading ? "Creating account..." : "Register"}
            </button>

            {/* ✅ Bottom error message only */}
            {error && (
              <div className="text-red-500 mt-4 text-center">
                {error}
              </div>
            )}
          </form>

          <div className="mt-4 text-center">
            <a href="/auth/login" className="text-blue-400 underline font-bold text-sm">
              Already have an account?
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
