import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ScanPage() {
  const { token } = useAuth();
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!image) return setError("Select an image.");
    setError(""); setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/scan`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch {
      setError("Scan failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <form onSubmit={handleScan} className="bg-white p-6 rounded shadow w-96 mb-4">
        <h2 className="text-xl mb-2">Scan an Object</h2>
        <input type="file" accept="image/*" onChange={handleImage} className="mb-2" />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded" disabled={loading}>
          {loading ? "Scanning..." : "Scan"}
        </button>
      </form>
      {result && (
        <div className="bg-gray-100 p-4 rounded shadow w-96">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}