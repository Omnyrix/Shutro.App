import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, eraseCookie } from "../utils/cookie";
import { motion } from "framer-motion";

interface VerificationLoaderProps {
  onComplete: (verification: string) => void;
}

export default function VerificationLoader({ onComplete }: VerificationLoaderProps) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check for the "verification" cookie.
    const verification = getCookie("verification");

    // Simulated loading animation exactly like your provided Loading screen.
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + (100 / 10), 100));
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (verification) {
        // Erase the cookie immediately so it can't be reused.
        eraseCookie("verification");
        onComplete(verification);
      } else {
        // If no verification cookie found, redirect immediately.
        navigate("/auth/register");
      }
    }, 500); // Ensures progress reaches 100% within 0.5s

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 text-white z-50 transition-opacity duration-500"
    >
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
    </motion.div>
  );
}
