import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/POSCO_LOGO_KITA.png";
import { children, ibuHamil, jadwalSesi, rujukan } from "../data/dummyData";

export default function KaderDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "data-warga", label: "Data Warga", icon: "👥" },
    { id: "jadwal", label: "Jadwal Sesi", icon: "📅" },
    { id: "buat-sesi", label: "Buat Sesi Baru", icon: "➕" },
    { id: "tindak-lanjut", label: "Tindak Lanjut", icon: "📋" },
    { id: "riwayat", label: "Riwayat Catatan", icon: "📖" },
  ];

  return (
    <div style={{
      width: "100vw",
      minHeight: "100vh",
      display: "flex",
      background: "#F3F4F6",
      fontFamily: "'Inter', sans-serif",
      margin: 0,
      padding: 0
    }}>
      {/* Sidebar */}
      <div style={{
        width: 280,
        background: "linear-gradient(180deg, #16A34A 0%, #15803D 100%)",
        color: "#fff",
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        overflow: "auto"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, cursor: "pointer" }}
          onClick={() => navigate("/")}>
          <img src={logo} alt="POSCO" style={{ width: 40, height: 40, objectFit: "contain" }} />
          <div style={{ fontSize: 20, fontWeight: 800 }}>POSCO</div>
        </div>

        {/* User Info */}
        <div style={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{user?.name}</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Kader Posyandu</div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 8 }}>📍 {user?.posyandu}</div>
        </div>

        {/* Menu Items */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                background: activePage === item.id ? "rgba(255,255,255,0.25)" : "transparent",
                border: activePage === item.id ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent",
                color: "#fff",
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                if (activePage !== item.id) {
                  e.target.style.background = "rgba(255,255,255,0.15)";
                }
              }}
              onMouseOut={(e) => {
                if (activePage !== item.id) {
                  e.target.style.background = "transparent";
                }
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "rgba(239, 68, 68, 0.3)";
            e.target.style.borderColor = "rgba(239, 68, 68, 0.5)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "rgba(255,255,255,0.15)";
            e.target.style.borderColor = "rgba(255,255,255,0.3)";
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "32px 40px" }}>
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32
          }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111827", margin: 0 }}>
                {menuItems.find(m => m.id === activePage)?.label}
              </h1>
              <p style={{ color: "#6B7280", margin: "4px 0 0", fontSize: 14 }}>
                Kelola data dan aktivitas posyandu Anda
              </p>
            </div>
            {["data-warga", "buat-sesi"].includes(activePage) && (
              <button
                onClick={() => setShowAddModal(activePage)}
                style={{
                  background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                  color: "#fff",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.35)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.25)";
                }}
              >
                + {activePage === "data-warga" ? "Tambah Data" : "Buat Sesi"}
              </button>
            )}
          </div>

          {/* Content Pages */}
          {activePage === "dashboard" && <DashboardPage user={user} />}
          {activePage === "data-warga" && <DataWargaPage setShowModal={setShowAddModal} />}
          {activePage === "jadwal" && <JadwalPage />}
          {activePage === "buat-sesi" && <BuatSesiPage setShowModal={setShowAddModal} />}
          {activePage === "tindak-lanjut" && <TindakLanjutPage />}
          {activePage === "riwayat" && <RiwayatPage />}
        </div>
      </div>

      {/* Modals */}
      {showAddModal === "data-warga" && (
        <AddDataModal onClose={() => setShowAddModal(null)} />
      )}
      {showAddModal === "buat-sesi" && (
        <BuatSesiModal onClose={() => setShowAddModal(null)} />
      )}
    </div>
  );
}

// ====== PAGES ======

