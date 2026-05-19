import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { posyandus, children, ibuHamil } from "../data/dummyData";
import logo from "../assets/POSCO_LOGO_KITA.png";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleLabel = (role) => {
    const labels = { admin: "Admin", kader: "Kader Posyandu", orangtua: "Orang Tua" };
    return labels[role] || role;
  };

  const renderStatsGrid = () => {
    if (user?.role === "admin") {
      return [
        { label: "Total Posyandu", value: posyandus.length, icon: "🏥", trend: "+5 bln ini" },
        { label: "Total Balita", value: children.length, icon: "👶", trend: "+3 bln ini" },
        { label: "Ibu Hamil", value: ibuHamil.length, icon: "🤰", trend: "+2 bln ini" },
        { label: "Risiko Tinggi", value: ibuHamil.filter(i => i.risikoTinggi).length, icon: "⚠️", trend: "-1 bln ini" }
      ];
    } else if (user?.role === "kader") {
      return [
        { label: "Total Balita", value: children.length, icon: "👶", trend: "+3 bln ini" },
        { label: "Ibu Hamil", value: ibuHamil.length, icon: "🤰", trend: "+2 bln ini" },
        { label: "Stunting", value: children.filter(c => c.statusStunting === "Stunting").length, icon: "📊", trend: "0 bln ini" },
        { label: "Gizi Kurang", value: children.filter(c => c.statusGizi === "Gizi Kurang").length, icon: "⚠️", trend: "-1 bln ini" }
      ];
    }
    return [];
  };

  const stats = renderStatsGrid();

  return (
    <div style={{
      width: "100vw",
      minHeight: "100vh",
      background: "var(--bg-overlay)",
      fontFamily: "var(--font-sans)",
      display: "flex",
      flexDirection: "column",
      margin: 0,
      padding: 0
    }}>
      {/* Premium Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.98) 100%)",
        borderBottom: "1px solid var(--border-base)",
        padding: "1.5rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "var(--shadow-xs)",
        backdropFilter: "blur(10px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img 
            src={logo} 
            alt="POSCO Logo"
            style={{
              width: "2.25rem",
              height: "2.25rem",
              objectFit: "contain",
              borderRadius: "0.5rem",
              background: "var(--primary-50)"
            }}
          />
          <div>
            <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--primary)" }}>POSCO</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "500" }}>Sistem Informasi Terintegrasi</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-primary)" }}>{user?.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "500" }}>{getRoleLabel(user?.role)}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "var(--radius-lg)",
              background: "#FEE2E2",
              color: "var(--error)",
              border: "1px solid #FCA5A5",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              transition: "all var(--duration-200) ease",
              boxShadow: "var(--shadow-xs)"
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#FEF2F2";
              e.target.style.borderColor = "#F87171";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "var(--shadow-md)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#FEE2E2";
              e.target.style.borderColor = "#FCA5A5";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "var(--shadow-xs)";
            }}
          >
            Keluar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "2rem", flex: 1, overflow: "auto" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Welcome Section */}
          <div style={{
            background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-600) 100%)",
            borderRadius: "var(--radius-2xl)",
            padding: "2rem",
            color: "white",
            marginBottom: "2rem",
            boxShadow: "var(--shadow-lg)"
          }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 0.5rem", lineHeight: "1.2" }}>
              Selamat Datang, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ fontSize: "0.9rem", margin: 0, opacity: 0.9 }}>
              {user?.wilayah && `Wilayah: ${user.wilayah}`}
              {user?.posyandu && ` | Posyandu: ${user.posyandu}`}
            </p>
          </div>

          {/* Stats Grid */}
          {stats.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem"
            }}>
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--bg-base)",
                    borderRadius: "var(--radius-xl)",
                    padding: "1.5rem",
                    border: "1px solid var(--border-base)",
                    boxShadow: "var(--shadow-xs)",
                    transition: "all var(--duration-300) ease",
                    cursor: "pointer"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "var(--primary)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-xs)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "var(--border-base)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div style={{ fontSize: "2rem" }}>{stat.icon}</div>
                    <span style={{ fontSize: "0.75rem", color: "var(--success)", fontWeight: "600", background: "#F0FDF4", padding: "0.25rem 0.5rem", borderRadius: "0.375rem" }}>
                      {stat.trend}
                    </span>
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: "600" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Card */}
          {user?.role === "orangtua" && (
            <div style={{
              background: "var(--bg-base)",
              borderRadius: "var(--radius-xl)",
              padding: "1.5rem",
              border: "1px solid var(--border-base)",
              marginBottom: "2rem",
              boxShadow: "var(--shadow-xs)"
            }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: "700", margin: "0 0 1rem", color: "var(--text-primary)" }}>
                📋 Informasi Akun Anda
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem"
              }}>
                <div style={{ padding: "1rem", background: "var(--bg-overlay)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.5rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Nama</div>
                  <div style={{ fontSize: "1rem", fontWeight: "600", color: "var(--text-primary)" }}>{user?.name}</div>
                </div>
                <div style={{ padding: "1rem", background: "var(--bg-overlay)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.5rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</div>
                  <div style={{ fontSize: "1rem", fontWeight: "600", color: "var(--text-primary)" }}>{user?.email}</div>
                </div>
                <div style={{ padding: "1rem", background: "var(--bg-overlay)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.5rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Wilayah</div>
                  <div style={{ fontSize: "1rem", fontWeight: "600", color: "var(--text-primary)" }}>{user?.wilayah}</div>
                </div>
              </div>
            </div>
          )}

          {/* Alert Box */}
          <div style={{
            background: "linear-gradient(135deg, rgba(254, 243, 199, 0.5) 0%, rgba(254, 249, 231, 0.5) 100%)",
            border: "1px solid #FCD34D",
            borderRadius: "var(--radius-lg)",
            padding: "1rem",
            display: "flex",
            gap: "1rem",
            alignItems: "flex-start",
            boxShadow: "var(--shadow-xs)"
          }}>
            <div style={{ fontSize: "1.5rem", minWidth: "1.5rem", textAlign: "center" }}>ℹ️</div>
            <div>
              <div style={{ fontWeight: "700", color: "#92400E", fontSize: "0.95rem" }}>Informasi Penting</div>
              <p style={{ fontSize: "0.875rem", color: "#92400E", margin: "0.5rem 0 0", lineHeight: "1.5" }}>
                Sistem POSCO terus dikembangkan dengan fitur-fitur terbaru untuk meningkatkan pengalaman Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
