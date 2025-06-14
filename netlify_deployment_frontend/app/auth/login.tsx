import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../utils/cookie";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for show/hide password toggle
import Loading from "./auth_loading"; // Import loading component
import Turnstile from "../components/Turnstile"; // Import Cloudflare Turnstile component
import { AnimatePresence } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

async function loginUser({ email, password }: { email: string; password: string }) {
  try {
    const res = await axios.post(`${backendUrl}/login`, {
      email: email.toLowerCase(),
      password,
    });
    return res.data;
  } catch (err: any) {
    if (err.response) {
      return { error: err.response.data.error || "Incorrect email or password." };
    }
    return { error: "Sorry servers down, please try again later." };
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tsKey, setTsKey] = useState(0); // Added state for forcing Turnstile re-render
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    // Force re-render of Turnstile widget when login is clicked.
    setTsKey(prev => prev + 1);

    if (!turnstileToken) {
      setError("Please confirm you are not a robot.");
      return;
    }

    // Verify Turnstile token using the new /verify-turnstile endpoint.
    try {
      const verRes = await axios.post(`${backendUrl}/verify-turnstile`, { turnstileToken });
      if (!verRes.data.success) {
        setError("Turnstile verification failed. Please try again.");
        return;
      }
    } catch (err: any) {
      setError("Human verification failed. Please reload the page");
      return;
    }

    const sanitizedEmail = email.toLowerCase();
    const result = await loginUser({ email: sanitizedEmail, password });

    if (result.error) {
      setError(result.error);
      return;
    }

    setCookie("session", sanitizedEmail);
    navigate("/home");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <AnimatePresence>
        {loading && <Loading />} {/* Show loading screen with faster exit (0.1s) */}
      </AnimatePresence>

      {!loading && (
        <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-80">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-white">Login</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <div className="relative w-full">
              <input
                className="w-full border border-gray-700 bg-gray-800 text-white p-2 pr-12 rounded focus:outline-none focus:border-blue-500"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 opacity-70 hover:opacity-100"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="flex items-center">
              <Turnstile
                key={tsKey}  // Added key to force re-render
                sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY || ""}
                onVerify={(token) => {
                  console.log("Turnstile onVerify callback fired. Token:", token);
                  setTurnstileToken(token);
                }}
                scale={0.8}
              />
            </div>

            {error && <div className="text-red-500 text-center">{error}</div>}

            <button className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition" type="submit">
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="/auth/register" className="text-sm text-blue-400 underline font-bold items-center">
              Join us today
            </a>
          </div>
          <div className="mt-2 text-center">
            <a href="/auth/no-auth" className="text-sm text-blue-400 underline font-bold">
              Continue without an account
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
