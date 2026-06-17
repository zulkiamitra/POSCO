import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import logo from "../assets/POSCO_LOGO_KITA.png";

// Dummy data untuk email registered
const registeredEmails = [
  "admin@posco.id",
  "kader@posco.id",
  "orangtua@posco.id",
  "dinas.kesehatan@padang.go.id",
];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { success: successNotify, error: errorNotify, info: infoNotify } = useNotification();
  const [step, setStep] = useState(1); // 1: email, 2: verification, 3: reset password
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));

    // Check if email is registered
    if (registeredEmails.includes(email.toLowerCase())) {
      const msg = `✓ Kode verifikasi telah dikirim ke ${email}`;
      setSuccess(msg);
      infoNotify(msg);
      setStep(2);
    } else {
      const msg = "⚠️ Email tidak terdaftar dalam sistem kami";
      setError(msg);
      errorNotify(msg);
    }
    setLoading(false);
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));

    // Dummy verification code
    if (verificationCode === "123456") {
      setSuccess("Kode verifikasi benar! Silakan buat password baru.");
      setStep(3);
    } else {
      setError("Kode verifikasi salah. Coba lagi.");
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));

    setSuccess("Password berhasil direset! Silakan login dengan password baru.");
    setTimeout(() => {
      navigate("/login");
    }, 2000);

    setLoading(false);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#F0F9F4",
        fontFamily: "'Inter', sans-serif",
        padding: 0,
        margin: 0,
        overflow: "hidden",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 40px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(229, 231, 235, 0.5)",
          zIndex: 100,
        }}
      >
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

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 6,
              background: "transparent",
              border: "1.5px solid #E5E7EB",
              color: "#6B7280",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontFamily: "inherit",
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = "#16A34A";
              e.target.style.color = "#16A34A";
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = "#E5E7EB";
              e.target.style.color = "#6B7280";
            }}
          >
            ← Kembali ke Login
          </button>
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
            🏠 Beranda
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          overflow: "auto",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            maxWidth: 500,
            width: "100%",
            padding: 48,
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M12 1v6m0 6v6" />
                <path d="M4.22 4.22l4.24 4.24m2.12 2.12l4.24 4.24" />
                <path d="M19.78 4.22l-4.24 4.24m-2.12 2.12l-4.24 4.24" />
              </svg>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: 0 }}>
              Pulihkan Akun
            </h1>
            <p style={{ color: "#6B7280", fontSize: 14, margin: "8px 0 0" }}>
              {step === 1 && "Masukkan email untuk menerima kode verifikasi"}
              {step === 2 && "Masukkan kode verifikasi yang telah dikirim"}
              {step === 3 && "Buat password baru yang kuat"}
            </p>
          </div>

          {/* Step Indicator */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 32,
              justifyContent: "center",
            }}
          >
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  background: s <= step ? "#16A34A" : "#E5E7EB",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                EMAIL TERDAFTAR
              </label>
              <div style={{ position: "relative", marginBottom: 24 }}>
                <div
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    borderRadius: 10,
                    border: "1.5px solid #E5E7EB",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    color: "#111827",
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

              {error && (
                <div
                  style={{
                    background: "#FEF2F2",
                    border: "1px solid #FCA5A5",
                    borderRadius: 8,
                    padding: "10px 14px",
                    marginBottom: 16,
                    color: "#DC2626",
                    fontSize: 13,
                  }}
                >
                  {error}
                </div>
              )}
              {success && (
                <div
                  style={{
                    background: "#F0FDF4",
                    border: "1px solid #DCFCE7",
                    borderRadius: 8,
                    padding: "10px 14px",
                    marginBottom: 16,
                    color: "#166534",
                    fontSize: 13,
                  }}
                >
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: 10,
                  background:
                    loading || !email ? "#D1D5DB" : "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                  color: "#fff",
                  border: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: loading || !email ? "not-allowed" : "pointer",
                  opacity: loading || !email ? 0.7 : 1,
                  transition: "all 0.3s ease",
                  fontFamily: "inherit",
                  boxShadow: "0 8px 20px rgba(22, 163, 74, 0.25)",
                }}
                onMouseOver={(e) => {
                  if (!loading && email) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 28px rgba(22, 163, 74, 0.35)";
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.25)";
                }}
              >
                {loading ? "Mengirim..." : "Kirim Kode Verifikasi"}
              </button>
            </form>
          )}

          {/* Step 2: Verification */}
          {step === 2 && (
            <form onSubmit={handleVerificationSubmit}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                KODE VERIFIKASI
              </label>
              <div style={{ position: "relative", marginBottom: 24 }}>
                <div
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1v6m0 6v6" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="000000"
                  maxLength="6"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    borderRadius: 10,
                    border: "1.5px solid #E5E7EB",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    color: "#111827",
                    fontFamily: "inherit",
                    transition: "all 0.3s ease",
                    background: "#fff",
                    letterSpacing: 2,
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

              <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 16 }}>
                💡 <strong>Kode demo:</strong> 123456
              </p>

              {error && (
                <div
                  style={{
                    background: "#FEF2F2",
                    border: "1px solid #FCA5A5",
                    borderRadius: 8,
                    padding: "10px 14px",
                    marginBottom: 16,
                    color: "#DC2626",
                    fontSize: 13,
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !verificationCode}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: 10,
                  background:
                    loading || !verificationCode ? "#D1D5DB" : "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                  color: "#fff",
                  border: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: loading || !verificationCode ? "not-allowed" : "pointer",
                  opacity: loading || !verificationCode ? 0.7 : 1,
                  transition: "all 0.3s ease",
                  fontFamily: "inherit",
                  boxShadow: "0 8px 20px rgba(22, 163, 74, 0.25)",
                }}
                onMouseOver={(e) => {
                  if (!loading && verificationCode) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 28px rgba(22, 163, 74, 0.35)";
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.25)";
                }}
              >
                {loading ? "Memverifikasi..." : "Lanjutkan"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError("");
                  setSuccess("");
                }}
                style={{
                  width: "100%",
                  marginTop: 12,
                  padding: "10px",
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  background: "#fff",
                  color: "#6B7280",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Gunakan Email Lain
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                PASSWORD BARU
              </label>
              <div style={{ position: "relative", marginBottom: 16 }}>
                <div
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    borderRadius: 10,
                    border: "1.5px solid #E5E7EB",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    color: "#111827",
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

              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                KONFIRMASI PASSWORD
              </label>
              <div style={{ position: "relative", marginBottom: 24 }}>
                <div
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 40px",
                    borderRadius: 10,
                    border: "1.5px solid #E5E7EB",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    color: "#111827",
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

              {error && (
                <div
                  style={{
                    background: "#FEF2F2",
                    border: "1px solid #FCA5A5",
                    borderRadius: 8,
                    padding: "10px 14px",
                    marginBottom: 16,
                    color: "#DC2626",
                    fontSize: 13,
                  }}
                >
                  {error}
                </div>
              )}
              {success && (
                <div
                  style={{
                    background: "#F0FDF4",
                    border: "1px solid #DCFCE7",
                    borderRadius: 8,
                    padding: "10px 14px",
                    marginBottom: 16,
                    color: "#166534",
                    fontSize: 13,
                  }}
                >
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: 10,
                  background:
                    loading || !newPassword || !confirmPassword
                      ? "#D1D5DB"
                      : "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                  color: "#fff",
                  border: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: loading || !newPassword || !confirmPassword ? "not-allowed" : "pointer",
                  opacity: loading || !newPassword || !confirmPassword ? 0.7 : 1,
                  transition: "all 0.3s ease",
                  fontFamily: "inherit",
                  boxShadow: "0 8px 20px rgba(22, 163, 74, 0.25)",
                }}
                onMouseOver={(e) => {
                  if (!loading && newPassword && confirmPassword) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 28px rgba(22, 163, 74, 0.35)";
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.25)";
                }}
              >
                {loading ? "Menyimpan..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
