import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!user.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(user.email)) newErrors.email = "Invalid email";

    if (!user.password) newErrors.password = "Password is required";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/v1/user/login",
          user
        );
        alert(res.data.message);
        const token = res.data.token;
        Cookies.set("token", token, { expires: 7 });
        Cookies.set("name", res.data.user.name, { expires: 7 });
        navigate("/dashboard");
      } catch (err) {
        alert("Invalid credentials");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={user.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={user.password}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Not yet registered?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
