import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout, refreshUser } = useAuth();

  useEffect(() => {
    // Always get latest stats when dashboard mounts
    refreshUser();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg text-center mb-4">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name || "Player"}!</h1>
        <p className="mb-2">Email: {user?.email}</p>
        <p className="mb-2">Dorm: {user?.dormId || "N/A"}</p>
        <p className="mb-2">Level: {user?.level}</p>
        <p className="mb-2">XP: {user?.xp}</p>
        <p className="mb-2">Total Points: {user?.totalPoints}</p>
        <button
          onClick={logout}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <div className="flex gap-4">
        <Link to="/scan" className="bg-blue-500 text-white px-4 py-2 rounded">Scan</Link>
        <Link to="/leaderboard" className="bg-yellow-500 text-white px-4 py-2 rounded">Leaderboard</Link>
        <Link to="/profile" className="bg-gray-600 text-white px-4 py-2 rounded">Profile</Link>
      </div>
    </div>
  );
}