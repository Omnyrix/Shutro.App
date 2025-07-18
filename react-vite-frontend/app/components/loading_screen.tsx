import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, eraseCookie } from "../utils/cookie";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Toggle this to enable/disable the online session‐validation step
const enableSessionValidation = true;

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [progressDuration, setProgressDuration] = useState(0);
  const [hasSession, setHasSession] = useState<null | boolean>(null);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // clear any stored scroll position
    eraseCookie("scrollpos");

    const startTime = Date.now();

    async function performSessionCheck() {
      const raw = await getCookie("session");

      // no cookie → demo
      if (!raw) {
        setHasSession(false);
        return;
      }

      // try parse JSON { email, username }
      let email: string;
      try {
        const sessionData = JSON.parse(raw);
        email = sessionData.email;
        if (!email) throw new Error("no email");
      } catch {
        // legacy: treat raw as email if it looks like one
        email = raw;
      }

      // cookie present but validation disabled or offline → trust cookie
      if (!enableSessionValidation || !navigator.onLine) {
        setHasSession(true);
        return;
      }

      // online + validation enabled → hit backend
      try {
        const res = await axios.get(`${backendUrl}/user/${email}`);
        if (res.data?.username) {
          setHasSession(true);
        } else {
          // mismatch → clear and demo
          await eraseCookie("session");
          setHasSession(false);
          setDebugMessage("Session mismatch—cleared. (demo mode)");
        }
      } catch {
        // error → clear and demo
        await eraseCookie("session");
        setHasSession(false);
        setDebugMessage("Session validation error—cleared. (demo mode)");
      }
    }

    performSessionCheck().then(() => {
      // when check done, drive the bar to 100% over elapsed ms (or 500 ms if feature off)
      const elapsed = Date.now() - startTime;
      setProgressDuration(enableSessionValidation ? elapsed : 500);
      setProgress(100);
    });
  }, []);

  const renderDebugText = () => {
    if (hasSession === null) return "Detecting session cookie...";
    if (hasSession) return "Session cookie detected (logged in mode)";
    if (debugMessage) return debugMessage;
    return "No session cookie detected (demo mode)";
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 text-white z-50">
      {/* Status‐bar spacer */}
      <div
        className="w-full"
        style={{
          height: 24,
          background: "#1f2937",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Debug message */}
      <div
        className="w-full flex justify-center"
        style={{
          position: "absolute",
          top: 36,
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
          {renderDebugText()}
        </span>
      </div>

      {/* Flashing math symbols */}
      <div className="relative flex gap-4 mb-6">
        <p className="text-6xl font-bold text-gray-300 animate-fade-in-out1">Σ</p>
        <p className="text-5xl font-bold text-gray-400 animate-fade-in-out2">π</p>
        <p className="text-4xl font-bold text-gray-500 animate-fade-in-out3">∞</p>
        <p className="text-6xl font-bold text-gray-300 animate-fade-in-out4">√</p>
        <p className="text-5xl font-bold text-gray-400 animate-fade-in-out5">∫</p>
      </div>

      {/* Dynamic loading bar */}
      <div className="w-64 bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="bg-blue-500 h-full"
          style={{
            width: `${progress}%`,
            transition: `width ${progressDuration}ms linear`,
          }}
        />
      </div>

      {/* Percentage */}
      <p className="mt-4 text-gray-300 text-lg">
        Loading... {Math.round(progress)}%
      </p>
    </div>
  );
}
