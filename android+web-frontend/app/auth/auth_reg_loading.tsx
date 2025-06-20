import { useState, useLayoutEffect, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookie";

export default function Loading() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  // Synchronous check: if a session exists, navigate immediately.
  useLayoutEffect(() => {
    const session = getCookie("session");
    if (session) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  // If no session, show a simulated loading animation and then redirect.
  useEffect(() => {
    // Check again in case the session was not set.
    const session = getCookie("session");
    if (!session) {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 100));
      }, 50);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        navigate("/auth/register", { replace: true });
      }, 500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 text-white z-50 transition-opacity duration-500">
      {/* Flashing Math Symbols */}
      <div className="relative flex gap-4 mb-6">
        <p className="text-6xl font-bold text-gray-300 animate-fade-in-out1">Σ</p>
        <p className="text-5xl font-bold text-gray-400 animate-fade-in-out2">π</p>
        <p className="text-4xl font-bold text-gray-500 animate-fade-in-out3">∞</p>
        <p className="text-6xl font-bold text-gray-300 animate-fade-in-out4">√</p>
        <p className="text-5xl font-bold text-gray-400 animate-fade-in-out5">∫</p>
      </div>

      {/* Dynamic Loading Bar */}
      <div className="w-64 bg-gray-700 rounded-full h-3 relative overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Loading Progress */}
      <p className="mt-4 text-gray-300 text-lg">Loading... {progress}%</p>
    </div>
  );
}