import React, { useEffect, useState, useCallback } from "react";

export default function NoInternetWarning() {
  const [show, setShow] = useState(false);
  const [reloadError, setReloadError] = useState("");

  // Function to check connectivity
  const checkInternetConnectivity = useCallback(async () => {
    try {
      await fetch("https://www.google.com", { method: "HEAD", mode: "no-cors" });
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function updateConnectionStatus() {
      const isOnline = await checkInternetConnectivity();
      if (!cancelled) {
        setShow(!isOnline);
      }
    }

    // Initial status check
    updateConnectionStatus();
    // Re-check every 1 second
    const interval = setInterval(updateConnectionStatus, 1000);

    // Listen for online/offline events
    window.addEventListener("online", updateConnectionStatus);
    window.addEventListener("offline", () => setShow(true));

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("online", updateConnectionStatus);
      window.removeEventListener("offline", () => setShow(true));
    };
  }, [checkInternetConnectivity]);

  // Handle reload attempts
  const handleReload = async () => {
    const isOnline = await checkInternetConnectivity();
    if (isOnline) {
      window.location.reload();
    } else {
      setReloadError("Still no connection. Please try again.");
      // Clear error after a short delay
      setTimeout(() => setReloadError(""), 3000);
    }
  };

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
          {reloadError && (
            <p className="text-red-500 text-sm mb-2">{reloadError}</p>
          )}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition"
            onClick={handleReload}
          >
            Reload
          </button>
        </div>
      </div>
    </>
  );
}
