import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog, FaHome, FaArrowRight } from "react-icons/fa";
import { getCookie, eraseCookie } from "../utils/cookie";
import Loading from "../components/loading"; // Import loading screen
import ProfileMenu from "../components/menu"; // Import ProfileMenu component

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const session = getCookie("session");
    if (!session) {
      navigate("/welcome");
      return;
    }
    setUsername(session);

    setTimeout(() => {
      setLoading(false); // Hide loading after full render
    }, 500); // Adjust delay if needed
  }, [navigate]);

  const navigateToSubject = (subject: string) => {
    navigate(`/${subject.toLowerCase()}`);
  };

  return (
    <div className="relative min-h-screen bg-gray-800 text-white p-6 flex flex-col items-center">
      {loading && <Loading />} {/* Show loading screen until fully loaded */}

      {/* Profile Menu */}
      <ProfileMenu />

      {/* Main Centered Title */}
      <h1 className="text-3xl font-bold text-center mb-6">Welcome {username} to Shutro.App</h1>

      {/* Subject Section */}
      <div className="flex flex-col items-center text-center">
        <p className="text-lg mb-4">Choose a subject:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition" onClick={() => navigateToSubject("physics")}>
            Physics
          </button>
          <button className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg transition" onClick={() => navigateToSubject("chemistry")}>
            Chemistry
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition" onClick={() => navigateToSubject("highermath")}>
            Higher Math
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition" onClick={() => navigateToSubject("biology")}>
            Biology
          </button>
        </div>
      </div>
    </div>
  );
}
