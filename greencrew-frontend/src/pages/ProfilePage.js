import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState({});
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setProfile(json.player || {}));
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-gray-100 p-6 rounded shadow w-96">
        <h2 className="text-xl mb-2 font-bold">Profile</h2>
        <p><b>Name:</b> {profile.name}</p>
        <p><b>Email:</b> {profile.email}</p>
        <p><b>Dorm:</b> {profile.dormId}</p>
        <p><b>Level:</b> {profile.level}</p>
        <p><b>XP:</b> {profile.xp}</p>
        <p><b>Total Points:</b> {profile.totalPoints}</p>
      </div>
    </div>
  );
}