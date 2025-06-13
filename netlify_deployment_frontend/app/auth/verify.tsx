import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../utils/cookie";
import axios from "axios";
import VerificationLoader from "./auth_ver_loading"; // our cookie-loading component

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Verify() {
  const navigate = useNavigate();
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [enteredCode, setEnteredCode] = useState("");
  const [error, setError] = useState("");

  // When not defined, the VerificationLoader will be shown (full-screen).
  if (!verificationEmail) {
    return <VerificationLoader onComplete={setVerificationEmail} />;
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${backendUrl}/verify`, {
        email: verificationEmail.toLowerCase(),
        code: enteredCode,
      });
      if (res.data.success) {
        setCookie("session", verificationEmail.toLowerCase());
        navigate("/home");
      } else {
        setError("Verification failed. Your account has been removed. Please try registering again.");
        setTimeout(() => navigate("/auth/register"), 1500);
      }
    } catch (err: any) {
      setError("Verification error. Please try registering again.");
      setTimeout(() => navigate("/auth/register"), 1500);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-80">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-white">Verify Your Email</h1>
          <p className="text-gray-300 text-sm mt-2">
            A verification code has been sent to: <br />
            <span className="font-bold">{verificationEmail}</span>
          </p>
        </div>
        <form onSubmit={handleVerify} className="space-y-4" autoComplete="off">
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
            className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
            required
          />
          {error && <div className="text-red-500 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Verify & Complete Registration
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/auth/register" className="text-blue-400 underline font-bold text-sm">
            Go back to Registration
          </a>
        </div>
      </div>
    </div>
  );
}
