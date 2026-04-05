import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white px-4 py-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-md p-8">

        {/* 🔥 Logo Circle */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-md">
            <img src="/logo2.png" alt="logo" className="w-12 h-12 object-contain" />
          </div>
        </div>

        {/* 🔥 Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
          CryptoView
        </h1>

        <p className="text-center text-gray-500 text-sm mb-6">
          Login to your account
        </p>

        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
        )}

        {/* 🔥 Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-700 font-medium mb-1 block">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-700 font-medium mb-1 block">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />

              {showPassword ? (
                <FaEyeSlash
                  className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <FaEye
                  className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>
          </div>

          {/* 🔥 Login Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-semibold py-2.5 rounded-lg transition"
          >
            Login
          </button>
        </form>

        {/* 🔥 OR Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* 🔥 Google Button */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border py-2.5 rounded-lg hover:bg-gray-100 transition"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>

        {/* 🔥 Bottom */}
        <p className="text-center mt-6 text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-gray-900 font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;