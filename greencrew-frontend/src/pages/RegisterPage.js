import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/authServices";

export default function RegisterPage() {
  const { token, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", dormId: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(form, token);
      if (res.error) return setError(res.error);
      setSuccess("Registered!");
      navigate("/dashboard");
    } catch {
      setError("Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-2xl mb-4 text-center">Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full mb-2 p-2 border rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="dormId"
          placeholder="Dorm ID (optional)"
          className="w-full mb-2 p-2 border rounded"
          value={form.dormId}
          onChange={handleChange}
        />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Register
        </button>
        <div className="mt-2 text-center">
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </div>
      </form>
    </div>
  );
}