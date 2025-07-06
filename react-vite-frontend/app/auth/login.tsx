import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eraseCookie, setCookie } from "../utils/cookie";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loading from "./auth_loading";
// import Turnstile from "../components/Turnstile";
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
  // const [turnstileToken, setTurnstileToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // const [tsKey, setTsKey] = useState(0);
  const [loggingIn, setLoggingIn] = useState(false);
  const [redirectingToVerify, setRedirectingToVerify] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoggingIn(true);
    // setTsKey(prev => prev + 1);

    // Removed Turnstile and human verification

    const sanitizedEmail = email.toLowerCase();
    const result = await loginUser({ email: sanitizedEmail, password });

    if (result.error === "Account not verified") {
      setRedirectingToVerify(true);
      await setCookie("verification", sanitizedEmail);
      setTimeout(() => {
        navigate("/auth/verify");
      }, 1000); // slight delay for UX
      return;
    }

    if (result.error) {
      setError(result.error);
      setLoggingIn(false);
      return;
    }

    await setCookie("session", result.session || sanitizedEmail); // Use backend session value if provided, fallback to email
    navigate("/home");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <AnimatePresence>{loading && <Loading />}</AnimatePresence>

      {!loading && (
        <div
          className="bg-gray-900 rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
          style={{
            minWidth: 0,
            width: "90vw",
            maxWidth: 400,
          }}
        >
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
            {/* Turnstile removed */}

            {error && <div className="text-red-500 text-center">{error}</div>}

            <button
              className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition"
              type="submit"
              disabled={loggingIn || redirectingToVerify}
            >
              {redirectingToVerify
                ? "Redirecting to Verify page..."
                : loggingIn
                ? "Logging in..."
                : "Login"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="#/auth/register" className="text-sm text-blue-400 underline font-bold items-center">
              Join us today
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
