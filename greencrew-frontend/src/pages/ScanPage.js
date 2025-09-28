import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// --- Dynamic, Categorized Result Card ---
const formatKey = (key) =>
  key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const categorizeKeys = (obj) => {
  const categories = {
    Object: ["class", "confidence", "name", "bbox", "category"],
    Price: ["estimated", "confidence_level", "breakdown"],
    Environment: ["environment", "env_score", "env_category"],
    Status: ["recyclable", "success", "error"],
    Miscellaneous: [],
  };

  const result = {};
  Object.keys(categories).forEach((cat) => (result[cat] = {}));

  for (const key in obj) {
    if (["id", "scan_id", "timestamp"].includes(key)) continue;
    let found = false;
    for (const cat in categories) {
      if (categories[cat].includes(key)) {
        result[cat][key] = obj[key];
        found = true;
        break;
      }
    }
    if (!found) {
      result.Miscellaneous[key] = obj[key];
    }
  }
  return result;
};

const renderValue = (value) => {
  if (typeof value === "boolean") {
    return (
      <span style={{
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: value ? '#10b981' : '#ef4444',
        color: 'white',
        display: 'inline-block'
      }}>
        {value ? "✓ Yes" : "✗ No"}
      </span>
    );
  }
  if (typeof value === "number") {
    if (value >= 0 && value <= 1) {
      return (
        <span style={{
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          backgroundColor: '#3b82f6',
          color: 'white',
          display: 'inline-block'
        }}>
          {Math.round(value * 100)}%
        </span>
      );
    }
    return <span style={{fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold'}}>{value}</span>;
  }
  if (typeof value === "object" && value !== null) {
    if (Array.isArray(value)) {
      return (
        <ul style={{listStyle: 'none', padding: 0, margin: '8px 0'}}>
          {value.map((item, idx) => (
            <li key={idx} style={{
              padding: '8px',
              margin: '4px 0',
              backgroundColor: '#f8fafc',
              borderLeft: '4px solid #3b82f6',
              borderRadius: '4px'
            }}>
              {renderValue(item)}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <div style={{
        backgroundColor: '#f1f5f9',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '12px',
        margin: '8px 0'
      }}>
        {Object.entries(value).map(([subKey, subVal], idx) => (
          <div key={idx} style={{marginBottom: '8px'}}>
            <strong>{formatKey(subKey)}:</strong> {renderValue(subVal)}
          </div>
        ))}
      </div>
    );
  }
  return <span style={{fontWeight: '500'}}>{String(value)}</span>;
};

const CategoryCard = ({ title, data }) => {
  if (Object.keys(data).length === 0) return null;
  
  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      textAlign: 'center'
    }}
    onMouseEnter={(e) => {
      e.target.style.boxShadow = '0 10px 25px 0 rgba(0, 0, 0, 0.15)';
      e.target.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
      e.target.style.transform = 'translateY(0px)';
    }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#1f2937',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '10px',
        textAlign: 'center'
      }}>{title}</h3>
      
      {Object.entries(data).map(([key, value]) => (
        <div key={key} style={{
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#fafbfc',
          borderRadius: '8px',
          border: '1px solid #f3f4f6',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            {formatKey(key)}
          </div>
          <div style={{fontSize: '16px', textAlign: 'center'}}>
            {renderValue(value)}
          </div>
        </div>
      ))}
    </div>
  );
};

const ErrorResultCard = ({ error, result }) => (
  <div style={{
    maxWidth: '700px',
    margin: '40px auto',
    padding: '32px 24px',
    backgroundColor: '#fee2e2',
    border: '2px solid #fecaca',
    borderRadius: '12px',
    color: '#dc2626',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '20px'
  }}>
    <div>
      <svg width="36" height="36" fill="currentColor" viewBox="0 0 20 20" style={{ marginBottom: '12px' }}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V6a1 1 0 112 0v3a1 1 0 01-2 0zm1 5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
      </svg>
      <div>{error || "Scan failed. Try again!"}</div>
      {result?.class && (
        <div style={{ marginTop: '18px', color: '#6b7280', fontWeight: 'normal', fontSize: '16px' }}>
          <strong>Detected:</strong> {result.class} &nbsp; (confidence: {result.confidence})
        </div>
      )}
    </div>
  </div>
);

const ResultCard = ({ result, scanSuccess, error }) => {
  if (!scanSuccess) {
    return <ErrorResultCard error={error} result={result} />;
  }
  if (!result || typeof result !== "object") return null;

  // Extract key information for better display
  const objectInfo = result.object || {};
  const priceInfo = result.price || {};
  const envInfo = result.environmental || {};

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '0 20px'
    }}>
      {/* Main Detection Result */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '30px',
        textAlign: 'center',
        border: '2px solid #10b981',
        boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
      }}>
        <div style={{
          fontSize: '60px',
          marginBottom: '20px'
        }}>
          {getItemEmoji(objectInfo.class)}
        </div>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#10b981',
          marginBottom: '10px',
          textTransform: 'capitalize'
        }}>
          {objectInfo.name || objectInfo.class || 'Unknown Object'}
        </h2>
        <div style={{
          fontSize: '18px',
          color: '#9ca3af',
          marginBottom: '20px'
        }}>
          Confidence: <span style={{ color: '#10b981', fontWeight: 'bold' }}>
            {objectInfo.confidence}%
          </span>
        </div>
        <div style={{
          display: 'inline-block',
          backgroundColor: objectInfo.confidence >= 80 ? '#10b981' : objectInfo.confidence >= 60 ? '#f59e0b' : '#ef4444',
          color: 'white',
          padding: '8px 20px',
          borderRadius: '25px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {objectInfo.confidence >= 80 ? '✓ High Confidence' :
           objectInfo.confidence >= 60 ? '⚠ Medium Confidence' :
           '⚠ Low Confidence'}
        </div>
      </div>

      {/* Information Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px',
        marginBottom: '30px'
      }}>

        {/* Environmental Impact Card */}
        {envInfo && (
          <div style={{
            backgroundColor: '#065f46',
            borderRadius: '16px',
            padding: '24px',
            color: 'white'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>🌍</span>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                Environmental Impact
              </h3>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#a7f3d0', marginBottom: '4px' }}>
                CO₂ You Can Save
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                {envInfo.carbonSaved || 0} kg
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#a7f3d0', marginBottom: '4px' }}>
                Recyclable
              </div>
              <div style={{
                display: 'inline-block',
                backgroundColor: envInfo.recyclable ? '#10b981' : '#ef4444',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {envInfo.recyclable ? '✓ Yes' : '✗ No'}
              </div>
            </div>

            {envInfo.actionScore && (
              <div>
                <div style={{ fontSize: '14px', color: '#a7f3d0', marginBottom: '8px' }}>
                  Environmental Score
                </div>
                <div style={{
                  backgroundColor: '#134e4a',
                  borderRadius: '8px',
                  padding: '12px',
                  position: 'relative'
                }}>
                  <div style={{
                    width: `${envInfo.actionScore}%`,
                    height: '8px',
                    backgroundColor: envInfo.actionScore >= 80 ? '#10b981' : envInfo.actionScore >= 60 ? '#f59e0b' : '#ef4444',
                    borderRadius: '4px',
                    transition: 'width 1s ease'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '12px',
                    transform: 'translateY(-50%)',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {envInfo.actionScore}/100
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Price Information Card */}
        {priceInfo && (
          <div style={{
            backgroundColor: '#1e40af',
            borderRadius: '16px',
            padding: '24px',
            color: 'white'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>💰</span>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                Estimated Value
              </h3>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#bfdbfe', marginBottom: '4px' }}>
                Resale Value
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>
                ${priceInfo.estimated || 0}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#bfdbfe', marginBottom: '4px' }}>
                Price Confidence
              </div>
              <div style={{
                display: 'inline-block',
                backgroundColor: '#1e3a8a',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}>
                {priceInfo.confidence_level || priceInfo.confidence || 'Medium'}
              </div>
            </div>

            {priceInfo.breakdown && (
              <div style={{
                backgroundColor: '#1e3a8a',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '12px'
              }}>
                <div style={{ marginBottom: '4px' }}>
                  Category: <span style={{ color: '#bfdbfe' }}>
                    {priceInfo.breakdown.category || 'General'}
                  </span>
                </div>
                <div>
                  Condition: <span style={{ color: '#bfdbfe' }}>
                    {priceInfo.breakdown.condition || 'Good'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Suggestions Card */}
        <div style={{
          backgroundColor: '#7c2d12',
          borderRadius: '16px',
          padding: '24px',
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '24px', marginRight: '12px' }}>💡</span>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
              What You Can Do
            </h3>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
              padding: '8px',
              backgroundColor: '#92400e',
              borderRadius: '8px'
            }}>
              <span style={{ marginRight: '8px' }}>♻️</span>
              <span>Recycle for maximum environmental impact</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
              padding: '8px',
              backgroundColor: '#92400e',
              borderRadius: '8px'
            }}>
              <span style={{ marginRight: '8px' }}>💵</span>
              <span>Sell for ${priceInfo.estimated || 0} estimated value</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              backgroundColor: '#92400e',
              borderRadius: '8px'
            }}>
              <span style={{ marginRight: '8px' }}>❤️</span>
              <span>Donate to help your community</span>
            </div>
          </div>

          {envInfo.recommendations && envInfo.recommendations.length > 0 && (
            <div>
              <div style={{ fontSize: '14px', color: '#fed7aa', marginBottom: '8px' }}>
                💭 Expert Tips:
              </div>
              {envInfo.recommendations.slice(0, 2).map((rec, idx) => (
                <div key={idx} style={{
                  fontSize: '12px',
                  padding: '6px 8px',
                  backgroundColor: '#92400e',
                  borderRadius: '6px',
                  marginBottom: '4px'
                }}>
                  {rec}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get emoji for different object types
const getItemEmoji = (className) => {
  const emojiMap = {
    'bottle': '🍶',
    'cup': '☕',
    'wine glass': '🍷',
    'cell phone': '📱',
    'laptop': '💻',
    'book': '📚',
    'chair': '🪑',
    'couch': '🛋️',
    'bicycle': '🚲',
    'car': '🚗',
    'truck': '🚚',
    'bus': '🚌',
    'sports ball': '⚽',
    'backpack': '🎒',
    'handbag': '👜',
    'suitcase': '🧳',
    'tv': '📺',
    'microwave': '⏰',
    'toaster': '🍞',
    'refrigerator': '🧊',
    'keyboard': '⌨️',
    'mouse': '🖱️',
    'remote': '📱',
    'scissors': '✂️',
    'hair drier': '💨',
    'toothbrush': '🦷'
  };

  return emojiMap[className?.toLowerCase()] || '📦';
};

export default function ScanPage() {
  const { token, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState("");
  const [actionResult, setActionResult] = useState(null);
  const [actionDone, setActionDone] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Start camera
  const startCamera = async (mode = facingMode) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setIsCameraActive(true);
      setError("");
    } catch (err) {
      setError("Cannot access camera. Please allow camera permissions or use Upload Image.");
      console.error("Camera access error:", err);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  // Capture photo from video
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    });
  };

  // Handle scan
  const handleScan = async () => {
    if (!isCameraActive) {
      setError("Please start the camera first.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    setActionDone(false);

    try {
      const photoBlob = await capturePhoto();
      if (!photoBlob) {
        setError("Failed to capture photo.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", photoBlob, "capture.jpg");

      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/scan`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Scan response:", data); // Debug log

      setScanSuccess(data.success);

      if (data.success) {
        setResult(data.result);
        setError("");
      } else {
        setResult(data.result || null);
        setError(data.error || data.message || "Scan failed.");
      }

      setActionFeedback("");
      setActionResult(null);
    } catch (err) {
      console.error("Scan error:", err);
      setError(`Network error: ${err.message}. Please check if the backend is running.`);
      setScanSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle upload-based scan
  const handleUploadScan = async (file) => {
    if (!file) return;
    setError("");
    setLoading(true);
    setResult(null);
    setActionDone(false);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/scan`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setScanSuccess(data.success);
      if (data.success) {
        setResult(data.result);
        setError("");
      } else {
        setResult(data.result || null);
        setError(data.error || data.message || "Scan failed.");
      }
      setActionFeedback("");
      setActionResult(null);
    } catch (err) {
      console.error("Upload scan error:", err);
      setError(`Upload error: ${err.message}. Please verify the image and backend.`);
      setScanSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Switch camera between front/back
  const toggleCameraFacing = async () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    if (isCameraActive) {
      stopCamera();
      await startCamera(next);
    }
  };

  // Handle action (Recycle/Sell/Donate/Share)
  const handleAction = async (actionType) => {
    if (!result) return;
    setActionLoading(true);
    setActionFeedback("");
    setActionResult(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/scan/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          scanId: result.id || ("scan_"+Date.now()),
          action: actionType,
          scanResult: result,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Action response:", data); // Debug log

      if (data.success) {
        setActionFeedback(
          `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} successful! Points earned: ${data.pointsEarned}. XP: ${data.playerState?.xp || 'N/A'}. Level: ${data.playerState?.level || 'N/A'}`
        );
        setActionResult(data.playerState);
        setActionDone(true); // Disable buttons after first successful action
        refreshUser(); // Update dashboard after action
      } else {
        setActionFeedback(data.error || "Action failed.");
      }
    } catch (err) {
      console.error("Action error:", err);
      setActionFeedback(`Action failed: ${err.message}. Please check if the backend is running.`);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2f1a 0%, #0f1f0f 50%, #1a2f1a 100%)',
      padding: '20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Environmental Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23527a52' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.6
      }} />

      {/* Ambient Glows */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(82, 122, 82, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(139, 154, 139, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(30px)',
        animation: 'float 6s ease-in-out infinite reverse'
      }} />

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '60px',
        padding: '60px 0 40px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
          position: 'relative'
        }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              position: 'absolute',
              left: 0,
              background: 'rgba(82, 122, 82, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(143, 188, 143, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: '500',
              gap: '8px',
              color: '#8fbc8f',
              fontFamily: 'Inter, system-ui, sans-serif',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(82, 122, 82, 0.3)';
              e.target.style.borderColor = 'rgba(143, 188, 143, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(82, 122, 82, 0.2)';
              e.target.style.borderColor = 'rgba(143, 188, 143, 0.3)';
            }}
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '300',
            color: '#8fbc8f',
            textAlign: 'center',
            margin: 0,
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '0.02em'
          }}>Environmental Scanner</h1>
        </div>
        <p style={{
          fontSize: '1.25rem',
          color: 'rgba(143, 188, 143, 0.8)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.7',
          textAlign: 'center',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: '400'
        }}>
          Analyze objects to understand their environmental footprint and discover sustainable alternatives
        </p>
      </div>

      {/* Main Interface */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(26, 47, 26, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(143, 188, 143, 0.2)',
        borderRadius: '20px',
        padding: '48px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(143, 188, 143, 0.1)',
        marginBottom: '60px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Camera Interface */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '48px'
        }}>
          <div style={{
            background: 'rgba(15, 31, 15, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(143, 188, 143, 0.15)',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '800px',
            width: '100%',
            boxShadow: 'inset 0 2px 16px rgba(0, 0, 0, 0.2)'
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '16px',
                backgroundColor: 'rgba(31, 41, 31, 0.8)',
                border: isCameraActive ? '2px solid rgba(143, 188, 143, 0.6)' : '2px solid rgba(139, 154, 139, 0.3)',
                display: isCameraActive ? 'block' : 'none',
                boxShadow: isCameraActive ? '0 8px 32px rgba(143, 188, 143, 0.2)' : 'none',
                transition: 'all 0.3s ease'
              }}
            />
            {!isCameraActive && (
              <div style={{
                width: '100%',
                height: '400px',
                background: 'rgba(31, 41, 31, 0.6)',
                borderRadius: '16px',
                border: '2px dashed rgba(143, 188, 143, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <div style={{
                  width: '96px',
                  height: '96px',
                  background: 'rgba(82, 122, 82, 0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  border: '1px solid rgba(143, 188, 143, 0.2)'
                }}>
                  <svg width="48" height="48" fill="rgba(143, 188, 143, 0.7)" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293L12.293 3.293A1 1 0 0011.586 3H8.414a1 1 0 00-.707.293L6.293 4.707A1 1 0 015.586 5H4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p style={{
                  color: 'rgba(143, 188, 143, 0.9)',
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  marginBottom: '8px',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}>Camera Preview</p>
                <p style={{
                  color: 'rgba(143, 188, 143, 0.6)',
                  fontSize: '1rem',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: '400'
                }}>Activate camera or upload an image to begin analysis</p>
              </div>
            )}
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUploadScan(file);
            e.target.value = '';
          }}
        />

        {/* Error Display */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '32px',
            maxWidth: '800px',
            margin: '0 auto 32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" style={{ marginRight: '12px' }}>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span style={{ fontWeight: '600' }}>{error}</span>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Start Camera
            </button>
          ) : (
            <>
              <button
                onClick={toggleCameraFacing}
                aria-label="Switch camera"
                style={{
                  backgroundColor: '#0ea5e9',
                  color: 'white',
                  padding: '16px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#0284c7';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#0ea5e9';
                }}
              >
                {facingMode === 'environment' ? 'Use Front Camera' : 'Use Back Camera'}
              </button>
              <button
                onClick={handleScan}
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#9ca3af' : '#10b981',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: loading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#059669';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#10b981';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {loading ? (
                  <>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" style={{
                      animation: 'spin 1s linear infinite'
                    }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" opacity="0.75" />
                    </svg>
                    Scanning...
                  </>
                ) : (
                  <>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Scan Object
                  </>
                )}
              </button>
              
              <button
                onClick={stopCamera}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#dc2626';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ef4444';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Stop Camera
              </button>
            </>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload image for scanning"
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#4b5563';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#6b7280';
            }}
          >
            Upload Image
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            marginTop: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '20px 40px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px',
              border: '2px dashed #d1d5db'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e5e7eb',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                margin: '0 auto 16px',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                margin: 0
              }}>Processing your scan...</p>
            </div>
          </div>
        )}
      </div>

      {/* Results Display */}
      {result && (
        <>
          <ResultCard result={result} scanSuccess={scanSuccess} error={error} />
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <button
              onClick={() => {
                setResult(null);
                setScanSuccess(true);
                setError("");
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#10b981',
                border: '1px solid #10b981',
                padding: '10px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              New Scan
            </button>
          </div>
        </>
      )}

      {/* Action Buttons & Feedback: only show if scan was successful */}
      {scanSuccess && result && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {!actionDone ? (
            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center',
              border: '2px solid #6366f1',
              boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)'
            }}>
              <h3 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#6366f1',
                marginBottom: '10px'
              }}>
                🎯 Choose Your Action
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#9ca3af',
                marginBottom: '30px',
                maxWidth: '600px',
                margin: '0 auto 30px'
              }}>
                What would you like to do with this item? Each action earns you different XP and helps the environment in unique ways!
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                maxWidth: '800px',
                margin: '0 auto'
              }}>

                {/* Recycle Button */}
                <button
                  onClick={() => handleAction("recycle")}
                  disabled={actionLoading}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    opacity: actionLoading ? 0.6 : 1,
                    transition: 'all 0.3s ease',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                  onMouseEnter={(e) => {
                    if (!actionLoading) {
                      e.target.style.transform = 'translateY(-4px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!actionLoading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>♻️</div>
                  <div>RECYCLE</div>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                    Save the planet
                  </div>
                </button>

                {/* Sell Button */}
                <button
                  onClick={() => handleAction("sell")}
                  disabled={actionLoading}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    opacity: actionLoading ? 0.6 : 1,
                    transition: 'all 0.3s ease',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                  onMouseEnter={(e) => {
                    if (!actionLoading) {
                      e.target.style.transform = 'translateY(-4px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!actionLoading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
                  <div>SELL</div>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                    Earn ${result?.price?.estimated || 0}
                  </div>
                </button>

                {/* Donate Button */}
                <button
                  onClick={() => handleAction("donate")}
                  disabled={actionLoading}
                  style={{
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    opacity: actionLoading ? 0.6 : 1,
                    transition: 'all 0.3s ease',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                  onMouseEnter={(e) => {
                    if (!actionLoading) {
                      e.target.style.transform = 'translateY(-4px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!actionLoading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>❤️</div>
                  <div>DONATE</div>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                    Help others
                  </div>
                </button>

                {/* Share Button */}
                <button
                  onClick={() => handleAction("share")}
                  disabled={actionLoading}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    opacity: actionLoading ? 0.6 : 1,
                    transition: 'all 0.3s ease',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                  onMouseEnter={(e) => {
                    if (!actionLoading) {
                      e.target.style.transform = 'translateY(-4px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!actionLoading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🌟</div>
                  <div>SHARE</div>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                    Spread awareness
                  </div>
                </button>
              </div>

              {actionLoading && (
                <div style={{
                  marginTop: '30px',
                  fontSize: '16px',
                  color: '#6366f1'
                }}>
                  <div style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    border: '3px solid #6366f1',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '10px'
                  }}></div>
                  Processing your action...
                </div>
              )}
            </div>
          ) : (
            /* Success Message After Action */
            <div style={{
              backgroundColor: '#065f46',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center',
              border: '2px solid #10b981',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
              <h3 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#10b981',
                marginBottom: '20px'
              }}>
                Action Completed Successfully!
              </h3>

              {actionFeedback && (
                <div style={{
                  fontSize: '18px',
                  color: '#a7f3d0',
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: '#064e3b',
                  borderRadius: '12px',
                  maxWidth: '600px',
                  margin: '0 auto 20px'
                }}>
                  {actionFeedback}
                </div>
              )}

              {actionResult && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '16px',
                  maxWidth: '500px',
                  margin: '20px auto'
                }}>
                  <div style={{
                    backgroundColor: '#064e3b',
                    padding: '16px',
                    borderRadius: '12px'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                      {actionResult.level}
                    </div>
                    <div style={{ fontSize: '14px', color: '#a7f3d0' }}>Level</div>
                  </div>
                  <div style={{
                    backgroundColor: '#064e3b',
                    padding: '16px',
                    borderRadius: '12px'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                      {actionResult.xp}
                    </div>
                    <div style={{ fontSize: '14px', color: '#a7f3d0' }}>XP</div>
                  </div>
                  <div style={{
                    backgroundColor: '#064e3b',
                    padding: '16px',
                    borderRadius: '12px'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                      {actionResult.totalPoints}
                    </div>
                    <div style={{ fontSize: '14px', color: '#a7f3d0' }}>Points</div>
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: '20px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#10b981';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                🏠 Return to Dashboard
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
