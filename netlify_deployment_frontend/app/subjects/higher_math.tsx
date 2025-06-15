import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eraseCookie, getCookie } from "../utils/cookie";
import Loading from "../components/loading_not_lazy";
import ProfileMenu from "../components/topbar";

export default function HigherMath() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const LOADING_TIME = 0;

  useEffect(() => {
    const session = getCookie("session");
    if (!session) {
      eraseCookie("session");
      navigate("/auth/login");
      return;
    }

    if (!LOADING_TIME) {
      setLoading(false);
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + (100 / (LOADING_TIME / 50)), 100));
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
    }, LOADING_TIME);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-gray-900">
      {loading && <Loading progress={progress} />}

      {!loading && (
        <div className="absolute inset-0 bg-gray-800 text-white p-6 flex flex-col items-center">
          <button
            onClick={() => navigate("/home")}
            className="self-start mb-4 text-blue-400 underline font-bold"
          >
            Back
          </button>

          <ProfileMenu />
          <h1 className="text-3xl font-bold text-center mb-6">
            <span style={{ color: "#8B5CF6" }}>Higher Math</span>{" "}
            <span className="text-white">Formulas</span>
          </h1>

          <p className="text-lg mb-6 text-center">Choose a paper:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            {/* --- 1st Paper Button --- */}
            <div
              className="subject-button"
              onClick={() => navigate("/HigherMath/1st-paper")}
            >
              <hr className="mb-1 border-t-2 border-gray-400 opacity-60" />
              <div className="py-4 px-5">
                <p className="text-lg font-semibold text-left text-gray-400">
                  1st Paper
                </p>
              </div>
              <hr className="mt-1 border-t-2 border-gray-400 opacity-60" />
            </div>

            {/* --- 2nd Paper Button --- */}
            <div
              className="subject-button"
              onClick={() => navigate("/HigherMath/2nd-paper")}
            >
              <hr className="mb-1 border-t-2 border-gray-400 opacity-60" />
              <div className="py-4 px-5">
                <p className="text-lg font-semibold text-left text-gray-400">
                  2nd Paper
                </p>
              </div>
              <hr className="mt-1 border-t-2 border-gray-400 opacity-60" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
