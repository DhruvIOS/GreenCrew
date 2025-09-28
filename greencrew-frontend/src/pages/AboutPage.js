import React from "react";

// Reuse the same glass/gradient design language as LandingPage
const glassStyle = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "20px",
  boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  transition: "all 0.3s ease",
};

const glassHover = {
  transform: "translateY(-8px)",
  boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
};

const steps = [
  { icon: "📸", title: "Scan Items", desc: "Identify recyclables using your camera and get instant tips." },
  { icon: "♻️", title: "Recycle & Donate", desc: "Drop at campus points or donate usable items to peers." },
  { icon: "✨", title: "Earn Points", desc: "Collect points, unlock badges, and climb the leaderboard." },
  { icon: "🎁", title: "Redeem Rewards", desc: "Trade points for eco-friendly perks and recognition." },
];

const team = [
  { name: "Avery Park", role: "Product & UX", color: "#10b981", emoji: "🎨" },
  { name: "Riley Chen", role: "Engineering", color: "#60a5fa", emoji: "🧠" },
  { name: "Jordan Lee", role: "Impact & Ops", color: "#fbbf24", emoji: "🌎" },
];

const partners = [
  { name: "Campus Sustainability", img: "/images/gamefi.png" },
  { name: "Eco Initiatives", img: "/images/gamefication.png" },
  { name: "Green Sponsors", img: "/images/google.png" },
];

