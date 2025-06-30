import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eraseCookie, getCookie } from "../utils/cookie";
import { GiAtom, GiChemicalDrop, GiFrog } from "react-icons/gi";
import { FaCalculator, FaBars, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [clickedDemoButton, setClickedDemoButton] = useState<"login" | "register" | "logout" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<"login" | "register" | "logout" | null>(null);

  useEffect(() => {
    const email = getCookie("session");
    axios
      .get(`${backendUrl}/user/${email}`)
      .then((res) => {
        const rawUsername = res.data.username;
        setUsername(rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1));
        setIsDemo(res.data.demo === true);
      })
      .catch(() => {
        eraseCookie("session");
        navigate("/auth/login");
      });
  }, [navigate]);

  const subjectList = [
    { route: "#/physics", name: "Physics", icon: <GiAtom className="text-2xl" style={{ color: "#1D4ED8" }} /> },
    { route: "#/chemistry", name: "Chemistry", icon: <GiChemicalDrop className="text-2xl" style={{ color: "#EA580C" }} /> },
    { route: "#/highermath", name: "Higher Math", icon: <FaCalculator className="text-2xl" style={{ color: "#8B5CF6" }} /> },
    { route: "#/biology", name: "Biology", icon: <GiFrog className="text-2xl" style={{ color: "#10B981" }} /> },
  ];

  const handleSubjectClick = (route: string) => {
    setTimeout(() => {
      window.location.href = route;
    }, 150);
  };

  async function handleLogout() {
    setLogoutLoading(true);
    if (isDemo) {
      try {
        await axios.delete(`${backendUrl}/demo/${username.toLowerCase()}`);
      } catch (err) {
        console.error("Failed to delete demo account:", err);
      }
    }
    eraseCookie("session");
    setLogoutLoading(false);
    navigate("/welcome");
  }

  async function handleDemoLogout(destination: string, type: "login" | "register" | "logout") {
    if (confirmDelete === type) {
      setLogoutLoading(true);
      setClickedDemoButton(type);
      try {
        await axios.delete(`${backendUrl}/demo/${username.toLowerCase()}`);
      } catch (err) {
        console.error("Failed to delete demo account:", err);
      }
      eraseCookie("session");
      navigate(destination);
    } else {
      setConfirmDelete(type);
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-800 text-white overflow-hidden">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900 shadow-md flex items-center justify-between px-4 py-2 z-50">
        <div className="flex items-center gap-2">
          <img src="favicon.ico" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-xl text-blue-400">Shutro.App</span>
        </div>
        <button onClick={() => setPanelOpen(true)} className="rounded-md p-1">
          <FaBars className="text-2xl cursor-pointer" />
        </button>
      </header>

      {/* MAIN */}
      <main className="pt-16 p-6 h-full overflow-hidden">
        <h1 className="text-3xl font-bold text-center mb-6">
          <span className="text-white">Welcome</span>{" "}
          <span style={{ color: "#1D4ED8" }}>{username}</span>{" "}
          <span className="text-white">to</span>{" "}
          <span className="text-blue-400">Shutro.App</span>
        </h1>

        <div className="flex flex-col items-center text-center w-full">
          <p className="text-lg mb-4">Choose a subject:</p>
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
            {subjectList.map((subject, index) => (
              <motion.div
                key={index}
                className="subject-button cursor-pointer"
                onClick={() => handleSubjectClick(subject.route)}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ willChange: "transform, opacity" }}
              >
                <hr className="mb-1 border-t-2 border-gray-400 opacity-60" />
                <div className="flex items-center gap-4 py-4 px-5">
                  {subject.icon}
                  <p className="text-lg font-semibold text-left text-gray-400">
                    {subject.name}
                  </p>
                </div>
                <hr className="mt-1 border-t-2 border-gray-400 opacity-60" />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* SIDE PANEL */}
      <div
        className={`absolute top-0 h-full z-50 bg-gray-800 shadow-2xl transition-all duration-300 ease-in-out md:w-1/3 w-full`}
        style={{
          right: isPanelOpen ? "0" : "-100%",
        }}
      >
        <div className="p-4 flex flex-col h-full justify-between">
          <div>
            <button onClick={() => setPanelOpen(false)} className="rounded-md p-1 mb-4">
              <FaArrowLeft className="text-2xl cursor-pointer" />
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold">
                {username.charAt(0)}
              </div>
              <span className="text-xl font-semibold text-white">{username}</span>
            </div>
            {isDemo ? (
              <div className="flex flex-col gap-2 mb-4">
                {confirmDelete === "login" && (
                  <p className="text-red-500 text-sm text-center">
                    This action will delete your demo account. Click again to confirm deletion.
                  </p>
                )}
                <button
                  className="w-full py-2 px-3 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => handleDemoLogout("/auth/login", "login")}
                  disabled={logoutLoading && clickedDemoButton !== "login"}
                >
                  {logoutLoading && clickedDemoButton === "login"
                    ? "Deleting demo account and Redirecting to Login..."
                    : "Login"}
                </button>

                {confirmDelete === "register" && (
                  <p className="text-red-500 text-sm text-center">
                    This action will delete your demo account. Click again to confirm deletion.
                  </p>
                )}
                <button
                  className="w-full py-2 px-3 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => handleDemoLogout("/auth/register", "register")}
                  disabled={logoutLoading && clickedDemoButton !== "register"}
                >
                  {logoutLoading && clickedDemoButton === "register"
                    ? "Deleting demo account and Redirecting to Register..."
                    : "Register"}
                </button>
              </div>
            ) : (
              <button
                className="w-full py-2 px-3 bg-blue-600 rounded-md hover:bg-blue-700 mb-4 transition-colors"
                onClick={() => {
                  setPanelOpen(false);
                  navigate("/profile");
                }}
              >
                Change Password
              </button>
            )}

            {/* ABOUT */}
            <div>
              <hr className="border-t border-gray-600 opacity-40 mb-2" />
              <button
                onClick={() => setAboutExpanded(!aboutExpanded)}
                className="w-full flex items-center justify-between py-2 px-3 bg-gray-800 text-gray-300"
              >
                <span>About</span>
                <svg
                  className={`w-5 h-5 transform transition-transform duration-300 ${
                    aboutExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <hr className="border-t border-gray-600 opacity-40 mt-2" />

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  aboutExpanded ? "max-h-[300px] opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-gray-700 text-sm text-gray-200 rounded-xl px-4 py-3 mx-2 mt-1 shadow-inner">
                  <p>
                    Example about text goes here. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Praesent vel ligula scelerisque,
                    vehicula dui eu, fermentum velit.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {isDemo && confirmDelete === "logout" && (
            <p className="text-red-500 text-sm text-center mb-1">
              This action will delete your demo account. Click again to confirm deletion.
            </p>
          )}
          <button
            onClick={() =>
              isDemo
                ? handleDemoLogout("/welcome", "logout")
                : handleLogout()
            }
            className="w-full py-2 px-3 bg-red-600 rounded-md hover:bg-red-700"
            disabled={logoutLoading}
          >
            {logoutLoading && clickedDemoButton === "logout"
              ? "Deleting demo account and Logging out..."
              : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}
