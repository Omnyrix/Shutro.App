import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookie";
import Loading from "../components/loading"; // Import loading screen
import ProfileMenu from "../components/topbar"; // Import ProfileMenu component
import { motion } from "framer-motion";

export default function Physics() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const LOADING_TIME = 0; // Loading time remains unchanged

  useEffect(() => {
    const session = getCookie("session");
    if (!session) {
      navigate("/auth/login");
      return;
    }
    setUsername(session);

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + (100 / (LOADING_TIME / 50)), 100));
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
    }, LOADING_TIME || 1);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-gray-900"> {/* Prevents white flash */}
      {loading && <Loading progress={progress} />}

      {!loading && (
        <motion.div
          initial={{ y: "50%", opacity: 0 }} // Starts halfway down instead of fully off-screen
          animate={{ y: "0%", opacity: 1 }} // Moves smoothly into view
          transition={{ duration: 0.2, ease: "easeInOut" }} // Adjusted timing for smoothness
          className="absolute inset-0 bg-gray-800 text-white p-6 flex flex-col items-center"
        >
          {/* Back button */}
          <button
            onClick={() => navigate("/home")}
            className="self-start mb-4 text-blue-400 underline font-bold"
          >
            Back
          </button>

          <ProfileMenu />
          <h1 className="text-3xl font-bold text-center mb-6">Physics Formulas</h1>
          <p className="text-lg mb-6 text-center">Choose a paper:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            <div
              className="cursor-pointer"
              onClick={() => navigate("/physics/1st-paper")}
            >
              <hr
                style={{ borderTop: "2px solid #9CA3AF", opacity: 0.6 }}
                className="mb-1"
              />
              <div className="py-2 px-4">
                <p style={{ color: "#9CA3AF" }} className="text-lg font-semibold text-left">
                  1st Paper
                </p>
              </div>
              <hr
                style={{ borderTop: "2px solid #9CA3AF", opacity: 0.6 }}
                className="mt-1"
              />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => navigate("/physics/2nd-paper")}
            >
              <hr
                style={{ borderTop: "2px solid #9CA3AF", opacity: 0.6 }}
                className="mb-1"
              />
              <div className="py-2 px-4">
                <p style={{ color: "#9CA3AF" }} className="text-lg font-semibold text-left">
                  2nd Paper
                </p>
              </div>
              <hr
                style={{ borderTop: "2px solid #9CA3AF", opacity: 0.6 }}
                className="mt-1"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
