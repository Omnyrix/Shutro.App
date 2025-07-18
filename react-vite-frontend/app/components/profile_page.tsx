import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, eraseCookie } from "../utils/cookie";
import Loading from "../components/loading";
import Menu from "../components/topbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [matchError, setMatchError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    async function initFromSession() {
      const raw = await getCookie("session");
      if (!raw) {
        // no session → redirect to login
        navigate("/auth/login", { replace: true });
        return;
      }
      try {
        const { email: e, username: u } = JSON.parse(raw);
        setEmail(e);
        setUsername(u);
      } catch {
        // if cookie was legacy (just email), treat raw as email
        setEmail(raw);
        setUsername("");
      } finally {
        setLoading(false);
      }
    }
    initFromSession();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      setMatchError("Passwords do not match");
    } else {
      setMatchError("");
    }
  }, [newPassword, confirmNewPassword]);

  const handleLogout = async () => {
    await eraseCookie("session");
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
    if (currentPassword && newPassword === currentPassword) {
      setError("New password must be different.");
      return;
    }
    if (!email) {
      setError("No user email available.");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/re-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Password updated successfully. You will now be logged out.");
        handleLogout();
      } else {
        setError(data.error || "Failed to update password");
      }
    } catch {
      setError("Failed to update password");
    }
  };

  if (loading) return <Loading />;

  return (
    <div
      className="fixed inset-0 bg-gray-800 text-white p-6 flex flex-col items-center overflow-hidden"
      style={{
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      <Menu username={username} />

      <div className="bg-gray-900 rounded-lg shadow-2xl p-6 w-full max-w-md mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white shadow-lg">
          {username ? username.charAt(0).toUpperCase() : "U"}
        </div>
        <h1 className="text-xl font-bold text-white mb-1">{username}</h1>
        <p className="text-gray-400 text-sm mb-4">Email: {email}</p>

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
            type="submit"
            disabled={newPassword !== confirmNewPassword || !newPassword}
            className="w-full mb-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
          >
            Change Password
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="w-full py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
