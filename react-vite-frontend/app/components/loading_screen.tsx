import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookie";

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [hasSession, setHasSession] = useState<null | boolean>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      const session = await getCookie("session");
      setHasSession(!!session);
    }
    checkSession();

    // Animate the loading bar to 100% over 500ms
    const steps = 10;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prev + 100 / steps, 100);
      });
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 text-white z-50 transition-opacity duration-500">
      {/* Extra space below the status bar, inside the loading screen */}
      <div className="w-full" style={{ height: 24, background: "#1f2937", position: "absolute", top: 0, left: 0 }} />
      {/* Debug message: one line, under the space, scaled dynamically, with extra margin */}
      <div
        className="w-full flex justify-center"
        style={{
          position: "absolute",
          top: 36, // 24px (space) + 12px (gap)
          left: 0,
          zIndex: 10,
        }}
      >
        <span
          className="bg-gray-900 px-4 py-2 rounded shadow text-sm text-yellow-300 text-center"
          style={{
            maxWidth: "90vw",
            width: "fit-content",
            fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {hasSession === null
            ? "Detecting session cookie..."
            : hasSession
            ? "Session cookie detected (logged in mode)"
            : "No session cookie detected (demo mode)"}
        </span>
      </div>
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
      <p className="mt-4 text-gray-300 text-lg">Loading... {Math.round(progress)}%</p>
    </div>
  );
}
