import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: 6396576263,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!user.name.trim()) err.name = "Name is required";
    if (!user.email) err.email = "Email is required";
    else if (!emailRegex.test(user.email)) err.email = "Invalid email";

    if (!user.password) err.password = "Password is required";
    else if (user.password.length < 6) err.password = "Minimum 6 characters";

    return err;
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/v1/user/register",
          user
        );
        alert(res.data.message);
        navigate("/login");
      } catch (error) {
        alert(error.response?.data?.message || "Registration failed");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
