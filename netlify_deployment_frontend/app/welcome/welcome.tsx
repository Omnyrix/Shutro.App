export default function Welcome() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black">
      {/* Animated background */}
      <div
        className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-blue-900 via-sky-700 to-black opacity-60"
        style={{
          background: "linear-gradient(120deg, #0a2540 0%, #38bdf8 50%, #000 100%)",
          filter: "blur(60px)",
        }}
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-300 mb-4 drop-shadow-lg text-center">
          Welcome to Shutro.app
        </h1>
        <p className="text-gray-300 text-lg mb-8 text-center">
          Login or Sign Up to{" "}
          <span className="text-sky-400 font-semibold">Get Started</span>
        </p>
        <div className="w-full max-w-md flex flex-col items-center gap-4">
          {/* New "Use without an account" button */}
          <a
            href="/auth/no-auth"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg text-center font-semibold shadow-md hover:bg-indigo-500 transition"
          >
            Use without an account
          </a>
          {/* Divider with centered "or" */}
          <div className="relative w-full flex items-center">
            <div className="w-full border-t-4 border-gray-300"></div>
            <span className="absolute inset-0 flex justify-center">
              <span className="bg-black px-2 text-gray-300 font-semibold">or</span>
            </span>
          </div>
          {/* Login/Register buttons */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <a
              href="/auth/login"
              className="flex-1 bg-blue-800 text-white py-3 rounded-lg text-center font-semibold shadow-md hover:bg-sky-700 transition"
            >
              Login
            </a>
            <a
              href="/auth/register"
              className="flex-1 bg-sky-600 text-white py-3 rounded-lg text-center font-semibold shadow-md hover:bg-blue-700 transition"
            >
              Register
            </a>
          </div>
        </div>
      </div>
      {/* Keyframes for gradient animation */}
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradientMove 8s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
