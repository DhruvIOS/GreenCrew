import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LeaderboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/leaderboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setData(json.leaderboard || []));
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <table className="min-w-full bg-white rounded shadow mb-4">
        <thead>
          <tr>
            <th className="p-2 border">Rank</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Points</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((user, idx) => (
            <tr key={user.id || idx}>
              <td className="p-2 border">{idx + 1}</td>
              <td className="p-2 border">{user.name || user.email}</td>
              <td className="p-2 border">{user.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}