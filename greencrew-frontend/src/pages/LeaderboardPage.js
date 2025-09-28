import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/leaderboard/global`)
      .then(res => {
        setLeaderboard(res.data.leaderboard || []);
        setLoading(false);
        setError("");
      })
      .catch(err => {
        setError("Could not load leaderboard.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-blue-500 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-2xl text-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500 font-bold">{error}</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-2 py-1">Rank</th>
                <th className="px-2 py-1">Name</th>
                <th className="px-2 py-1">Level</th>
                <th className="px-2 py-1">XP</th>
                <th className="px-2 py-1">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map(player => (
                <tr key={player.rank}>
                  <td className="px-2 py-1 font-bold">{player.rank}</td>
                  <td className="px-2 py-1">{player.name}</td>
                  <td className="px-2 py-1">{player.level}</td>
                  <td className="px-2 py-1">{player.xp}</td>
                  <td className="px-2 py-1">{player.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}