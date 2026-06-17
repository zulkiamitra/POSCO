import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/POSCO_LOGO_KITA.png";
import heroImage from "../assets/hero.png";
import bahanImage from "../assets/bahan.jpg";

export default function Home() {
  const navigate = useNavigate();
  const [animatedElements, setAnimatedElements] = useState(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    console.log("🎉 HOME PAGE LOADED - SMOOTH SCROLL ACTIVE");
    document.documentElement.style.scrollBehavior = "smooth";
    
    // Initialize IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedElements((prev) => new Set([...prev, entry.target]));
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    // Observe all animate-hidden elements
    const elementsToObserve = document.querySelectorAll(
      ".animate-hidden, .animate-left, .animate-right, .animate-up"
    );
    elementsToObserve.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(28px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-40px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(40px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-15px);
      }
    }

    @keyframes pulse-ring {
      0% {
        transform: scale(0.95);
        opacity: 1;
      }
      100% {
        transform: scale(1.35);
        opacity: 0;
      }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .animate-hidden {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }

    .animate-hidden.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .animate-left {
      opacity: 0;
      transform: translateX(-40px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }

    .animate-left.visible {
      opacity: 1;
      transform: translateX(0);
    }

    .animate-right {
      opacity: 0;
      transform: translateX(40px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }

    .animate-right.visible {
      opacity: 1;
      transform: translateX(0);
    }

    .animate-up {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }

    .animate-up.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .hero-title {
      animation: fadeInUp 0.8s ease-out forwards;
    }

    .hero-subtitle {
      animation: fadeInUp 0.8s ease-out 0.15s forwards;
      opacity: 0;
    }

    .hero-description {
      animation: fadeInUp 0.8s ease-out 0.3s forwards;
      opacity: 0;
    }

    .feature-card {
      animation: scaleIn 0.6s ease-out forwards;
    }

    .feature-1 { opacity: 0; animation-delay: 0s; }
    .feature-2 { opacity: 0; animation-delay: 0.1s; }
    .feature-3 { opacity: 0; animation-delay: 0.2s; }

    .step-card {
      opacity: 0;
      animation: fadeInUp 0.6s ease-out forwards;
    }

    .step-0 { animation-delay: 0.05s; }
    .step-1 { animation-delay: 0.15s; }
    .step-2 { animation-delay: 0.25s; }
    .step-3 { animation-delay: 0.35s; }

    .floating-stat {
      animation: float 3.5s ease-in-out infinite;
    }

    .floating-stat-1 {
      animation-delay: 0s;
    }

    .floating-stat-2 {
      animation-delay: 0.5s;
    }

    .pulse-ring {
      animation: pulse-ring 2.5s ease-out infinite;
    }

    .pulse-ring-1 {
      animation-delay: 0s;
    }

    .pulse-ring-2 {
      animation-delay: 0.8s;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .about-grid {
        grid-template-columns: 1fr !important;
        gap: 40px !important;
      }

      .how-it-works-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }

    @media (max-width: 768px) {
      .navbar-container {
        padding: 12px 20px !important;
      }

      .navbar-brand {
        font-size: 18px !important;
      }

      .navbar-menu {
        display: none !important;
      }

      .navbar-menu.mobile-open {
        display: flex !important;
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        flex-direction: column;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        padding: 20px;
        gap: 16px;
        border-bottom: 1px solid #E5E7EB;
      }

      .navbar-menu.mobile-open a {
        padding: 12px 16px;
        display: block;
        width: 100%;
      }

      .hamburger-menu {
        display: flex !important;
      }

      .hero-section {
        padding: 40px 20px 60px !important;
      }

      .hero-title {
        font-size: 36px !important;
      }

      .hero-subtitle {
        font-size: 28px !important;
      }

      .feature-grid {
        grid-template-columns: 1fr !important;
      }

      .stats-section {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 24px !important;
        padding: 32px 20px !important;
      }

      .about-section {
        padding: 40px 20px !important;
        gap: 40px !important;
      }

      .how-it-works-section {
        padding: 40px 20px !important;
      }

      .how-it-works-grid {
        grid-template-columns: 1fr !important;
      }

      .cta-section {
        padding: 40px 20px !important;
      }

      .cta-title {
        font-size: 28px !important;
      }

      .footer {
        padding: 30px 20px !important;
      }

      .right-visual {
        height: 300px !important;
      }

      .floating-stat-circle {
        width: 280px !important;
        height: 280px !important;
        font-size: 120px !important;
      }

      .pulse-ring-element {
        width: 280px !important;
        height: 280px !important;
      }
    }

    @media (max-width: 480px) {
      .navbar-container {
        padding: 10px 16px !important;
      }

      .navbar-brand {
        font-size: 16px !important;
      }

      .hero-title {
        font-size: 24px !important;
      }

      .hero-subtitle {
        font-size: 20px !important;
      }

      .feature-card {
        padding: 20px !important;
      }

      .stats-section {
        grid-template-columns: 1fr !important;
      }

      .about-content h2 {
        font-size: 28px !important;
      }

      .how-it-works-section {
        padding: 30px 16px !important;
      }

      .cta-title {
        font-size: 22px !important;
      }

      .step-card {
        padding: 20px !important;
      }
    }
  `;

  return (
    <div
      style={{
        width: "100%",
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        backgroundColor: "#fff",
      }}
    >
      <style>{styles}</style>

      {/* ===== NAVBAR (Sticky) ===== */}
      <nav
        className="navbar-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 60px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          borderBottom: "1px solid rgba(229, 231, 235, 0.5)",
        }}
      >
        <div
          className="navbar-brand"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 24,
            fontWeight: 800,
            color: "#16A34A",
            cursor: "pointer",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img 
            src={logo} 
            alt="POSCO Logo"
            style={{
              width: 40,
              height: 40,
              objectFit: "contain",
            }}
          />
          <span>POSCO</span>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-menu" style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {[
            { label: "Beranda", id: "beranda" },
            { label: "Tentang Kami", id: "tentang-kami" },
            { label: "Cara Kerja", id: "cara-kerja" },
          ].map((link, idx) => (
            <a
              key={idx}
              href={`#${link.id}`}
              style={{
                color: "#6B7280",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.color = "#16A34A")}
              onMouseOut={(e) => (e.target.style.color = "#6B7280")}
            >
              {link.label}
            </a>
          ))}

          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
              color: "#fff",
              border: "none",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 20px rgba(22, 163, 74, 0.25)",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "linear-gradient(135deg, #15803D 0%, #166534 100%)";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 12px 28px rgba(22, 163, 74, 0.35)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "linear-gradient(135deg, #16A34A 0%, #15803D 100%)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.25)";
            }}
          >
            Masuk / Daftar
          </button>
        </div>

        {/* Hamburger Menu Button */}
        <button
          className="hamburger-menu"
          style={{
            display: "none",
            background: "none",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            color: "#111827",
            padding: "4px 8px",
            flexDirection: "column",
            gap: "4px",
          }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div style={{ width: 24, height: 2, background: "#111827", borderRadius: 1 }} />
          <div style={{ width: 24, height: 2, background: "#111827", borderRadius: 1 }} />
          <div style={{ width: 24, height: 2, background: "#111827", borderRadius: 1 }} />
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="navbar-menu mobile-open"
            style={{
              display: "flex",
              position: "fixed",
              top: 60,
              left: 0,
              right: 0,
              flexDirection: "column",
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(10px)",
              padding: "20px",
              gap: "16px",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            {[
              { label: "Beranda", id: "beranda" },
              { label: "Tentang Kami", id: "tentang-kami" },
              { label: "Cara Kerja", id: "cara-kerja" },
            ].map((link, idx) => (
              <a
                key={idx}
                href={`#${link.id}`}
                style={{
                  color: "#6B7280",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  padding: "12px 16px",
                  display: "block",
                  width: "100%",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => (e.target.style.color = "#16A34A")}
                onMouseOut={(e) => (e.target.style.color = "#6B7280")}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
              style={{
                padding: "10px 28px",
                borderRadius: 8,
                background: "#16A34A",
                color: "#fff",
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s ease",
                width: "100%",
                marginTop: "8px",
              }}
            >
              Masuk / Daftar
            </button>
          </div>
        )}
      </nav>

      {/* ===== SECTION 1: HERO ===== */}
      <section
        id="beranda"
        className="hero-section"
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #F0F9F4 0%, #E8F5E9 50%, #FFFFFF 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 60px 80px",
          textAlign: "left",
          scrollMarginTop: "80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(22, 163, 74, 0.05)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-50px",
            left: "-50px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(22, 163, 74, 0.08)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1400,
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Left Content */}
          <div>
            <div
              className="hero-title"
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#16A34A",
                letterSpacing: "1.5px",
                marginBottom: 20,
                textTransform: "uppercase",
                display: "inline-block",
                background: "#D1FAE5",
                padding: "8px 16px",
                borderRadius: 24,
              }}
            >
              ✨ POSYANDU CONNECTION
            </div>

            <h1
              className="hero-subtitle"
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: "#111827",
                marginBottom: 24,
                lineHeight: 1.2,
              }}
            >
              Pantau Gizi & Tumbuh Kembang Anak dengan{" "}
              <span style={{ color: "#16A34A" }}>Teknologi Real-Time</span>
            </h1>

            <p
              className="hero-description"
              style={{
                fontSize: 16,
                color: "#6B7280",
                marginBottom: 40,
                lineHeight: 1.8,
              }}
            >
              Platform digital terpadu yang menghubungkan Kader Posyandu, Orang Tua, dan Admin untuk memantau kesehatan ibu dan balita secara akurat dan efisien di Kota Padang.
            </p>

            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <button
                onClick={() => navigate("/register")}
                style={{
                  padding: "14px 40px",
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                  color: "#fff",
                  border: "none",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.3s ease",
                  boxShadow: "0 10px 30px rgba(22, 163, 74, 0.3)",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow = "0 15px 40px rgba(22, 163, 74, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 10px 30px rgba(22, 163, 74, 0.3)";
                }}
              >
                🚀 Mulai Gratis Sekarang
              </button>
              <button
                onClick={() => document.getElementById('cara-kerja').scrollIntoView({ behavior: 'smooth' })}
                style={{
                  padding: "14px 40px",
                  borderRadius: 8,
                  background: "rgba(22, 163, 74, 0.1)",
                  color: "#16A34A",
                  border: "2px solid #16A34A",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "rgba(22, 163, 74, 0.2)";
                  e.target.style.transform = "translateY(-3px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "rgba(22, 163, 74, 0.1)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Pelajari Cara Kerja
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <img
              src={heroImage}
              alt="Hero Illustration"
              className="hero-subtitle"
              style={{
                width: "100%",
                maxWidth: "500px",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* Feature Cards Below */}
        <div
          style={{
            marginTop: 100,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 28,
            width: "100%",
            maxWidth: 1400,
          }}
        >
          {[
            {
              icon: "🏥",
              title: "Akses Warga",
              desc: "Pantau riwayat imunisasi dan grafik KMS anak secara mandiri",
              color: "#3B82F6",
              bgColor: "rgba(59, 130, 246, 0.1)",
              accentColor: "#2563EB",
            },
            {
              icon: "👥",
              title: "Efisiensi Kader",
              desc: "Input data cepat dengan sistem diagnosis otomatis Kemenkes",
              color: "#F59E0B",
              bgColor: "rgba(245, 158, 11, 0.1)",
              accentColor: "#DC2626",
            },
            {
              icon: "📊",
              title: "Analitik Admin",
              desc: "Visualisasi data stunting untuk pengambilan kebijakan tepat",
              color: "#8B5CF6",
              bgColor: "rgba(139, 92, 246, 0.1)",
              accentColor: "#7C3AED",
            },
          ].map((feature, idx) => (
            <div
              key={feature.title}
              className={`feature-card feature-${idx + 1}`}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: 0,
                border: `2px solid ${feature.color}15`,
                textAlign: "center",
                transition: "all 0.3s ease",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                height: "420px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-16px)";
                e.currentTarget.style.boxShadow = `0 30px 60px rgba(0, 0, 0, 0.15)`;
                e.currentTarget.style.borderColor = feature.color;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.borderColor = `${feature.color}15`;
              }}
            >
              {/* Image Section - Top Part */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "220px",
                  overflow: "hidden",
                  borderRadius: "18px 18px 0 0",
                  backgroundImage: `url(${bahanImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay with gradient */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(135deg, ${feature.color}70 0%, ${feature.accentColor}70 100%)`,
                    mixBlendMode: "overlay",
                  }}
                />
                
                {/* Color accent background */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(135deg, ${feature.bgColor} 0%, rgba(255,255,255,0.3) 100%)`,
                  }}
                />

                {/* Icon */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 80,
                    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
                  }}
                >
                  {feature.icon}
                </div>

                {/* Top border accent */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "5px",
                    background: `linear-gradient(90deg, ${feature.color}, ${feature.accentColor})`,
                  }}
                />
              </div>

              {/* Content Section - Bottom Part */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "32px 24px",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: feature.color,
                    marginBottom: 12,
                    letterSpacing: "-0.3px",
                  }}
                >
                  {feature.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                    lineHeight: 1.7,
                    fontWeight: 500,
                  }}
                >
                  {feature.desc}
                </div>

                {/* Bottom accent bar */}
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: "16px",
                    borderTop: `2px solid ${feature.color}15`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: feature.color,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginTop: "12px",
                    }}
                  >
                    Pelajari Lebih Lanjut →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 2: STATS STRIP ===== */}
      <section
        className="stats-section"
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #16A34A 0%, #15803D 50%, #128C3D 100%)",
          color: "#fff",
          padding: "60px 60px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 40,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            pointerEvents: "none",
          }}
        />

        {[
          { number: "1.200+", label: "Balita Terdaftar", icon: "👶" },
          { number: "48", label: "Posyandu Aktif", icon: "🏥" },
          { number: "320+", label: "Kader Terlatih", icon: "👩‍⚕️" },
          { number: "11", label: "Kecamatan", icon: "📍" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="animate-up"
            style={{
              position: "relative",
              zIndex: 1,
            }}
            ref={(el) => {
              if (el && animatedElements.has(el)) {
                el.classList.add("visible");
              }
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>{stat.icon}</div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                marginBottom: 8,
              }}
            >
              {stat.number}
            </div>
            <div style={{ fontSize: 14, opacity: 0.9, fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* ===== SECTION 3: ABOUT ===== */}
      <section
        id="tentang-kami"
        className="about-section"
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #F0F9F4 0%, #E0F7EE 100%)",
          display: "flex",
          alignItems: "center",
          padding: "80px 60px",
          scrollMarginTop: "80px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Decorative elements */}
        <div style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(22, 163, 74, 0.08)",
        }} />
        <div style={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(22, 163, 74, 0.05)",
        }} />

        <div
          className="about-grid"
          style={{
            maxWidth: 1400,
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 100,
            alignItems: "center",
            position: "relative",
            zIndex: 2
          }}
        >
          {/* Left Content */}
          <div
            className="animate-left"
            ref={(el) => {
              if (el && animatedElements.has(el)) {
                el.classList.add("visible");
              }
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#16A34A",
                letterSpacing: "2px",
                marginBottom: 20,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <span style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#16A34A"
              }} />
              TENTANG KAMI
            </div>

            <h2
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: "#111827",
                marginBottom: 24,
                lineHeight: 1.2,
                letterSpacing: "-0.5px"
              }}
            >
              Misi Kami: <span style={{ color: "#16A34A" }}>Kesehatan Optimal</span> untuk Setiap Anak
            </h2>

            <p
              style={{
                fontSize: 16,
                color: "#6B7280",
                marginBottom: 40,
                lineHeight: 1.8,
              }}
            >
              POSCO (Posyandu Connection) adalah solusi teknologi terpadu yang menghubungkan Kader Posyandu, Tenaga Kesehatan, dan Orang Tua dalam ekosistem pemantauan kesehatan anak. Kami berkomitmen untuk menurunkan angka stunting dan malnutrisi di Kota Padang melalui digitalisasi dan kolaborasi yang lebih baik.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>
              {[
                { number: "2500+", label: "Balita Terpantau" },
                { number: "150+", label: "Posyandu Aktif" },
                { number: "500+", label: "Kader Terlatih" },
                { number: "99%", label: "Data Akurat" }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                    padding: 20,
                    borderRadius: 12,
                    border: "1px solid rgba(22, 163, 74, 0.2)",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(22, 163, 74, 0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#16A34A",
                    marginBottom: 4
                  }}>
                    {stat.number}
                  </div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#6B7280"
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { title: "Data Terintegrasi", desc: "Sinkronisasi real-time antara semua stakeholder" },
                { title: "Akurasi Tinggi", desc: "Algoritma cerdas untuk deteksi dini masalah gizi" },
                { title: "Mudah Digunakan", desc: "Interface intuitif untuk semua kalangan" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "linear-gradient(135deg, #16A34A, #15803D)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#111827",
                        marginBottom: 2
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "#6B7280"
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div
            className="animate-right"
            ref={(el) => {
              if (el && animatedElements.has(el)) {
                el.classList.add("visible");
              }
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: "100%",
              height: 700,
            }}
          >
            {/* Pulse Rings - Concentric circles */}
            {[1, 2, 3].map((ring) => (
              <div
                key={ring}
                className={`pulse-ring pulse-ring-element pulse-ring-${ring}`}
                style={{
                  position: "absolute",
                  width: 320 + ring * 70,
                  height: 320 + ring * 70,
                  borderRadius: "50%",
                  border: `2px solid #16A34A`,
                  opacity: 0.18 - (ring * 0.04),
                  top: "30%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  animation: `pulse-ring 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                  animationDelay: `${(ring - 1) * 0.5}s`,
                }}
              />
            ))}

            {/* Main Circle with Heart */}
            <div
              className="floating-stat floating-stat-circle floating-stat-1"
              style={{
                width: 320,
                height: 320,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 160,
                color: "#fff",
                position: "absolute",
                top: "30%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
                boxShadow: "0 40px 80px rgba(22, 163, 74, 0.4), inset 0 -20px 40px rgba(0, 0, 0, 0.1)",
              }}
            >
              ❤️
            </div>

            {/* Label Below Heart */}
            <div
              style={{
                textAlign: "center",
                position: "absolute",
                bottom: 60,
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                zIndex: 5,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#16A34A",
                  letterSpacing: 0.8,
                  whiteSpace: "nowrap",
                  textTransform: "uppercase",
                  fontStyle: "italic"
                }}
              >
                Kesehatan Anak Adalah Prioritas Kami
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: HOW IT WORKS ===== */}
      <section
        id="cara-kerja"
        className="how-it-works-section"
        style={{
          width: "100%",
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 60px",
          scrollMarginTop: "80px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Background elements */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 400,
          background: "linear-gradient(180deg, #F0F9F4 0%, transparent 100%)",
          zIndex: 0
        }} />

        <div
          style={{
            maxWidth: 1400,
            width: "100%",
            textAlign: "center",
            position: "relative",
            zIndex: 1
          }}
        >
          {/* Header */}
          <div
            className="animate-hidden"
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#16A34A",
              letterSpacing: "2.5px",
              marginBottom: 24,
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
            ref={(el) => {
              if (el && animatedElements.has(el)) {
                el.classList.add("visible");
              }
            }}
          >
            <span style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#16A34A"
            }} />
            CARA KERJA SISTEM
          </div>

          <h2
            className="animate-hidden"
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#111827",
              marginBottom: 20,
              lineHeight: 1.2,
              opacity: 0,
              letterSpacing: "-0.5px"
            }}
            ref={(el) => {
              if (el && animatedElements.has(el)) {
                el.classList.add("visible");
              }
            }}
          >
            Alur Sederhana untuk <span style={{ color: "#16A34A" }}>Pemantauan Optimal</span>
          </h2>

          <p
            className="animate-hidden"
            style={{
              fontSize: 16,
              color: "#6B7280",
              marginBottom: 64,
              lineHeight: 1.7,
              opacity: 0,
              maxWidth: 700,
              margin: "0 auto 64px"
            }}
            ref={(el) => {
              if (el && animatedElements.has(el)) {
                el.classList.add("visible");
              }
            }}
          >
            Proses yang mudah, cepat, dan akurat untuk memastikan setiap anak mendapat perhatian kesehatan yang optimal.
          </p>

          <div
            className="how-it-works-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 32,
              position: "relative"
            }}
          >
            {/* Connecting Line */}
            <div style={{
              position: "absolute",
              top: "60px",
              left: "calc(12.5% - 16px)",
              right: "calc(12.5% - 16px)",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #16A34A, transparent)",
              zIndex: 0
            }} />

            {[
              {
                num: "01",
                icon: "📱",
                title: "Daftar Akun",
                desc: "Buat akun sebagai Orang Tua atau Kader Posyandu dengan data yang akurat",
                color: "#EFF6FF",
                borderColor: "#BFDBFE"
              },
              {
                num: "02",
                icon: "📅",
                title: "Jadwalkan Kunjungan",
                desc: "Pilih jadwal rutin Posyandu terdekat untuk pengukuran BB dan TB",
                color: "#F0FDF4",
                borderColor: "#DCFCE7"
              },
              {
                num: "03",
                icon: "⚡",
                title: "Input & Analisis",
                desc: "Kader menginput data kesehatan, sistem otomatis menghitung status gizi",
                color: "#FFFBEB",
                borderColor: "#FCD34D"
              },
              {
                num: "04",
                icon: "📊",
                title: "Lihat Hasil",
                desc: "Akses laporan lengkap dengan grafik KMS dan rekomendasi kesehatan",
                color: "#FEF2F2",
                borderColor: "#FCA5A5"
              },
            ].map((step, idx) => (
              <div
                key={step.num}
                className={`step-card step-${idx}`}
                style={{
                  background: step.color,
                  borderRadius: 16,
                  padding: 32,
                  border: `2px solid ${step.borderColor}`,
                  position: "relative",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-12px)";
                  e.currentTarget.style.boxShadow = "0 24px 48px rgba(22, 163, 74, 0.12)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Number Circle */}
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 56,
                    height: 56,
                    background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                    color: "#fff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 20,
                    boxShadow: "0 8px 16px rgba(22, 163, 74, 0.2)",
                    border: "3px solid white"
                  }}
                >
                  {step.num}
                </div>

                {/* Icon */}
                <div style={{ fontSize: 48, marginTop: 24, marginBottom: 20 }}>
                  {step.icon}
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: 12,
                  margin: "0 0 12px 0"
                }}>
                  {step.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: 14,
                  color: "#6B7280",
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {step.desc}
                </p>

                {/* Arrow */}
                {idx < 3 && (
                  <div style={{
                    position: "absolute",
                    right: -40,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 24,
                    color: "#16A34A",
                    fontWeight: 800
                  }}>
                    →
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{
            marginTop: 64,
            padding: 40,
            borderRadius: 16,
            background: "linear-gradient(135deg, #F0F9F4 0%, #E0F7EE 100%)",
            border: "2px solid #DCFCE7",
            textAlign: "center"
          }}>
            <h3 style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#111827",
              marginBottom: 12
            }}>
              Siap untuk Memulai?
            </h3>
            <p style={{
              fontSize: 15,
              color: "#6B7280",
              marginBottom: 24
            }}>
              Bergabunglah dengan ribuan Orang Tua dan Kader Posyandu yang telah mempercayai POSCO
            </p>
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "14px 32px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                color: "#fff",
                border: "none",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 12px 24px rgba(22, 163, 74, 0.2)"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 16px 32px rgba(22, 163, 74, 0.3)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 12px 24px rgba(22, 163, 74, 0.2)";
              }}
            >
              Daftar Sekarang →
            </button>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: CTA ===== */}
      <section
        className="cta-section"
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
          color: "#fff",
          padding: "60px 60px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2
            className="cta-title animate-hidden"
            style={{
              fontSize: 42,
              fontWeight: 800,
              marginBottom: 20,
              opacity: 0,
            }}
            ref={(el) => {
              if (el && animatedElements.has(el)) {
                el.classList.add("visible");
              }
            }}
          >
            Siap Mulai Memantau?
          </h2>

          <p
            className="animate-hidden"
            style={{
              fontSize: 16,
              opacity: 0.95,
              marginBottom: 32,
            }}
            ref={(el) => {
              if (el && animatedElements.has(el)) {
                el.classList.add("visible");
              }
            }}
          >
            Bergabunglah dengan ribuan keluarga dan kader yang telah mempercayai POSCO untuk memantau kesehatan anak-anak mereka.
          </p>

          <button
            className="animate-hidden"
            onClick={() => navigate("/register")}
            style={{
              padding: "14px 40px",
              borderRadius: 8,
              background: "#fff",
              color: "#16A34A",
              border: "none",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s ease",
              opacity: 0,
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
            ref={(el) => {
              if (el && animatedElements.has(el)) {
                el.classList.add("visible");
              }
            }}
          >
            Mulai Gratis →
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        className="footer"
        style={{
          background: "#111827",
          color: "#fff",
          padding: "50px 60px",
          textAlign: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            fontSize: 20,
            fontWeight: 800,
            marginBottom: 16,
            color: "#16A34A",
          }}
        >
          <img 
            src={logo} 
            alt="POSCO Logo"
            style={{
              width: 36,
              height: 36,
              objectFit: "contain",
            }}
          />
          <span>POSCO</span>
        </div>

        <p
          style={{
            fontSize: 14,
            color: "#9CA3AF",
            margin: "0 0 24px 0",
            lineHeight: 1.6,
          }}
        >
          © 2026 POSCO - Sistem Informasi Pemantauan Ibu & Balita Terintegrasi Kota Padang
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            flexWrap: "wrap",
          }}
        >
          {["Email", "Telepon", "Instagram"].map((link, idx) => (
            <a
              key={idx}
              href="#"
              style={{
                color: "#9CA3AF",
                textDecoration: "none",
                fontSize: 13,
                transition: "color 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.color = "#16A34A")}
              onMouseOut={(e) => (e.target.style.color = "#9CA3AF")}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}