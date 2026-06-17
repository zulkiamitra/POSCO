import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/POSCO_LOGO_KITA.png";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 800));
    const ok = login("admin", email, password);
    if (ok) {
      navigate("/admin");
    } else {
      setError("ID atau kata sandi tidak valid");
    }
    setLoading(false);
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#F0F9F4",
      fontFamily: "'Inter', sans-serif",
      padding: 0,
      margin: 0,
      overflow: "hidden"
    }}>
      {/* Navbar */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 40px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(229, 231, 235, 0.5)",
        zIndex: 100,
      }}>
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            fontSize: 20,
            fontWeight: 800,
            color: "#16A34A",
          }}
        >
          <img 
            src={logo} 
            alt="POSCO Logo"
            style={{
              width: 32,
              height: 32,
              objectFit: "contain",
            }}
          />
          POSCO
        </div>
        
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 6,
            background: "rgba(22, 163, 74, 0.1)",
            border: "1px solid #D1FAE5",
            color: "#16A34A",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontFamily: "inherit",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "rgba(22, 163, 74, 0.15)";
            e.target.style.transform = "translateX(-2px)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "rgba(22, 163, 74, 0.1)";
            e.target.style.transform = "translateX(0)";
          }}
        >
          ← Kembali ke Beranda
        </button>
      </nav>

      {/* Login Content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        overflow: "auto",
      }}>
        <div style={{
          display: "flex", width: "100%", height: "100%", maxWidth: 860,
          borderRadius: 16, overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)"
        }}>
          {/* Left Panel */}
          <div style={{
            flex: "0 0 320px", background: "linear-gradient(160deg, #16A34A 0%, #15803D 50%, #14532D 100%)",
            padding: 40, display: "flex", flexDirection: "column", justifyContent: "space-between",
            position: "relative", overflow: "hidden"
          }}>
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ position: "absolute", bottom: -60, left: -20, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

            <div>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 24
              }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>POSCO</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 6, lineHeight: 1.5 }}>
                Sistem Informasi Pemantauan Ibu & Balita Terintegrasi Kota Padang
              </div>
            </div>

            <div>
              {["Admin Only", "Akses Terbatas", "Keamanan Tinggi"].map(tag => (
                <div key={tag} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>{tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div style={{ flex: 1, background: "#fff", padding: 48 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Masuk Admin</h1>
            <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 28px" }}>Silakan masukkan akun admin terdaftar Anda.</p>

            {/* Admin Badge */}
            <div style={{
              background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
              color: "#fff",
              padding: "12px 16px",
              borderRadius: 10,
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 600
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Halaman Login Admin
            </div>

            <form onSubmit={handleLogin}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>ID PENGGUNA / EMAIL</label>
              <div style={{ position: "relative", marginBottom: 16 }}>
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <input
                  type="text" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Masukkan ID admin"
                  style={{
                    width: "100%", padding: "12px 12px 12px 40px", borderRadius: 10,
                    border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none",
                    boxSizing: "border-box", color: "#111827",
                    fontFamily: "inherit",
                    transition: "all 0.3s ease",
                    background: "#fff",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#16A34A";
                    e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E5E7EB";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>KATA SANDI</label>
              <div style={{ position: "relative", marginBottom: 8 }}>
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%", padding: "12px 12px 12px 40px", borderRadius: 10,
                    border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none",
                    boxSizing: "border-box", fontFamily: "inherit",
                    transition: "all 0.3s ease",
                    background: "#fff",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#16A34A";
                    e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E5E7EB";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ textAlign: "right", marginBottom: 24 }}>
                <a 
                  onClick={() => navigate("/forgot-password")} 
                  style={{ 
                    fontSize: 13, 
                    color: "#16A34A", 
                    textDecoration: "none",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  Lupa Password?
                </a>
              </div>

              {error && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#DC2626", fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "13px", borderRadius: 10,
                background: loading ? "#D1D5DB" : "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                color: "#fff", border: "none",
                fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1, transition: "all 0.3s ease",
                fontFamily: "inherit",
                boxShadow: "0 8px 20px rgba(22, 163, 74, 0.25)",
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 28px rgba(22, 163, 74, 0.35)";
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.25)";
              }}
              >
                {loading ? "Memproses..." : "MASUK"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#6B7280" }}>
              Link login admin khusus untuk administrator sistem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
