import { useState } from "react";
import API from "../utils/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.username.length < 4) {
      toast.warn("Username must be at least 4 characters");
      return;
    }

    if (form.password.length < 6) {
      toast.warn("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      // console.log(res.data);
      toast.success("Registration successfully");

      setForm({ username: "", email: "", password: "" });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      // console.log("Error msg : ", err.message);
      console.log("Error data: ", err.response.data);
      toast.error(err.response?.data?.message || "Registraion Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account 🚀
        </h2>
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="johndoe"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition duration-200"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to={"/"} className="text-pink-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
