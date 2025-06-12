import { useState, useEffect } from "react";
import Loading from "../components/loading"; // Using your existing loading component

export default function NotFoundPage() {
  const [loading, setLoading] = useState(true);

  // Simulate a brief loading period (0.5 sec)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-8xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-2">Page Not Found</h2>
      <p className="text-lg max-w-xl text-center mb-8">
        Our calculations seem to have hit an unsolvable limit. The formula for this page’s existence is <span className="italic">undefined</span>.
      </p>
      <div className="bg-gray-900 p-6 rounded-lg shadow-xl text-center">
        <p className="mb-2">Maybe try integrating a known function?</p>
        <p className="text-xl font-bold">∫ e<sup>x</sup> dx = e<sup>x</sup> + C</p>
      </div>
      <button
        onClick={() => window.history.back()}
        className="mt-8 bg-blue-600 hover:bg-blue-500 transition py-2 px-4 rounded"
      >
        Go Back
      </button>
    </div>
  );
}
