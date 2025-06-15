import { useState, useEffect } from "react";
import { setCookie, eraseCookie, getCookie } from "../utils/cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Turnstile from "../components/Turnstile";
import Loading from "./no-auth-loading"; // Using the loading page component
import { AnimatePresence } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL; // adjust if needed

export default function WithoutAccount() {
  const [username, setUsername] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // used only during form submission
  const [initialLoading, setInitialLoading] = useState(true); // used for initial page load
  const [longWait, setLongWait] = useState(false);
  // Used to force re-render of the Turnstile component when needed.
  const [turnstileKey, setTurnstileKey] = useState(0);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Force re-render of Turnstile component
    setTurnstileKey((prev) => prev + 1);

    const trimmed = username.trim();
    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }
    // Input now never contains spaces (they have been stripped in onChange),
    // but we keep a regex check to enforce only alphanumerics.
    if (!/^[A-Za-z0-9]+$/.test(trimmed)) {
      setError("Name must contain only letters and numbers; spaces are not allowed.");
      return;
    }
    // Ensure that the name has at least 3 letters.
    const letterCount = (trimmed.match(/[A-Za-z]/g) || []).length;
    if (letterCount < 3) {
      setError("Name must contain at least 3 letters.");
      return;
    }

    if (!turnstileToken) {
      setError("Please confirm you are not a robot.");
      return;
    }

    setLoading(true);
    setLongWait(false);

    // Set a timer to show a long-wait message after 10 seconds.
    const timer = setTimeout(() => {
      setLongWait(true);
    }, 10000);

    try {
      // Use the demo account endpoint.
      const res = await axios.post(`${backendUrl}/demo`, {
        username: trimmed,
      });

      clearTimeout(timer);

      if (res.data.success) {
        // Clear any previous cookies.
        eraseCookie("session");
        eraseCookie("verification");
        // Set the session cookie with the entered username (lowercased).
        setCookie("session", trimmed.toLowerCase());
        navigate("/home");
      } else {
        setError(res.data.error || "Failed to create a demo account.");
        setLoading(false);
      }
    } catch (err: any) {
      clearTimeout(timer);
      setError(err.response?.data?.error || "Server error, please try again later.");
      setLoading(false);
    }
  }

  useEffect(() => {
    // Simulate initial loading delay of 500ms.
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <AnimatePresence>{initialLoading && <Loading />}</AnimatePresence>
      {!initialLoading && (
        <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-80 mx-4">
          <h1 className="text-xl font-bold text-white text-center mb-4">
            Continue Without an Account
          </h1>
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) =>
                // Automatically remove spaces from the input
                setUsername(e.target.value.replace(/\s/g, ""))
              }
              className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
              required
              disabled={loading}
            />
            <div className="flex items-center">
              <Turnstile
                key={turnstileKey} // Force re-render via key update
                sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY || ""}
                onVerify={(token) => {
                  console.log("Turnstile token received:", token);
                  setTurnstileToken(token);
                }}
                scale={0.8}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? "Creating Account…" : "Use without an Account"}
            </button>
            {longWait && (
              <div className="mt-4 text-yellow-400 text-center">
                Taking too much time. Please refresh the page.
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
