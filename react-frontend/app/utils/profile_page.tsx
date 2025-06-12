import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCookie, eraseCookie } from "../utils/cookie";
import Loading from "../components/loading"; // Loading component
import Menu from "../components/menu"; // Menu component

// Use your backend URL (fallback to localhost if not set)
const backendUrl = import.meta.env.VITE_BACKEND_URL

export default function ProfilePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [error, setError] = useState("");       // For backend / validation errors (in red)
  const [matchError, setMatchError] = useState("");  // For live password mismatch warning (in yellow)

  useEffect(() => {
    const sessionValue = getCookie("session");
    console.log("Session value:", sessionValue);
    if (!sessionValue) {
      navigate("/auth/login");
      return;
    }
    const emailFromSession = sessionValue.toLowerCase();
    setEmail(emailFromSession);

    // Fetch user data from backend using the email or username search
    axios
      .get(`${backendUrl}/user/${emailFromSession}`)
      .then((res) => {
        console.log("Fetched user data:", res.data);
        setUsername(res.data.username);
        setEmail(res.data.email); // update with returned email if provided
      })
      .catch((err) => {
        console.error("Failed to fetch user data", err.response?.data || err);
        setUsername(`Not found for ${emailFromSession}`);
        setEmail(emailFromSession);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 500);
      });
  }, [navigate]);

  // Live check for matching new password fields.
  useEffect(() => {
    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      setMatchError("Passwords do not match");
    } else {
      setMatchError("");
    }
  }, [newPassword, confirmNewPassword]);

  const handleLogout = () => {
    eraseCookie("session");
    window.location.href = "/welcome"; // or redirect to login page if needed.
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!email) {
      setError("No user email available.");
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/re-register`, {
        email,
        currentPassword,
        newPassword
      });
      if (res.data.success) {
        // Immediately log out once password is updated
        alert("Password updated successfully. You will now be logged out.");
        handleLogout();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update password");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-800 text-white p-6 flex flex-col items-center">
      {loading && <Loading />}
      {!loading && (
        <>
          <Menu username={username} />
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-80 text-center">
            {/* Profile Avatar (initial letter) */}
            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-gray-700 rounded-full text-3xl font-bold text-white">
              {username ? username.charAt(0).toUpperCase() : "U"}
            </div>
            <h1 className="text-xl font-bold text-white">{username}</h1>
            <p className="text-gray-400">Email: {email}</p>

            {/* Change Password Form */}
            <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
              <input
                className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <input
                className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
                type="password"
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
              {matchError && <div className="text-yellow-500">{matchError}</div>}
              {error && !matchError && <div className="text-red-500">{error}</div>}
              <button
                className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition"
                type="submit"
                disabled={newPassword !== confirmNewPassword || !newPassword}
              >
                Change Password
              </button>
            </form>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full mt-6 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
