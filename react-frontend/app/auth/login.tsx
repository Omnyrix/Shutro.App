import { useState } from "react";
import { setCookie } from "../utils/cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

async function loginUser({ username, password }) {
  try {
    const res = await axios.post(`${backendUrl}/login`, { username, password });
    return res.data;
  } catch (err) {
    if (err.response) {
      return { error: "Incorrect username or password." }; // Unified error message
    }
    return { error: "Backend not connected" };
  }
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isHuman, setIsHuman] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isHuman) {
      setError("Please confirm you are not a robot.");
      return;
    }

    const result = await loginUser({ username, password });

    if (result.error) {
      setError(result.error);
      return;
    }

    setCookie("session", username);
    navigate("/home");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-80">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-white">Login</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            className="w-full border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:border-blue-500"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="robot-check"
              checked={isHuman}
              onChange={e => setIsHuman(e.target.checked)}
              className="mr-2"
              required
            />
            <label htmlFor="robot-check" className="text-white text-sm">I am not a robot</label>
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <button className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition" type="submit">
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/auth/register" className="text-blue-400 underline">Create an account</a>
        </div>
      </div>
    </div>
  );
}
