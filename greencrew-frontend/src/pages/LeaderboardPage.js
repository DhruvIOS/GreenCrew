import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LeaderboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/leaderboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json.leaderboard || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load leaderboard.");
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      {loading && <p>Loading...</p>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <table className="min-w-full bg-white rounded shadow mb-4">
        <thead>
          <tr>
            <th className="p-2 border">Rank</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Points</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, idx) => (
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