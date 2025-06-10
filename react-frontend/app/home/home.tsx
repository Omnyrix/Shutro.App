import { getCookie, eraseCookie } from "../utils/cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!getCookie("session")) {
      navigate("/welcome");
    }
  }, [navigate]);

  function handleLogout() {
    eraseCookie("session");
    navigate("/welcome");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-950">
      <div className="bg-white rounded-lg shadow-lg p-8 w-80">
        <div className="mb-6 text-center">
          {/* Logo placeholder */}
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2" />
          <h1 className="text-xl font-bold text-blue-900">Home</h1>
        </div>
        <button
          className="w-full bg-blue-900 text-white py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}