export default function AboutPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
        color: "#eee",
        margin: 0,
        padding: 0,
        background: "linear-gradient(135deg,#0d1117 0%,#1f2937 50%,#111827 100%)",
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "32px 60px 0 60px",
          fontWeight: "bold",
          fontSize: "22px",
          letterSpacing: "0.8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "16px", textDecoration: "none" }}>
            <img
              src="/logo512.png"
              alt="GreenCrew Logo"
              style={{ width: "48px", height: "48px", borderRadius: "12px" }}
            />
            <span
              style={{
                background: "linear-gradient(90deg,#10b981,#60a5fa)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontWeight: "900",
                fontSize: "2rem",
              }}
            >
              GreenCrew
            </span>
          </a>
        </div>
        <div style={{ display: "flex", gap: "32px", fontSize: "18px" }}>
          <a href="/" style={{ textDecoration: "none", color: "#eee", fontWeight: "500" }}>Home</a>
          <a href="/about" style={{ textDecoration: "none", color: "#eee", fontWeight: "700" }}>About</a>
          <a href="/leaderboard" style={{ textDecoration: "none", color: "#eee", fontWeight: "500" }}>Leaderboard</a>
          <a
            href="/login"
            style={{
              background: "linear-gradient(90deg,#10b981,#60a5fa)",
              color: "white",
              borderRadius: "12px",
              padding: "10px 28px",
              fontWeight: "bold",
              textDecoration: "none",
              boxShadow: "0 4px 18px rgba(16,185,129,0.35)",
              transition: "all 0.25s",
            }}
          >
            Join Now
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: "60px",
          minHeight: "450px",
          gap: "60px",
          padding: "0 20px",
        }}
      >
        <div style={{ ...glassStyle, padding: "60px 50px", maxWidth: "540px", flex: "1 1 400px" }}>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "900",
              lineHeight: "1.1",
              marginBottom: "18px",
              background: "linear-gradient(90deg,#10b981,#60a5fa)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            About GreenCrew
          </h1>
          <p style={{ fontSize: "20px", lineHeight: "1.7", fontWeight: "500", marginBottom: "24px", color: "#ddd" }}>
            We are a campus sustainability movement that turns everyday
            eco-actions into a fun, rewarding game. Together we make it
            effortless to scan, sort, recycle, and donate—while earning
            points, badges, and real-world rewards.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a
              href="/login"
              style={{
                display: "inline-block",
                background: "linear-gradient(90deg,#10b981,#60a5fa)",
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
                padding: "12px 26px",
                borderRadius: "12px",
                textDecoration: "none",
                boxShadow: "0 6px 28px rgba(16,185,129,0.45)",
              }}
            >
              Get Started
            </a>
            <a
              href="#mission"
              style={{
                display: "inline-block",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#eee",
                fontWeight: "600",
                fontSize: "18px",
                padding: "12px 26px",
                borderRadius: "12px",
                textDecoration: "none",
              }}
            >
              Our Mission
            </a>
          </div>
        </div>
        <img
          src="/images/eco-campus-hero.png"
          alt="About GreenCrew"
          style={{
            width: "430px",
            borderRadius: "28px",
            boxShadow: "0 20px 48px rgba(16,185,129,0.25)",
            objectFit: "cover",
          }}
        />
      </section>

      {/* Mission & Vision */}
      <section id="mission" style={{ margin: "90px auto", maxWidth: "1160px", padding: "0 10px" }}>
        <h2 style={{ fontSize: "34px", fontWeight: "900", color: "#10b981", marginBottom: "28px", textAlign: "center" }}>
          Mission & Vision
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "24px" }}>
          <div
            style={{ ...glassStyle, padding: "28px 24px" }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, glassHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, glassStyle)}
          >
            <h3 style={{ fontSize: "22px", color: "#10b981", marginBottom: "8px", fontWeight: 800 }}>Our Mission</h3>
            <p style={{ color: "#ddd", lineHeight: 1.7 }}>
              Empower every student to take climate-positive actions through
              instant guidance, gamified motivation, and meaningful rewards.
            </p>
          </div>
          <div
            style={{ ...glassStyle, padding: "28px 24px" }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, glassHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, glassStyle)}
          >
            <h3 style={{ fontSize: "22px", color: "#60a5fa", marginBottom: "8px", fontWeight: 800 }}>Our Vision</h3>
            <p style={{ color: "#ddd", lineHeight: 1.7 }}>
              Campuses where sustainability is second nature—and celebrated.
              Together we build habits that last beyond graduation.
            </p>
          </div>
          <div
            style={{ ...glassStyle, padding: "28px 24px" }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, glassHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, glassStyle)}
          >
            <h3 style={{ fontSize: "22px", color: "#fbbf24", marginBottom: "8px", fontWeight: 800 }}>Core Values</h3>
            <p style={{ color: "#ddd", lineHeight: 1.7 }}>
              Impact, inclusivity, transparency—and a little friendly
              competition for good.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ margin: "90px auto", maxWidth: "1160px", padding: "0 10px" }}>
        <h2 style={{ fontSize: "34px", fontWeight: "900", color: "#60a5fa", marginBottom: "28px", textAlign: "center" }}>
          How It Works
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "24px" }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{ ...glassStyle, padding: "24px", textAlign: "center", cursor: "pointer" }}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, glassHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, glassStyle)}
            >
              <div style={{ fontSize: "40px", marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>{s.title}</div>
              <div style={{ color: "#ddd" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Stats */}
      <section style={{ margin: "90px auto", maxWidth: "1160px", padding: "0 10px" }}>
        <h2 style={{ fontSize: "34px", fontWeight: "900", color: "#10b981", marginBottom: "28px", textAlign: "center" }}>
          Our Impact (Pilot)
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "24px" }}>
          {[{k:"Scans",v:"12,450"},{k:"Items Recycled",v:"8,120"},{k:"Donations",v:"1,040"},{k:"CO₂ Saved",v:"23,500 kg"}].map((it, idx) => (
            <div key={idx} style={{ ...glassStyle, padding: "26px", textAlign: "center" }}>
              <div style={{ fontSize: 12, letterSpacing: 1.2, color: "#9ca3af" }}>{it.k}</div>
              <div style={{ fontSize: 28, fontWeight: 900, marginTop: 6, background: "linear-gradient(90deg,#10b981,#60a5fa)", WebkitBackgroundClip: "text", color: "transparent" }}>{it.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ margin: "90px auto", maxWidth: "1160px", padding: "0 10px" }}>
        <h2 style={{ fontSize: "34px", fontWeight: "900", color: "#fbbf24", marginBottom: "28px", textAlign: "center" }}>
          Team
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "24px" }}>
          {team.map((m, i) => (
            <div key={i} style={{ ...glassStyle, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 42, marginBottom: 8 }}>{m.emoji}</div>
              <div style={{ fontWeight: 900, color: m.color }}>{m.name}</div>
              <div style={{ color: "#ddd" }}>{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section style={{ margin: "90px auto", maxWidth: "1160px", padding: "0 10px" }}>
        <h2 style={{ fontSize: "34px", fontWeight: "900", color: "#60a5fa", marginBottom: "28px", textAlign: "center" }}>
          Partners & Supporters
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "24px", alignItems: "center" }}>
          {partners.map((p, i) => (
            <div key={i} style={{ ...glassStyle, padding: 18, textAlign: "center" }}>
              <img src={p.img} alt={p.name} style={{ maxWidth: 140, opacity: 0.9 }} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ margin: "90px auto", maxWidth: "920px", padding: "0 10px" }}>
        <div style={{ ...glassStyle, padding: 28, textAlign: "center" }}>
          <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Ready to join the movement?</h3>
          <p style={{ color: "#ddd", marginBottom: 16 }}>Create your account and start earning impact today.</p>
          <a
            href="/login"
            style={{
              display: "inline-block",
              background: "linear-gradient(90deg,#10b981,#60a5fa)",
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
              padding: "12px 26px",
              borderRadius: "12px",
              textDecoration: "none",
              boxShadow: "0 6px 28px rgba(16,185,129,0.45)",
            }}
          >
            Join GreenCrew
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
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
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>GreenCrew Campus</h3>
        <p style={{ margin: "4px 0", fontSize: "16px" }}>
          © {new Date().getFullYear()} Built for a sustainable future 🌎
        </p>
        <p style={{ margin: "4px 0", fontSize: "14px", color: "#10b981" }}>
          Questions? Reach us at <a href="mailto:hello@greencrew.app" style={{ color: "#10b981", textDecoration: "underline" }}>hello@greencrew.app</a>
        </p>
      </footer>
    </div>
  );
}

