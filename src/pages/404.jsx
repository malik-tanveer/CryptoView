import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Page not found</p>
      <Link
        to="/home"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;