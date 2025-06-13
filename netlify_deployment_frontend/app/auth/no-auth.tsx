import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setCookie, eraseCookie } from "../utils/cookie";
import Turnstile from "../components/Turnstile";
import Loading from "./no-auth-loading"; // Using the loading page component

const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL; // adjust if needed

export default function WithoutAccount() {
  const [username, setUsername] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // used only during form submission
  const [initialLoading, setInitialLoading] = useState(true); // used for initial page load
  const [longWait, setLongWait] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter your name.");
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
        username: username.trim(),
      });

      clearTimeout(timer);

      if (res.data.success) {
        // Clear any previous cookies.
        eraseCookie("session");
        eraseCookie("verification");
        // Set the session cookie with the entered username (lowercased).
        setCookie("session", username.trim().toLowerCase());
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
    // Simulate initial loading (e.g., reading any initial data if needed)
    // Here you can add any initial fetching if required.
    // For our purposes, we simply wait for 500ms.
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Show full-page loading only during the initial page load.
  if (initialLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-80">
        <h1 className="text-xl font-bold text-white text-center mb-4">
          Continue Without an Account
        </h1>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
            required
            disabled={loading}
          />
          <div className="flex items-center">
            <Turnstile
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
    </div>
  );
}
