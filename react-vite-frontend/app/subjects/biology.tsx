import { useNavigate } from "react-router-dom";
import TopBar from "../components/topbar";
import { motion } from "framer-motion";

export default function Biology() {
  const navigate = useNavigate();

  // Session/profile logic placeholder for future use
  const isLoggedIn = false; // Set to true if user is logged in, false otherwise

  const papers = [
    { route: "/Biology/1st-paper", name: "1st Paper" },
    { route: "/Biology/2nd-paper", name: "2nd Paper" },
  ];

  const handlePaperClick = (route: string) => {
    setTimeout(() => {
      navigate(route);
    }, 150);
  };

  return (
    <div className="relative min-h-screen bg-gray-900">
      <div className="absolute inset-0 bg-gray-800 text-white p-6 flex flex-col items-center overflow-hidden">
        <motion.button
          onClick={() => navigate("/home")}
          className="self-start mb-4 text-blue-400 underline font-bold"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "transform, opacity" }}
        >
          Back
        </motion.button>

        <TopBar />

        <motion.h1
          className="text-3xl font-bold text-center mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{ willChange: "transform, opacity" }}
        >
          <span style={{ color: "#10B981" }}>Biology</span>{" "}
          <span className="text-white">Formulas</span>
        </motion.h1>

        <motion.p
          className="text-lg mb-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          style={{ willChange: "transform, opacity" }}
        >
          Choose a paper:
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
          {papers.map((paper, index) => (
            <motion.div
              key={paper.route}
              className="subject-button cursor-pointer"
              onClick={() => handlePaperClick(paper.route)}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: "transform, opacity" }}
            >
              <hr className="mb-1 border-t-2 border-gray-400 opacity-60" />
              <div className="py-4 px-5">
                <p className="text-lg font-semibold text-left text-gray-400">
                  {paper.name}
                </p>
              </div>
              <hr className="mt-1 border-t-2 border-gray-400 opacity-60" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
