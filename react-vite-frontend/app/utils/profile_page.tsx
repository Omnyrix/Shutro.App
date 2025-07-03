import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Preferences } from "@capacitor/preferences";
import Loading from "../components/loading"; // Loading component
import Menu from "../components/topbar"; // Menu component
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function ProfilePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [matchError, setMatchError] = useState("");
  // Show/Hide state for password fields
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let didFinish = false;
    async function fetchSessionAndUser() {
      const sessionResult = await Preferences.get({ key: "session" });
      const sessionValue = sessionResult.value;
      console.log("Session value:", sessionValue);
      if (!sessionValue) {
        navigate("/auth/login");
        return;
      }
      const emailFromSession = sessionValue.toLowerCase();
      setEmail(emailFromSession);

      // Fallback: ensure loading is cleared after 5 seconds
      const timeout = setTimeout(() => {
        if (!didFinish) setLoading(false);
      }, 5000);

      axios
        .get(`${backendUrl}/user/${emailFromSession}`)
        .then((res) => {
          const rawUsername = res.data.username;
          setUsername(rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1));
          setEmail(res.data.email); // update with returned email if provided
          setIsDemo(res.data.demo || false);
        })
        .catch((err) => {
          console.error("Failed to fetch user data", err.response?.data || err);
          setUsername(`Not found for ${emailFromSession}`);
          setEmail(emailFromSession);
        })
        .finally(() => {
          didFinish = true;
          setLoading(false);
          clearTimeout(timeout);
        });
    }
    fetchSessionAndUser();
  }, [navigate]);

  // Live check for matching new password fields.
  useEffect(() => {
    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      setMatchError("Passwords do not match");
    } else {
      setMatchError("");
    }
  }, [newPassword, confirmNewPassword]);

  const handleLogout = async () => {
    await Preferences.remove({ key: "session" });
    window.location.href = "/welcome";
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
      const res = await axios.post(`${backendUrl}/re-register`, { email, currentPassword, newPassword });
      if (res.data.success) {
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
          {isDemo ? (
            <div className="bg-gray-900 rounded-lg shadow-2xl p-6 w-full max-w-md mx-auto text-center">
              <h1 className="text-xl font-bold text-white">Cannot access profile page with demo account</h1>
              <button
                onClick={handleLogout}
                className="w-full mt-6 py-2 px-3 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-800 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Menu username={username} />
              <div className="bg-gray-900 rounded-lg shadow-2xl p-6 w-full max-w-md mx-auto text-center">
                <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-900 text-3xl font-bold text-white shadow-lg">
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </div>
                <h1 className="text-xl font-bold text-white">{username}</h1>
                <p className="text-gray-400">Email: {email}</p>
                {/* Change Password Form */}
                <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                  <div className="relative">
                    <input
                      className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
                      type={showCurrent ? "text" : "password"}
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 opacity-70 hover:opacity-100"
                      onClick={() => setShowCurrent(!showCurrent)}
                    >
                      {showCurrent ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
                      type={showNew ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 opacity-70 hover:opacity-100"
                      onClick={() => setShowNew(!showNew)}
                    >
                      {showNew ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 opacity-70 hover:opacity-100"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {matchError && <div className="text-yellow-500">{matchError}</div>}
                  {error && !matchError && <div className="text-red-500">{error}</div>}
                  <button
                    className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition-all"
                    type="submit"
                    disabled={newPassword !== confirmNewPassword || !newPassword}
                  >
                    Change Password
                  </button>
                </form>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full mt-6 py-2 px-3 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-800 transition-all"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}