function DashboardPage({ user }) {
  const myChildren = children.slice(0, 3);
  return (
    <div>
      {/* Welcome Card */}
      <div style={{
        background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
        borderRadius: 16,
        padding: 32,
        color: "#fff",
        marginBottom: 32,
        boxShadow: "0 8px 20px rgba(22, 163, 74, 0.2)"
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>
          Selamat Datang, {user?.name.split(" ")[0]}! 👋
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: 16 }}>
          📍 {user?.posyandu} • {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Balita Aktif", value: children.length, icon: "👶", color: "#3B82F6" },
          { label: "Ibu Hamil", value: ibuHamil.length, icon: "🤰", color: "#F59E0B" },
          { label: "Sesi Bulan Ini", value: 8, icon: "📅", color: "#8B5CF6" },
          { label: "Rujukan Aktif", value: rujukan.filter(r => r.status !== "Selesai").length, icon: "🏥", color: "#EF4444" },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              border: "1px solid #E5E7EB",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(22, 163, 74, 0.12)";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "#16A34A";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#E5E7EB";
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Data */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px", color: "#111827" }}>Balita Terbaru</h3>
          {myChildren.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ fontSize: 20 }}>{c.jenisKelamin === "P" ? "👧" : "👦"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{c.nama}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{c.beratBadan}kg • {c.tinggiBadan}cm</div>
              </div>
              <button style={{
                padding: "5px 12px",
                borderRadius: 6,
                border: "1px solid #16A34A",
                background: "#F0FDF4",
                color: "#16A34A",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                transition: "all 0.2s ease"
              }}
                onMouseOver={(e) => {
                  e.target.style.background = "#E8F5E9";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#F0FDF4";
                }}
              >
                Input
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px", color: "#111827" }}>Jadwal Mendatang</h3>
            {jadwalSesi.filter(j => j.status === "Mendatang").slice(0, 2).map(j => (
              <div key={j.id} style={{
                background: "#F0FDF4",
                borderRadius: 8,
                padding: "10px 12px",
                marginBottom: 8,
                fontSize: 12,
                color: "#16A34A",
                fontWeight: 600
              }}>
                📅 {new Date(j.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
              </div>
            ))}
          </div>

          <div style={{ background: "#FEF3C7", borderRadius: 12, padding: 16, border: "1px solid #FCD34D", boxShadow: "0 2px 8px rgba(245, 158, 11, 0.1)" }}>
            <div style={{ fontWeight: 700, color: "#92400E", marginBottom: 8 }}>ℹ️ Info Penting</div>
            <p style={{ fontSize: 12, color: "#92400E", margin: 0, lineHeight: 1.5 }}>
              Pastikan semua data balita dan ibu hamil selalu ter-update untuk hasil monitoring yang akurat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataWargaPage({ setShowModal }) {
  const [tab, setTab] = useState("balita");
  return (
    <div>
      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 24,
        background: "#F3F4F6",
        padding: 4,
        borderRadius: 10,
        width: "fit-content"
      }}>
        {["balita", "ibu"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#16A34A" : "#6B7280",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: tab === t ? "0 2px 4px rgba(0,0,0,0.08)" : "none"
            }}
          >
            {t === "balita" ? "👶 Balita" : "🤰 Ibu Hamil"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #E5E7EB",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>Nama</th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>Orang Tua / Ibu</th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>Status</th>
              <th style={{ padding: "16px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(tab === "balita" ? children : ibuHamil).slice(0, 5).map((item, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td style={{ padding: "16px", fontSize: 14, color: "#111827" }}>{item.nama}</td>
                <td style={{ padding: "16px", fontSize: 14, color: "#6B7280" }}>{item.namaIbu || "-"}</td>
                <td style={{ padding: "16px" }}>
                  <span style={{
                    fontSize: 12,
                    padding: "4px 12px",
                    borderRadius: 20,
                    background: item.statusGizi === "Normal" ? "#F0FDF4" : "#FEF2F2",
                    color: item.statusGizi === "Normal" ? "#16A34A" : "#EF4444",
                    fontWeight: 600
                  }}>
                    {item.statusGizi || "Aktif"}
                  </span>
                </td>
                <td style={{ padding: "16px", textAlign: "center" }}>
                  <button style={{
                    background: "none",
                    border: "none",
                    color: "#3B82F6",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    transition: "all 0.2s ease"
                  }}
                    onMouseOver={(e) => {
                      e.target.style.color = "#1D4ED8";
                      e.target.style.textDecoration = "underline";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = "#3B82F6";
                      e.target.style.textDecoration = "none";
                    }}
                  >
                    Lihat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function JadwalPage() {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: 24,
      border: "1px solid #E5E7EB",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {jadwalSesi.slice(0, 6).map(j => (
          <div key={j.id} style={{
            background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
            borderRadius: 12,
            padding: 20,
            border: "1px solid #DCFCE7"
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#16A34A", marginBottom: 8 }}>
              {j.posyandu}
            </div>
            <div style={{ fontSize: 14, color: "#374151", marginBottom: 12 }}>
              📅 {new Date(j.tanggal).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
            </div>
            <div style={{ fontSize: 14, color: "#374151", marginBottom: 12 }}>
              ⏰ {j.waktu}
            </div>
            <span style={{
              fontSize: 12,
              padding: "4px 12px",
              borderRadius: 20,
              background: j.status === "Mendatang" ? "#DCFCE7" : "#E0E7FF",
              color: j.status === "Mendatang" ? "#16A34A" : "#4F46E5",
              fontWeight: 600
            }}>
              {j.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BuatSesiPage({ setShowModal }) {
  return (
    <div style={{
      background: "#FEF3C7",
      borderRadius: 12,
      padding: 24,
      border: "1px solid #FCD34D",
      boxShadow: "0 2px 8px rgba(245, 158, 11, 0.1)",
      textAlign: "center"
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#92400E", margin: "0 0 8px" }}>Buat Sesi Baru</h3>
      <p style={{ color: "#92400E", margin: "0 0 20px", fontSize: 14, lineHeight: 1.5 }}>
        Klik tombol di atas untuk membuat jadwal sesi pemeriksaan kesehatan yang baru.
      </p>
      <button
        onClick={() => setShowModal("buat-sesi")}
        style={{
          background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
          color: "#fff",
          border: "none",
          padding: "12px 24px",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)",
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.35)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.25)";
        }}
      >
        + Buat Sesi
      </button>
    </div>
  );
}

function TindakLanjutPage() {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: 24,
      border: "1px solid #E5E7EB",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
    }}>
      {rujukan.slice(0, 8).map((r, i) => (
        <div key={i} style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 0",
          borderBottom: i < rujukan.length - 1 ? "1px solid #F3F4F6" : "none"
        }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: r.status === "Selesai" ? "#16A34A" : r.status === "Proses" ? "#F59E0B" : "#EF4444",
            flexShrink: 0
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{r.namaAnak}</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{r.alasan}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{r.tujuanRujukan}</div>
          </div>
          <span style={{
            fontSize: 11,
            padding: "4px 12px",
            borderRadius: 20,
            background: r.status === "Selesai" ? "#F0FDF4" : r.status === "Proses" ? "#FFFBEB" : "#FEF2F2",
            color: r.status === "Selesai" ? "#16A34A" : r.status === "Proses" ? "#D97706" : "#DC2626",
            fontWeight: 600
          }}>
            {r.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function RiwayatPage() {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: 24,
      border: "1px solid #E5E7EB",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {children.slice(0, 6).map((c, i) => (
          <div key={i} style={{
            background: "#F9FAFB",
            borderRadius: 12,
            padding: 16,
            border: "1px solid #E5E7EB"
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
              {c.nama}
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>
              📝 Catatan terakhir: {Math.floor(Math.random() * 7)} hari lalu
            </div>
            <button style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              background: "#E0E7FF",
              border: "1px solid #C7D2FE",
              color: "#4F46E5",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
              onMouseOver={(e) => {
                e.target.style.background = "#DDD6FE";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#E0E7FF";
              }}
            >
              Lihat Riwayat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ====== MODALS ======

function AddDataModal({ onClose }) {
  const [dataType, setDataType] = useState("balita");

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 600,
        padding: 32, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Tambah Data</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer" }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "#F3F4F6", padding: 4, borderRadius: 8, width: "fit-content" }}>
          {["balita", "ibu"].map(t => (
            <button
              key={t}
              onClick={() => setDataType(t)}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                background: dataType === t ? "#fff" : "transparent",
                color: dataType === t ? "#16A34A" : "#6B7280",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {t === "balita" ? "Balita" : "Ibu Hamil"}
            </button>
          ))}
        </div>

        {/* Form */}
        {dataType === "balita" ? (
          <div style={{ display: "grid", gap: 16 }}>
            {["Nama Balita", "Nama Ibu", "Tanggal Lahir", "Jenis Kelamin", "Berat Badan (kg)", "Tinggi Badan (cm)"].map(field => (
              <div key={field}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  {field.toUpperCase()}
                </label>
                <input placeholder={`Masukkan ${field.toLowerCase()}`} style={{
                  width: "100%", padding: "11px 14px", borderRadius: 8,
                  border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none",
                  boxSizing: "border-box", fontFamily: "inherit",
                  transition: "all 0.3s ease"
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
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {["Nama Ibu Hamil", "Tanggal Lahir", "Usia Kehamilan (bulan)", "Tekanan Darah", "Berat Badan (kg)"].map(field => (
              <div key={field}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  {field.toUpperCase()}
                </label>
                <input placeholder={`Masukkan ${field.toLowerCase()}`} style={{
                  width: "100%", padding: "11px 14px", borderRadius: 8,
                  border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none",
                  boxSizing: "border-box", fontFamily: "inherit",
                  transition: "all 0.3s ease"
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
            ))}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #E5E7EB",
            background: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
            transition: "all 0.2s ease"
          }}
            onMouseOver={(e) => { e.target.style.background = "#F9FAFB"; }}
            onMouseOut={(e) => { e.target.style.background = "#fff"; }}
          >
            Batal
          </button>
          <button style={{
            flex: 1, padding: "12px", borderRadius: 8,
            background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
            color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit",
            fontWeight: 600, transition: "all 0.3s ease", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)"
          }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.35)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.25)";
            }}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function BuatSesiModal({ onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 500,
        padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Buat Sesi Baru</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer" }}>✕</button>
        </div>

        {["Nama Sesi", "Tanggal", "Waktu Mulai", "Lokasi Posyandu", "Deskripsi"].map(field => (
          <div key={field} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              {field.toUpperCase()}
            </label>
            <input placeholder={`Masukkan ${field.toLowerCase()}`} style={{
              width: "100%", padding: "11px 14px", borderRadius: 8,
              border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none",
              boxSizing: "border-box", fontFamily: "inherit",
              transition: "all 0.3s ease"
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
        ))}

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #E5E7EB",
            background: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
            transition: "all 0.2s ease"
          }}
            onMouseOver={(e) => { e.target.style.background = "#F9FAFB"; }}
            onMouseOut={(e) => { e.target.style.background = "#fff"; }}
          >
            Batal
          </button>
          <button style={{
            flex: 1, padding: "12px", borderRadius: 8,
            background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
            color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit",
            fontWeight: 600, transition: "all 0.3s ease", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)"
          }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.35)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.25)";
            }}
          >
            Buat Sesi
          </button>
        </div>
      </div>
    </div>
  );
}
