import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { notifikasi } from "../data/dummyData";

const menuAdmin = [
  { key: "dashboard", label: "Dashboard", icon: "⊞" },
  { key: "monitoring", label: "Monitoring Anak", icon: "👶" },
  { key: "wilayah", label: "Wilayah & Posyandu", icon: "📍" },
  { key: "manajemen", label: "Manajemen User", icon: "👥" },
  { key: "analitik", label: "Analitik", icon: "📊" },
  { key: "audit", label: "Audit Log", icon: "📋" },
];

const menuKader = [
  { key: "dashboard", label: "Dashboard", icon: "⊞" },
  { key: "data-warga", label: "Data Warga", icon: "👨‍👩‍👧" },
  { key: "pemeriksaan", label: "Input Pemeriksaan", icon: "🩺" },
  { key: "jadwal", label: "Jadwal Sesi", icon: "📅" },
  { key: "tindak-lanjut", label: "Tindak Lanjut", icon: "⚡" },
  { key: "profil", label: "Profil", icon: "👤" },
];

const menuOrangTua = [
  { key: "dashboard", label: "Beranda", icon: "🏠" },
  { key: "profil-anak", label: "Profil Anak", icon: "👶" },
  { key: "grafik", label: "Grafik Tumbuh", icon: "📈" },
  { key: "jadwal", label: "Jadwal Posyandu", icon: "📅" },
];

export default function Layout({ page, onNavigate }) {
  const { user, logout } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuMap = { admin: menuAdmin, kader: menuKader, orangtua: menuOrangTua };
  const menu = menuMap[user?.role] || [];
  const unread = notifikasi.filter(n => !n.dibaca).length;

  const roleLabel = { admin: "Administrator", kader: "Kader Posyandu", orangtua: "Orang Tua" };
  const roleColor = { admin: "#E84393", kader: "#16A34A", orangtua: "#2563EB" };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F8FAFB", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 64,
        background: "#fff",
        borderRight: "1px solid #E8EDF2",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #E8EDF2", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #16A34A, #22C55E)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#111827", lineHeight: 1 }}>POSCO</div>
              <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>Posyandu Connection</div>
            </div>
          )}
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <div style={{ padding: "16px", borderBottom: "1px solid #E8EDF2" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: roleColor[user?.role] + "20",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: roleColor[user?.role], fontWeight: 700, fontSize: 14, flexShrink: 0
              }}>
                {user?.name?.charAt(0)}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
                <div style={{
                  fontSize: 11, color: roleColor[user?.role],
                  background: roleColor[user?.role] + "15",
                  padding: "1px 8px", borderRadius: 10, display: "inline-block", marginTop: 2
                }}>
                  {roleLabel[user?.role]}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {menu.map(item => (
            <button key={item.key} onClick={() => onNavigate(item.key)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: sidebarOpen ? "10px 12px" : "10px",
              borderRadius: 8, border: "none", cursor: "pointer",
              background: page === item.key ? "#F0FDF4" : "transparent",
              color: page === item.key ? "#16A34A" : "#6B7280",
              fontWeight: page === item.key ? 600 : 400,
              fontSize: 14, marginBottom: 2, transition: "all 0.15s",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              textAlign: "left",
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
              {sidebarOpen && page === item.key && (
                <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#16A34A" }} />
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid #E8EDF2" }}>
          <button onClick={logout} style={{
            width: "100%", padding: sidebarOpen ? "10px 12px" : "10px",
            borderRadius: 8, border: "none", cursor: "pointer",
            background: "transparent", color: "#EF4444",
            fontSize: 14, display: "flex", alignItems: "center", gap: 10,
            justifyContent: sidebarOpen ? "flex-start" : "center",
          }}>
            <span>🚪</span>
            {sidebarOpen && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <header style={{
          height: 60, background: "#fff", borderBottom: "1px solid #E8EDF2",
          display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            border: "none", background: "none", cursor: "pointer", color: "#6B7280", fontSize: 20, padding: 4
          }}>☰</button>

          <div style={{ flex: 1 }} />

          {/* Notif */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowNotif(!showNotif)} style={{
              border: "1px solid #E8EDF2", background: "#fff", cursor: "pointer",
              borderRadius: 8, padding: "6px 10px", position: "relative"
            }}>
              🔔
              {unread > 0 && (
                <span style={{
                  position: "absolute", top: -4, right: -4,
                  background: "#EF4444", color: "#fff",
                  borderRadius: "50%", width: 16, height: 16,
                  fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700
                }}>{unread}</span>
              )}
            </button>
            {showNotif && (
              <div style={{
                position: "absolute", right: 0, top: 44,
                width: 320, background: "#fff", border: "1px solid #E8EDF2",
                borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 100
              }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #E8EDF2", fontWeight: 600, fontSize: 14 }}>Notifikasi</div>
                {notifikasi.map(n => (
                  <div key={n.id} style={{
                    padding: "12px 16px", borderBottom: "1px solid #F3F4F6",
                    background: n.dibaca ? "#fff" : "#F0FDF4",
                    display: "flex", gap: 12, alignItems: "flex-start"
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: n.dibaca ? "#D1D5DB" : "#16A34A",
                      marginTop: 6, flexShrink: 0
                    }} />
                    <div>
                      <div style={{ fontSize: 13, color: "#111827" }}>{n.pesan}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{n.waktu}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: roleColor[user?.role] + "20",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: roleColor[user?.role], fontWeight: 700, fontSize: 13
          }}>
            {user?.name?.charAt(0)}
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: "auto", padding: 24 }}>
          {page === "coming-soon" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#9CA3AF" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🚧</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#374151" }}>Halaman Dalam Pengembangan</div>
              <div style={{ marginTop: 8 }}>Fitur ini akan segera hadir</div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}