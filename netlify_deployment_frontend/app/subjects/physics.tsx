import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookie";
import Loading from "../components/loading"; // Import loading screen
import ProfileMenu from "../components/topbar"; // Import ProfileMenu component

export default function Physics() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [progress, setProgress] = useState(0); // Dynamic progress bar

  const LOADING_TIME = 0; // Set loading duration to 0.5 sec

  useEffect(() => {
    const session = getCookie("session");

    if (!session) {
      navigate("/auth/login"); // Redirect if no session
      return;
    }

    setUsername(session);

    // Simulated loading animation
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + (100 / (LOADING_TIME / 50)), 100));
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      setLoading(false); // Hide loading after full render
    }, LOADING_TIME);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-gray-800 text-white p-6 flex flex-col items-center">
      {loading && <Loading progress={progress} />} {/* Show loading screen */}

      {!loading && (
        <>
          {/* Profile Menu */}
          <ProfileMenu />

          {/* Main Title and Content */}
          <h1 className="text-3xl font-bold text-center mb-6">Physics Formulas</h1>
          <p className="text-lg mb-6 text-center">Choose a paper:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            <div
              className="cursor-pointer"
              onClick={() => navigate("/physics/1st-paper")}
            >
              {/* Top thin line */}
              <hr
                style={{ borderTop: "2px solid #9CA3AF", opacity: 0.6 }}
                className="mb-1"
              />
              <div className="py-2 px-4">
                <p
                  style={{ color: "#9CA3AF" }}
                  className="text-lg font-semibold text-left"
                >
                  1st Paper
                </p>
              </div>
              {/* Bottom thin line */}
              <hr
                style={{ borderTop: "2px solid #9CA3AF", opacity: 0.6 }}
                className="mt-1"
              />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => navigate("/physics/2nd-paper")}
            >
              {/* Top thin line */}
              <hr
                style={{ borderTop: "2px solid #9CA3AF", opacity: 0.6 }}
                className="mb-1"
              />
              <div className="py-2 px-4">
                <p
                  style={{ color: "#9CA3AF" }}
                  className="text-lg font-semibold text-left"
                >
                  2nd Paper
                </p>
              </div>
              {/* Bottom thin line */}
              <hr
                style={{ borderTop: "2px solid #9CA3AF", opacity: 0.6 }}
                className="mt-1"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}