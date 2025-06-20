import { motion } from "framer-motion";

export default function MotionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
      className="absolute inset-0 bg-gray-800 text-white"
    >
      {children}
    </motion.div>
  );
}
