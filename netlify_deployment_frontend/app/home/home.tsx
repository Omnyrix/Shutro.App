// pages/home.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/loading";
import axios from "axios";
import { getCookie, eraseCookie } from "../utils/cookie";
import { GiAtom, GiChemicalDrop, GiFrog } from "react-icons/gi";
import { FaCalculator, FaBars, FaArrowLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";


// Preload subject pages immediately when this file is parsed
Promise.all([
  import("../subjects/physics"),
  import("../subjects/chemistry"),
  import("../subjects/biology"),
  import("../subjects/higher_math"),
  import("../routes/404"),
]).catch(() => {
  // Fail silently — this is just preloading
});

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Unknown");
  const [loading, setLoading] = useState(true);
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

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
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 0);
      });

  }, [navigate]);

  const subjectList = [
    {
      route: "/physics",
      name: "Physics",
      icon: <GiAtom className="text-2xl" style={{ color: "#1D4ED8" }} />,
    },
    {
      route: "/chemistry",
      name: "Chemistry",
      icon: <GiChemicalDrop className="text-2xl" style={{ color: "#EA580C" }} />,
    },
    {
      route: "/highermath",
      name: "Higher Math",
      icon: <FaCalculator className="text-2xl" style={{ color: "#8B5CF6" }} />,
    },
    {
      route: "/biology",
      name: "Biology",
      icon: <GiFrog className="text-2xl" style={{ color: "#10B981" }} />,
    },
  ];

  const handleSubjectClick = (route: string) => {
    navigate(route);
  };

  async function handleLogout() {
    setLogoutLoading(true);
    if (isDemo) {
      try {
        const deleteUrl = `${backendUrl}/demo/${username.toLowerCase()}`;
        await axios.delete(deleteUrl);
      } catch (err) {
        console.error("Failed to delete demo account:", err);
      }
    }
    eraseCookie("session");
    setLogoutLoading(false);
    navigate("/welcome");
  }

  return (
    <div className="relative min-h-screen bg-gray-800 text-white">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
          >
            <Loading />
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <>
          <div className="absolute inset-0 z-10">
            {/* Top Bar */}
            <header className="fixed top-0 left-0 right-0 bg-gray-900 shadow-md flex items-center justify-between px-4 py-2 z-50">
              <div className="flex items-center gap-2">
                <img src="/favicon.ico" alt="Logo" className="w-8 h-8" />
                <span className="font-bold text-xl text-blue-400">Shutro.App</span>
              </div>
              <button onClick={() => setPanelOpen(true)} className="rounded-md p-1">
                <FaBars className="text-2xl cursor-pointer" />
              </button>
            </header>

            {/* Main Content */}
            <main className="pt-16 p-6">
              <h1 className="text-3xl font-bold text-center mb-6">
                Welcome {username} to Shutro.App
              </h1>
              <div className="flex flex-col items-center text-center w-full">
                <p className="text-lg mb-4">Choose a subject:</p>
                <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                  {subjectList.map((subject, index) => (
                    <div
                      key={index}
                      className="cursor-pointer rounded-md overflow-hidden"
                      onClick={() => handleSubjectClick(subject.route)}
                    >
                      <hr className="mb-1 border-t-2 border-gray-400 opacity-60" />
                      <div className="flex items-center gap-3 py-2 px-4">
                        {subject.icon}
                        <p className="text-lg font-semibold text-left text-gray-400">
                          {subject.name}
                        </p>
                      </div>
                      <hr className="mt-1 border-t-2 border-gray-400 opacity-60" />
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>

          {/* Right Sliding Panel */}
          <div
            className={`fixed top-0 right-0 h-full z-50 bg-gray-800 shadow-2xl transform transition-transform duration-300 
              ${isPanelOpen ? "translate-x-0" : "translate-x-full"} md:w-1/3 w-full`}
            onClick={(e) => e.stopPropagation()}
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
                {!isDemo && (
                  <button
                    className="w-full py-2 px-3 bg-blue-600 rounded-md hover:bg-blue-700 mb-4"
                    onClick={() => {
                      setPanelOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Change Password
                  </button>
                )}
                <div>
                  <button
                    onClick={() => setAboutExpanded(!aboutExpanded)}
                    className="w-full flex items-center justify-between py-2 px-3 bg-gray-700 rounded-md border border-purple-500 text-purple-500 hover:bg-purple-600 hover:text-white transition-colors duration-300"
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                  <AnimatePresence>
                    {aboutExpanded && (
                      <motion.div
                        key="aboutDropdown"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="mt-2 overflow-hidden p-2 bg-gray-700 rounded-md border border-purple-500"
                      >
                        <p className="text-purple-200">
                          Example about text goes here. Lorem ipsum dolor sit amet,
                          consectetur adipiscing elit. Praesent vel ligula scelerisque,
                          vehicula dui eu, fermentum velit.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2 px-3 bg-red-600 rounded-md hover:bg-red-700"
                disabled={logoutLoading}
              >
                {logoutLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
