import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import logo from "../assets/POSCO_LOGO_KITA.png";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { success, error: errorNotify } = useNotification();
  const [role, setRole] = useState("orangtua");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    nik: "",
    phone: "",
    wilayah: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.nik) {
      const msg = "Semua field harus diisi";
      setError(msg);
      errorNotify("⚠️ " + msg);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      const msg = "Email tidak valid";
      setError(msg);
      errorNotify("⚠️ " + msg);
      return;
    }

    // NIK validation (harus 16 digit untuk Indonesia)
    const nikRegex = /^\d{16}$/;
    if (!nikRegex.test(formData.nik)) {
      const msg = "NIK harus 16 digit angka";
      setError(msg);
      errorNotify("⚠️ " + msg);
      return;
    }

    // Phone validation (optional tapi jika ada harus valid)
    if (formData.phone) {
      const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
      if (!phoneRegex.test(formData.phone)) {
        const msg = "Nomor telepon tidak valid (format: +62xxx atau 08xxx)";
        setError(msg);
        errorNotify("⚠️ " + msg);
        return;
      }
    }

    // Password strength validation
    if (formData.password.length < 8) {
      const msg = "Kata sandi minimal 8 karakter";
      setError(msg);
      errorNotify("⚠️ " + msg);
      return;
    }

    // Check password strength
    const hasUppercase = /[A-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    if (!hasUppercase || !hasNumber) {
      const msg = "Kata sandi harus mengandung huruf besar dan angka";
      setError(msg);
      errorNotify("⚠️ " + msg);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const msg = "Kata sandi tidak cocok";
      setError(msg);
      errorNotify("⚠️ " + msg);
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role,
      nik: formData.nik,
      phone: formData.phone,
      wilayah: formData.wilayah
    };

    register(userData);
    success("✓ Pendaftaran berhasil! Silakan login");
    setTimeout(() => {
      navigate("/dashboard");
    }, 500);
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
          onClick={() => navigate("/login")}
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
          ← Ke Halaman Login
        </button>
      </nav>

      {/* Register Content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        overflow: "auto",
      }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        width: "100%",
        height: "100%",
        maxWidth: 500,
        padding: 40,
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        margin: "auto"
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginBottom: 12,
          }}>
            <img 
              src={logo} 
              alt="POSCO Logo"
              style={{
                width: 40,
                height: 40,
                objectFit: "contain",
              }}
            />
            <div style={{ fontSize: 24, fontWeight: 800, color: "#16A34A" }}>POSCO</div>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Buat Akun Baru</h1>
          <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>Lengkapi data Anda untuk mendaftarkan akses ke sistem</p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[
            { key: "kader", label: "Kader Posyandu" },
            { key: "orangtua", label: "Orang Tua / Balita" }
          ].map(r => (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 8,
                border: role === r.key ? "2px solid #16A34A" : "1.5px solid #E5E7EB",
                background: role === r.key ? "#F0FDF4" : "#fff",
                color: role === r.key ? "#16A34A" : "#6B7280",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                transition: "all 0.15s"
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleRegister}>
          {/* Nama Lengkap */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              NAMA LENGKAP
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1.5px solid #E5E7EB",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
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

          {/* NIK */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              NIK (16 DIGIT)
            </label>
            <input
              type="text"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              placeholder="16 digit NIK"
              maxLength="16"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1.5px solid #E5E7EB",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
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

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1.5px solid #E5E7EB",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
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

          {/* Nomor Telepon */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              NOMOR TELEPON (OPSIONAL)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+62 812 3456 7890"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1.5px solid #E5E7EB",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
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

          {/* Kata Sandi */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              KATA SANDI
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 8 karakter"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1.5px solid #E5E7EB",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
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

          {/* Konfirmasi Kata Sandi */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              KONFIRMASI KATA SANDI
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Ketik ulang kata sandi"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1.5px solid #E5E7EB",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
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

          {/* Error Message */}
          {error && (
            <div style={{
              background: "#FEF2F2",
              border: "1px solid #FCA5A5",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 16,
              color: "#DC2626",
              fontSize: 13
            }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 10,
              background: loading ? "#D1D5DB" : "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
              color: "#fff",
              border: "none",
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s ease",
              fontFamily: "inherit",
              marginBottom: 12,
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
            {loading ? "Mendaftarkan..." : "DAFTAR AKUN"}
          </button>

          {/* Login Link */}
          <p style={{ textAlign: "center", fontSize: 13, color: "#6B7280", margin: 0 }}>
            Sudah punya akun?{" "}
            <a href="/login" style={{ color: "#16A34A", fontWeight: 600, textDecoration: "none" }}>
              Masuk di sini
            </a>
          </p>
        </form>
      </div>
      </div>
    </div>
  );
}
