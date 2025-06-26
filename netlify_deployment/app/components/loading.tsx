// components/home/home.tsx or wherever your Loading component is located
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, eraseCookie } from "../utils/cookie";
import { lazyWithPreload } from "../utils/lazyWithPreload";

// ✅ Preload the subject pages during loading
const PhysicsPage = lazyWithPreload(() => import("../routes/subjects/physics"));
const ChemistryPage = lazyWithPreload(() => import("../routes/subjects/chemistry"));
const BiologyPage = lazyWithPreload(() => import("../routes/subjects/biology"));
const MathPage = lazyWithPreload(() => import("../routes/subjects/higher_math"));
const NotFoundPage = lazyWithPreload(() => import("../routes/404"));
const HomePage = lazyWithPreload(() => import("../routes/home"));

export default function Loading() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Preload all subject pages right away
    PhysicsPage.preload();
    ChemistryPage.preload();
    BiologyPage.preload();
    MathPage.preload();
    NotFoundPage.preload();
    HomePage.preload();

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
