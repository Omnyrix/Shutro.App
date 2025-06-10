export default function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
        <p className="text-gray-300">Login or Sign Up to use</p>
      </div>
      <div className="flex flex-col gap-4 w-80 bg-gray-900 rounded-lg shadow-lg p-8">
        <a href="/auth/login" className="w-full bg-blue-800 text-white py-2 rounded text-center hover:bg-blue-700 transition">
          Login
        </a>
        <a href="/auth/register" className="w-full bg-blue-700 text-white py-2 rounded text-center hover:bg-blue-600 transition">
          Sign Up
        </a>
      </div>
    </div>
  );
}