import React from "react";

// Glass effect utility for cards
const glassStyle = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "20px",
  boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  transition: "all 0.3s ease",
};

// Hover effect for cards
const glassHover = {
  transform: "translateY(-8px)",
  boxShadow: "0 18px 48px rgba(0,0,0,0.35)"
};

const badgeData = [
  { title: "Eco Hero", desc: "Scan 10 objects & recycle responsibly.", icon: "🌱", color: "#10b981" },
  { title: "Carbon Saver", desc: "Save 50kg of carbon footprint.", icon: "🪴", color: "#60a5fa" },
  { title: "Community Star", desc: "Donate or share 5 items.", icon: "⭐", color: "#fbbf24" },
  { title: "Leaderboard Champ", desc: "Reach top 3 on GreenCrew leaderboard.", icon: "🏆", color: "#f472b6" },
];

const rewardData = [
  { title: "Gift Cards", desc: "Earn points & redeem for eco-friendly store gift cards.", icon: "🎁", color: "#10b981" },
  { title: "Campus Recognition", desc: "Get featured as a GreenCrew leader at campus events.", icon: "🏅", color: "#60a5fa" },
  { title: "Exclusive Badges", desc: "Unlock digital badges for your sustainability achievements.", icon: "🥇", color: "#fbbf24" },
];

export default function LandingPage() {
  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "Inter, sans-serif",
      color: "#eee",
      margin: 0,
      padding: 0,
      background: "linear-gradient(135deg,#0d1117 0%,#1f2937 50%,#111827 100%)"
    }}>
      {/* NAVBAR */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "32px 60px 0 60px",
        fontWeight: "bold",
        fontSize: "22px",
        letterSpacing: "0.8px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img src="/logo512.png" alt="GreenCrew Logo" style={{ width: "48px", height: "48px", borderRadius: "12px" }} />
          <span style={{
            background: "linear-gradient(90deg,#10b981,#60a5fa)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontWeight: "900",
            fontSize: "2rem"
          }}>GreenCrew</span>
        </div>
        <div style={{ display: "flex", gap: "32px", fontSize: "18px" }}>
          {["How It Works", "Badges", "Rewards", "Leaderboard"].map((link, idx) => (
            <a key={idx} href={`#${link.toLowerCase().replace(/\s/g, "")}`} style={{ textDecoration: "none", color: "#eee", fontWeight: "500" }}>{link}</a>
          ))}
          <a href="/login" style={{
            background: "linear-gradient(90deg,#10b981,#60a5fa)",
            color: "white",
            borderRadius: "12px",
            padding: "10px 28px",
            fontWeight: "bold",
            textDecoration: "none",
            boxShadow: "0 4px 18px rgba(16,185,129,0.35)",
            transition: "all 0.25s",
          }}>Join Now</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        marginTop: "60px",
        minHeight: "450px",
        gap: "60px",
        padding: "0 20px"
      }}>
        <div style={{ ...glassStyle, padding: "60px 50px", maxWidth: "540px", flex: "1 1 400px" }}>
          <h1 style={{
            fontSize: "56px",
            fontWeight: "900",
            lineHeight: "1.1",
            marginBottom: "22px",
            background: "linear-gradient(90deg,#10b981,#60a5fa)",
            WebkitBackgroundClip: "text",
            color: "transparent"
          }}>Join the <span style={{ color: "#10b981" }}>GreenCrew</span> Movement!</h1>
          <p style={{ fontSize: "22px", lineHeight: "1.6", fontWeight: "500", marginBottom: "30px", color:"#ddd" }}>
            A smarter, gamified way to make campus greener.<br />Scan, recycle, donate, and earn rewards for saving the planet!
          </p>
          <a href="/signup" style={{
            display: "inline-block",
            background: "linear-gradient(90deg,#10b981,#60a5fa)",
            color: "white",
            fontWeight: "bold",
            fontSize: "22px",
            padding: "16px 44px",
            borderRadius: "16px",
            textDecoration: "none",
            boxShadow: "0 6px 28px rgba(16,185,129,0.45)",
            transition: "all 0.25s",
            transform: "scale(1)",
          }}
            onMouseEnter={e => e.currentTarget.style.transform="scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
          >Get Started</a>
        </div>
        <img src="/images/eco-hero.png" alt="Eco Campus" style={{
          width: "430px",
          borderRadius: "28px",
          boxShadow: "0 20px 48px rgba(16,185,129,0.25)",
          objectFit: "cover",
        }} />
      </section>

      {/* BADGES */}
      <section id="badges" style={{ margin: "110px auto", maxWidth: "1160px", padding: "0 10px" }}>
        <h2 style={{ fontSize: "38px", fontWeight: "900", color: "#10b981", marginBottom: "38px", textAlign: "center" }}>Badges & Achievements</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "36px", justifyContent: "center" }}>
          {badgeData.map((bdg, idx) => (
            <div key={idx} style={{ ...glassStyle, padding: "36px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", cursor: "pointer" }}
              onMouseEnter={e => Object.assign(e.currentTarget.style, glassHover)}
              onMouseLeave={e => Object.assign(e.currentTarget.style, glassStyle)}>
              <div style={{ fontSize: "48px", marginBottom: "14px", color: bdg.color }}>{bdg.icon}</div>
              <h3 style={{ fontSize: "21px", fontWeight: "700", marginBottom: "7px", color: bdg.color }}>{bdg.title}</h3>
              <p style={{ fontSize: "16px", color: "#ddd", fontWeight: "500" }}>{bdg.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REWARDS */}
      <section id="rewards" style={{ margin: "110px auto", maxWidth: "1160px", padding: "0 10px" }}>
        <h2 style={{ fontSize: "38px", fontWeight: "900", color: "#60a5fa", marginBottom: "38px", textAlign: "center" }}>Reward System</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "36px", justifyContent: "center" }}>
          {rewardData.map((rw, idx) => (
            <div key={idx} style={{ ...glassStyle, padding: "36px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", cursor: "pointer" }}
              onMouseEnter={e => Object.assign(e.currentTarget.style, glassHover)}
              onMouseLeave={e => Object.assign(e.currentTarget.style, glassStyle)}>
              <div style={{ fontSize: "48px", marginBottom: "14px", color: rw.color }}>{rw.icon}</div>
              <h3 style={{ fontSize: "21px", fontWeight: "700", marginBottom: "7px", color: rw.color }}>{rw.title}</h3>
              <p style={{ fontSize: "16px", color: "#ddd", fontWeight: "500" }}>{rw.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        marginTop: "100px",
        padding: "50px 20px",
        textAlign: "center",
        background: "rgba(0,0,0,0.35)",
        boxShadow: "0 -4px 48px rgba(0,0,0,0.35)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "20px 20px 0 0",
        color: "#eee",
      }}>
        <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>GreenCrew Campus</h3>
        <p style={{ margin: "4px 0", fontSize: "16px" }}>© {new Date().getFullYear()} Built for a sustainable future 🌎</p>
        <p style={{ margin: "4px 0", fontSize: "14px", color: "#10b981" }}>Questions? Reach us at <a href="mailto:hello@greencrew.app" style={{color:"#10b981", textDecoration:"underline"}}>hello@greencrew.app</a></p>
      </footer>
    </div>
  );
}
