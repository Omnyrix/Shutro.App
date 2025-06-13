import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookie";
import Loading from "../components/loading"; // Import loading screen
import Menu from "../components/menu"; // Import Menu component

export default function Biology() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [progress, setProgress] = useState(0); // Dynamic progress bar

  const LOADING_TIME = 0; // 0.5 sec loading duration

  useEffect(() => {
    const session = getCookie("session");

    if (!session) {
      navigate("/auth/login"); // Redirect if no session
      return;
    }

    setUsername(session);

    // Simulated loading animation
    const interval = setInterval(() => {
      setProgress((prev) =>
        Math.min(prev + (100 / (LOADING_TIME / 50)), 100)
      );
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      setLoading(false); // Hide loading after full render
    }, LOADING_TIME);

    return () => clearInterval(interval);
  }, [navigate]);

  const navigateToPaper = (paper: string) => {
    navigate(`/biology/${paper}`);
  };

  return (
    <div className="relative min-h-screen bg-gray-800 text-white p-6 flex flex-col items-center">
      {loading && <Loading progress={progress} />} {/* Show loading screen */}

      {!loading && (
        <>
          {/* Menu Component */}
          <Menu username={username} />

          {/* Main Content */}
          <h1 className="text-3xl font-bold text-center mb-6">Biology Formulas</h1>
          <p className="text-lg mb-6 text-center">Choose a paper:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            {/* 1st Paper */}
            <div
              className="cursor-pointer"
              onClick={() => navigateToPaper("1st-paper")}
            >
              {/* Top horizontal line with downward pouring effect in gray */}
              <hr
                style={{
                  border: 0,
                  height: "2px",
                  background: "linear-gradient(to bottom, #9CA3AF, transparent)",
                }}
                className="mb-1"
              />
              <div className="py-2 px-4">
                <p
                  className="text-lg font-semibold text-left"
                  style={{ color: "#9CA3AF" }}
                >
                  1st Paper
                </p>
              </div>
              {/* Bottom horizontal line with upward pouring effect in gray */}
              <hr
                style={{
                  border: 0,
                  height: "2px",
                  background: "linear-gradient(to top, #9CA3AF, transparent)",
                }}
                className="mt-1"
              />
            </div>

            {/* 2nd Paper */}
            <div
              className="cursor-pointer"
              onClick={() => navigateToPaper("2nd-paper")}
            >
              {/* Top horizontal line with downward pouring effect in gray */}
              <hr
                style={{
                  border: 0,
                  height: "2px",
                  background: "linear-gradient(to bottom, #9CA3AF, transparent)",
                }}
                className="mb-1"
              />
              <div className="py-2 px-4">
                <p
                  className="text-lg font-semibold text-left"
                  style={{ color: "#9CA3AF" }}
                >
                  2nd Paper
                </p>
              </div>
              {/* Bottom horizontal line with upward pouring effect in gray */}
              <hr
                style={{
                  border: 0,
                  height: "2px",
                  background: "linear-gradient(to top, #9CA3AF, transparent)",
                }}
                className="mt-1"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
