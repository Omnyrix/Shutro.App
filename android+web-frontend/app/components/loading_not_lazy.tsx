import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, eraseCookie } from "../utils/cookie";

export default function Loading() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const session = getCookie("session");
    eraseCookie("verification");

    if (!session) {
      eraseCookie("session");
      eraseCookie("verification");
      navigate("/auth/login");
      return;
    }

    // Simulated loading progress
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + (100 / 10), 100));
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [navigate]);

  // Hide the component visually but keep logic running
  return (
    <div className="hidden">
      <div className="relative flex gap-4 mb-6">
        <p className="text-6xl font-bold text-gray-300 animate-fade-in-out1">Σ</p>
        <p className="text-5xl font-bold text-gray-400 animate-fade-in-out2">π</p>
        <p className="text-4xl font-bold text-gray-500 animate-fade-in-out3">∞</p>
        <p className="text-6xl font-bold text-gray-300 animate-fade-in-out4">√</p>
        <p className="text-5xl font-bold text-gray-400 animate-fade-in-out5">∫</p>
      </div>
      <div className="w-64 bg-gray-700 rounded-full h-3 relative overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-4 text-gray-300 text-lg">Loading... {progress}%</p>
    </div>
  );
}
