import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookie";
import Loading from "../components/loading"; // Import loading screen
import Menu from "../components/menu"; // Import Menu component

export default function Chemistry() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [progress, setProgress] = useState(0); // Dynamic progress bar

  const LOADING_TIME = 500; // Set loading duration to 0.5 sec

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
      setLoading(false); // Hide loading screen after full render
    }, LOADING_TIME);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-gray-800 text-white p-6 flex flex-col items-center">
      {loading && <Loading progress={progress} />} {/* Show loading screen */}

      {!loading && (
        <>
          {/* Menu Component */}
          <Menu username={username} />

          {/* Main Centered Title and Content */}
          <h1 className="text-3xl font-bold text-center mb-6">Chemistry Formulas</h1>
          <p className="text-lg mb-6 text-center">Choose a paper:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            <button className="bg-green-400 hover:bg-green-500 text-white py-3 px-6 rounded-lg transition" onClick={() => navigate("/chemistry/1st-paper")}>
              1st Paper
            </button>
            <button className="bg-green-400 hover:bg-green-500 text-white py-3 px-6 rounded-lg transition" onClick={() => navigate("/chemistry/2nd-paper")}>
              2nd Paper
            </button>
          </div>
        </>
      )}
    </div>
  );
}
