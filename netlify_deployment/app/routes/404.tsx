import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, eraseCookie } from "../utils/cookie";

// Array of alternative 404 pages
const errorMessages = [
  {
    title: "404",
    subtitle: "Page Not Found",
    message:
      "Our calculations seem to have hit an unsolvable limit. The formula for this page’s existence is ",
    joke: "undefined",
    hint: "Maybe try integrating a known function?",
    formula: "∫ e^x dx = e^x + C",
  },
  {
    title: "404",
    subtitle: "Oops!",
    message: "Looks like this path was asymptotic to reality. The limit doesn't exist: ",
    joke: "limₙ→∞ (1/n) = 0",
    hint: "Check your domain or try a substitution.",
    formula: "f(x) = ln(x), x > 0",
  },
  {
    title: "404",
    subtitle: "Calculation Error",
    message: "This formula produced an imaginary result: ",
    joke: "i² = -1",
    hint: "Try graphing your thoughts on the real axis.",
    formula: "z = a + bi",
  },
  {
    title: "404",
    subtitle: "Oops!",
    message: "The integral of your query diverged. That page went to infinity: ",
    joke: "∫ 1/x dx = ∞",
    hint: "Try evaluating within bounds.",
    formula: "∫₁^∞ 1/x dx = ∞",
  },
];

export default function NotFoundPage() {
  const [errorContent, setErrorContent] = useState(errorMessages[0]);
  const navigate = useNavigate();

  useEffect(() => {
    const session = getCookie("session");
    if (!session) {
      eraseCookie("session");
      navigate("/auth/login");
      return;
    }

    const randomIndex = Math.floor(Math.random() * errorMessages.length);
    setErrorContent(errorMessages[randomIndex]);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-8xl font-bold mb-4">{errorContent.title}</h1>
      <h2 className="text-2xl mb-2">{errorContent.subtitle}</h2>
      <p className="text-lg max-w-xl text-center mb-8">
        {errorContent.message}
        <span className="italic">{errorContent.joke}</span>
      </p>
      <div className="bg-gray-900 p-6 rounded-lg shadow-xl text-center">
        <p className="mb-2">{errorContent.hint}</p>
        <p className="text-xl font-bold">{errorContent.formula}</p>
      </div>
      <button
        onClick={() => navigate("/home")}
        className="mt-8 bg-blue-600 hover:bg-blue-500 transition py-2 px-4 rounded"
      >
        Go Back to Home Page
      </button>
    </div>
  );
}
