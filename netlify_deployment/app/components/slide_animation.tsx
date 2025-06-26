import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function TopBarLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isSliding, setIsSliding] = useState(false);
  const [animateClass, setAnimateClass] = useState(""); // will hold the animation class

  // When the back button is clicked, we want the overlay to slide down, then navigate.
  const handleBack = () => {
    setAnimateClass("animate-slide-down");
    setIsSliding(true);
    setTimeout(() => {
      navigate("/home", { replace: true });
    }, 500); // Match duration with animation timing
  };

  // Optionally, this function shows reversed logic (slide-up) when closing the page.
  // Uncomment and use if needed.
  /*
  const handleClose = () => {
    setAnimateClass("animate-slide-up");
    setIsSliding(true);
    setTimeout(() => {
      navigate("/some-other-route", { replace: true });
    }, 500);
  };
  */

  return (
    <div className="relative overflow-hidden">
      {/* Inline CSS to define our keyframe animations */}
      <style>
        {`
          @keyframes slideDown {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(0); }
          }

          @keyframes slideUp {
            0% { transform: translateY(100%); }
            100% { transform: translateY(0); }
          }

          .animate-slide-down {
            animation: slideDown 0.5s ease-in-out forwards;
          }

          .animate-slide-up {
            animation: slideUp 0.5s ease-in-out forwards;
          }
        `}
      </style>

      {/* When sliding is active, show a full-screen overlay with animation text */}
      {isSliding && (
        <div className={`fixed inset-0 bg-gray-800 z-[9999] ${animateClass} flex items-center justify-center text-white text-xl`}>
          {animateClass === "animate-slide-down" ? "Returning to Home..." : "Closing Page..."}
        </div>
      )}

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900 shadow-md flex items-center px-4 py-2 z-50">
        <button
          onClick={handleBack}
          className="p-2 rounded-md hover:bg-gray-700"
        >
          <FaArrowLeft className="text-2xl text-white" />
        </button>
        <div className="flex items-center gap-2 ml-4">
          <img src="/favicon.ico" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-xl text-blue-400">Shutro.App</span>
        </div>
      </header>

      {/* Main Content (offset by the header height) */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
