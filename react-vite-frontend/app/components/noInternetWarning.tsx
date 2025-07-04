import React, { useEffect, useState } from "react";

export default function NoInternetWarning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkInternet() {
      try {
        await fetch("https://www.google.com", { method: "HEAD", mode: "no-cors" });
        if (!cancelled) setShow(false);
      } catch {
        if (!cancelled) setShow(true);
      }
    }

    // Initial check
    checkInternet();

    // Re-check every 10 seconds
    const interval = setInterval(checkInternet, 10000);

    // Listen for browser online/offline events
    function handleOnline() {
      checkInternet();
    }
    function handleOffline() {
      setShow(true);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!show) return null;
  return (
    <>
      {/* Spacer for status bar/notch */}
      <div
        className="w-full"
        style={{ height: "env(safe-area-inset-top, 0px)", background: "#111827" }}
      />

      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-800 bg-opacity-95">
        <div className="bg-gray-800 text-white rounded-lg shadow-lg px-4 sm:px-8 py-4 sm:py-6 flex flex-col items-center w-[90vw] max-w-xs sm:max-w-sm md:max-w-md border border-blue-400 scale-[0.95] sm:scale-100 transition-transform duration-200">
          <span className="text-3xl mb-2">⚠️</span>
          <h2 className="font-bold text-lg mb-2 text-blue-400">No Internet Connection</h2>
          <p className="text-center text-sm mb-2">
            We couldn't reach the server. Please check your connection.
          </p>
          <p className="text-center text-xs text-gray-400 mb-2">
            <span className="font-semibold text-blue-300">Tip:</span> Log in to enable offline access to the app.
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      </div>
    </>
  );
}
