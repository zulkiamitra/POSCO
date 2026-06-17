import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import EmptyState from "../components/EmptyState";
import logo from "../assets/POSCO_LOGO_KITA.png";
import { children, ibuHamil, jadwalSesi, rujukan, users } from "../data/dummyData";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function KaderDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const [activePage, setActivePage] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [jadwalSesiState, setJadwalSesiState] = useState(jadwalSesi);
  const [rujukanState, setRujukanState] = useState(rujukan);
  const [selectedRujukan, setSelectedRujukan] = useState(null);
  const [showEditRujukanModal, setShowEditRujukanModal] = useState(false);
  const [childrenData, setChildrenData] = useState(children);
  const [showInputPemeriksaanModal, setShowInputPemeriksaanModal] = useState(false);
  const [childForInput, setChildForInput] = useState(null);

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
          {activePage === "dashboard" && <DashboardPage user={user} childrenData={childrenData} onInputClick={(child) => { setChildForInput(child); setShowInputPemeriksaanModal(true); }} />}
          {activePage === "data-warga" && <DataWargaPage childrenData={childrenData} setShowModal={setShowAddModal} setSelectedChild={setSelectedChild} setShowDetailModal={setShowDetailModal} />}
          {activePage === "jadwal" && <JadwalPage jadwalSesi={jadwalSesiState} />}
          {activePage === "buat-sesi" && <BuatSesiPage setShowModal={setShowAddModal} />}
          {activePage === "tindak-lanjut" && <TindakLanjutPage rujukan={rujukanState} onEditRujukan={(r) => { setSelectedRujukan(r); setShowEditRujukanModal(true); }} />}
          {activePage === "riwayat" && <RiwayatPage childrenData={childrenData} />}
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && selectedChild && (
        <DetailBalitaModal child={selectedChild} onClose={() => { setShowDetailModal(false); setSelectedChild(null); }} />
      )}
      {showAddModal === "data-warga" && (
        <AddDataModal onClose={() => setShowAddModal(null)} />
      )}
      {showAddModal === "buat-sesi" && (
        <BuatSesiModal 
          onClose={() => setShowAddModal(null)} 
          jadwalSesiState={jadwalSesiState}
          onSessionCreated={(newSesi) => {
            setJadwalSesiState([...jadwalSesiState, newSesi]);
            success("✅ Sesi berhasil dibuat! Jadwal telah ditambahkan ke sistem.");
          }}
        />
      )}
      {showEditRujukanModal && selectedRujukan && (
        <EditRujukanModal 
          rujukan={selectedRujukan}
          onClose={() => { setShowEditRujukanModal(false); setSelectedRujukan(null); }}
          onSave={(updatedRujukan) => {
            setRujukanState(rujukanState.map(r => r.id === updatedRujukan.id ? updatedRujukan : r));
            setShowEditRujukanModal(false);
            setSelectedRujukan(null);
            success("✅ Data tindak lanjut berhasil diperbarui!");
          }}
        />
      )}
      {showInputPemeriksaanModal && childForInput && (
        <InputPemeriksaanModal
          child={childForInput}
          onClose={() => { setShowInputPemeriksaanModal(false); setChildForInput(null); }}
          onSave={(updatedChild) => {
            setChildrenData(childrenData.map(c => c.id === updatedChild.id ? updatedChild : c));
            setShowInputPemeriksaanModal(false);
            setChildForInput(null);
            success("✅ Data pemeriksaan berhasil disimpan!");
          }}
        />
      )}
    </div>
  );
}

// ====== PAGES ======

function DashboardPage({ user, childrenData, onInputClick }) {
  const myChildren = childrenData.slice(0, 3);
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
              <button 
                onClick={() => onInputClick(c)}
                style={{
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

function DataWargaPage({ childrenData, setShowModal, setSelectedChild, setShowDetailModal }) {
  const [tab, setTab] = useState("balita");
  
  const handleViewDetail = (child) => {
    setSelectedChild(child);
    setShowDetailModal(true);
  };
  
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
            {(tab === "balita" ? childrenData : ibuHamil).slice(0, 5).map((item, i) => (
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
                  {tab === "balita" ? (
                    <button 
                      onClick={() => handleViewDetail(item)}
                      style={{
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
                      Lihat Detail
                    </button>
                  ) : (
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
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function JadwalPage({ jadwalSesi }) {
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

function TindakLanjutPage({ rujukan, onEditRujukan }) {
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
          padding: "16px",
          marginBottom: "8px",
          borderRadius: 8,
          background: "#F9FAFB",
          borderBottom: i < rujukan.length - 1 ? "1px solid #F3F4F6" : "none",
          transition: "all 0.2s ease"
        }}
          onMouseOver={(e) => e.currentTarget.style.background = "#F3F4F6"}
          onMouseOut={(e) => e.currentTarget.style.background = "#F9FAFB"}
        >
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
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{r.tujuan}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
            <button
              onClick={() => onEditRujukan(r)}
              style={{
                background: "none",
                border: "none",
                color: "#3B82F6",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                transition: "all 0.2s ease",
                padding: "4px 8px"
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
              📝 Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function RiwayatPage({ childrenData }) {
  const [selectedRiwayat, setSelectedRiwayat] = useState(null);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
        {/* Daftar Balita */}
        <div style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          border: "1px solid #E5E7EB",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          height: "fit-content"
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Daftar Balita</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {childrenData.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedRiwayat(c)}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  border: selectedRiwayat?.id === c.id ? "2px solid #16A34A" : "1px solid #E5E7EB",
                  background: selectedRiwayat?.id === c.id ? "#F0FDF4" : "#F9FAFB",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "left"
                }}
                onMouseOver={(e) => {
                  if (selectedRiwayat?.id !== c.id) {
                    e.currentTarget.style.background = "#F3F4F6";
                    e.currentTarget.style.borderColor = "#D1D5DB";
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedRiwayat?.id !== c.id) {
                    e.currentTarget.style.background = "#F9FAFB";
                    e.currentTarget.style.borderColor = "#E5E7EB";
                  }
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{c.nama}</div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
                  👶 {c.jenisKelamin === "P" ? "Perempuan" : "Laki-laki"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail Riwayat */}
        <div style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          border: "1px solid #E5E7EB",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
        }}>
          {selectedRiwayat ? (
            <div>
              <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #E5E7EB" }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>
                  {selectedRiwayat.nama}
                </h2>
                <p style={{ fontSize: 13, color: "#6B7280", marginTop: 8 }}>
                  📅 Lahir: {new Date(selectedRiwayat.tanggalLahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>

              {/* Riwayat Pemeriksaan */}
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Riwayat Pemeriksaan</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {selectedRiwayat.riwayatPemeriksaan && selectedRiwayat.riwayatPemeriksaan.length > 0 ? (
                  selectedRiwayat.riwayatPemeriksaan.map((riwayat, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#F9FAFB",
                        borderLeft: `4px solid ${riwayat.statusGizi === "Normal" ? "#16A34A" : riwayat.statusGizi === "Gizi Kurang" ? "#F59E0B" : "#EF4444"}`,
                        borderRadius: 8,
                        padding: 16,
                        transition: "all 0.2s ease"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                          📅 {new Date(riwayat.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </div>
                        <span style={{
                          fontSize: 11,
                          padding: "4px 12px",
                          borderRadius: 20,
                          background: riwayat.statusGizi === "Normal" ? "#F0FDF4" : riwayat.statusGizi === "Gizi Kurang" ? "#FFFBEB" : "#FEF2F2",
                          color: riwayat.statusGizi === "Normal" ? "#16A34A" : riwayat.statusGizi === "Gizi Kurang" ? "#D97706" : "#DC2626",
                          fontWeight: 600
                        }}>
                          {riwayat.statusGizi}
                        </span>
                      </div>

                      {/* Metrik Pemeriksaan */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 12,
                        padding: 12,
                        background: "#fff",
                        borderRadius: 6,
                        marginBottom: 12
                      }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Berat Badan</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{riwayat.bb}<span style={{ fontSize: 12 }}>kg</span></div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Tinggi Badan</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{riwayat.tb}<span style={{ fontSize: 12 }}>cm</span></div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Lingkar Kepala</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{riwayat.lingkarKepala}<span style={{ fontSize: 12 }}>cm</span></div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Lingkar Lengan</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{riwayat.lingkarLengan}<span style={{ fontSize: 12 }}>cm</span></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    padding: 24,
                    textAlign: "center",
                    background: "#F9FAFB",
                    borderRadius: 8,
                    color: "#6B7280",
                    fontSize: 13
                  }}>
                    Belum ada data riwayat pemeriksaan
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{
              padding: 40,
              textAlign: "center",
              color: "#9CA3AF"
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
              <p>Pilih balita untuk melihat riwayat pemeriksaannya</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ====== MODALS ======

function downloadPDF(child, parentInfo) {
  const doc = new jsPDF();
  
  // Warna hijau posco
  const primaryColor = [22, 163, 74];
  
  // Title
  doc.setTextColor(...primaryColor);
  doc.setFontSize(18);
  doc.text("LAPORAN DATA BALITA", 105, 15, { align: "center" });
  
  // Garis
  doc.setDrawColor(...primaryColor);
  doc.line(20, 20, 190, 20);
  
  // Informasi Balita
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("INFORMASI BALITA", 20, 30);
  
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  let yPosition = 38;
  const data = [
    ["Nama", child.nama],
    ["Jenis Kelamin", child.jenisKelamin === "P" ? "Perempuan" : "Laki-laki"],
    ["Tanggal Lahir", new Date(child.tanggalLahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })],
    ["Berat Badan", `${child.beratBadan} kg`],
    ["Tinggi Badan", `${child.tinggiBadan} cm`],
    ["Status Gizi", child.statusGizi],
    ["Status Stunting", child.statusStunting],
    ["Posyandu", child.posyandu],
  ];
  
  data.forEach(([label, value]) => {
    doc.text(`${label}:`, 20, yPosition);
    doc.text(value, 70, yPosition);
    yPosition += 6;
  });
  
  // Informasi Orang Tua
  yPosition += 8;
  doc.setFont(undefined, "bold");
  doc.text("INFORMASI ORANG TUA", 20, yPosition);
  yPosition += 8;
  
  doc.setFont(undefined, "normal");
  if (parentInfo) {
    const parentData = [
      ["Nama", parentInfo.name],
      ["Email", parentInfo.email],
      ["Wilayah", parentInfo.wilayah],
    ];
    parentData.forEach(([label, value]) => {
      doc.text(`${label}:`, 20, yPosition);
      doc.text(value, 70, yPosition);
      yPosition += 6;
    });
  } else {
    doc.text("Data orang tua tidak tersedia", 20, yPosition);
  }
  
  // Riwayat Pemeriksaan
  yPosition += 8;
  doc.setFont(undefined, "bold");
  doc.text("RIWAYAT PEMERIKSAAN", 20, yPosition);
  yPosition += 8;
  
  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  
  // Tabel riwayat
  const tableData = [
    ["Tanggal", "BB (kg)", "TB (cm)", "Lingkar Kepala (cm)", "Lingkar Lengan (cm)", "Status Gizi"]
  ];
  
  if (child.riwayatPemeriksaan && child.riwayatPemeriksaan.length > 0) {
    child.riwayatPemeriksaan.forEach(r => {
      tableData.push([
        new Date(r.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        r.bb.toString(),
        r.tb.toString(),
        r.lingkarKepala.toString(),
        r.lingkarLengan.toString(),
        r.statusGizi
      ]);
    });
  } else {
    tableData.push(["", "", "", "", "", "Tidak ada data"]);
  }
  
  doc.autoTable({
    head: [tableData[0]],
    body: tableData.slice(1),
    startY: yPosition,
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontSize: 9, fontStyle: "bold" },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 16 },
      2: { cellWidth: 16 },
      3: { cellWidth: 26 },
      4: { cellWidth: 26 },
      5: { cellWidth: 22 },
    },
    margin: { left: 20, right: 20 },
    didDrawPage: function(data) {
      // Footer
      const pageCount = doc.internal.pages.length - 1;
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.getHeight();
      const pageWidth = pageSize.getWidth();
      
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(
        `Halaman ${data.pageNumber} dari ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }
  });
  
  // Tanggal cetak
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(`Dicetak pada: ${new Date().toLocaleDateString("id-ID")}`, 20, doc.internal.pages[1] ? 285 : doc.lastAutoTable.finalY + 15);
  
  // Download
  doc.save(`Laporan-${child.nama.replace(/\s/g, "-")}.pdf`);
}

function DetailBalitaModal({ child, onClose }) {
  const [activeTab, setActiveTab] = useState("info");
  
  // Cari data orang tua
  const parentInfo = users.find(u => u.id === child.orangtuaId);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        width: "100%",
        maxWidth: 800,
        padding: 32,
        maxHeight: "90vh",
        overflow: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#111827" }}>
              {child.jenisKelamin === "P" ? "👧" : "👦"} {child.nama}
            </h2>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "8px 0 0" }}>
              {child.statusGizi} • {child.statusStunting}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "#9CA3AF"
            }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
          borderBottom: "2px solid #E5E7EB",
          paddingBottom: 0
        }}>
          {["info", "riwayat", "orangtua"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 16px",
                borderRadius: 0,
                border: "none",
                background: "transparent",
                color: activeTab === tab ? "#16A34A" : "#6B7280",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                borderBottom: activeTab === tab ? "3px solid #16A34A" : "none",
                marginBottom: "-2px"
              }}
            >
              {tab === "info" ? "📋 Informasi" : tab === "riwayat" ? "📊 Riwayat" : "👨‍👩‍👧 Orang Tua"}
            </button>
          ))}
        </div>

        {/* Tab: Informasi */}
        {activeTab === "info" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 16, textTransform: "uppercase" }}>Data Dasar</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  ["Nama", child.nama],
                  ["Jenis Kelamin", child.jenisKelamin === "P" ? "Perempuan" : "Laki-laki"],
                  ["Tanggal Lahir", new Date(child.tanggalLahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })],
                  ["Berat Lahir", `${child.beratLahir} kg`],
                ].map(([label, value], i) => (
                  <div key={i}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginTop: 4 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 16, textTransform: "uppercase" }}>Status Kesehatan</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  ["Berat Badan", `${child.beratBadan} kg`, "#EF4444"],
                  ["Tinggi Badan", `${child.tinggiBadan} cm`, "#3B82F6"],
                  ["Status Gizi", child.statusGizi, child.statusGizi === "Normal" ? "#16A34A" : "#F59E0B"],
                  ["Status Stunting", child.statusStunting, child.statusStunting === "Tidak Stunting" ? "#16A34A" : "#EF4444"],
                ].map(([label, value, color], i) => (
                  <div key={i} style={{ padding: 12, background: "#F9FAFB", borderLeft: `4px solid ${color}`, borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: color, marginTop: 4 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 16, textTransform: "uppercase" }}>Imunisasi</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {Object.entries(child.imunisasi).map(([nama, status], i) => (
                  <div
                    key={i}
                    style={{
                      padding: 12,
                      background: status ? "#F0FDF4" : "#FEF2F2",
                      border: `1px solid ${status ? "#DCFCE7" : "#FECACA"}`,
                      borderRadius: 8,
                      textAlign: "center"
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#111827", marginBottom: 6 }}>{nama.toUpperCase()}</div>
                    <div style={{ fontSize: 20 }}>{status ? "✅" : "⏳"}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Riwayat */}
        {activeTab === "riwayat" && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Riwayat Pemeriksaan Kesehatan</h3>
            {child.riwayatPemeriksaan && child.riwayatPemeriksaan.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {child.riwayatPemeriksaan.map((riwayat, i) => (
                  <div
                    key={i}
                    style={{
                      padding: 16,
                      background: "#F9FAFB",
                      border: `2px solid ${riwayat.statusGizi === "Normal" ? "#DCFCE7" : riwayat.statusGizi === "Gizi Kurang" ? "#FEF3C7" : "#FECACA"}`,
                      borderRadius: 12,
                      borderLeft: `4px solid ${riwayat.statusGizi === "Normal" ? "#16A34A" : riwayat.statusGizi === "Gizi Kurang" ? "#F59E0B" : "#EF4444"}`
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                        📅 {new Date(riwayat.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                      <span style={{
                        fontSize: 11,
                        padding: "4px 12px",
                        borderRadius: 20,
                        background: riwayat.statusGizi === "Normal" ? "#F0FDF4" : riwayat.statusGizi === "Gizi Kurang" ? "#FFFBEB" : "#FEF2F2",
                        color: riwayat.statusGizi === "Normal" ? "#16A34A" : riwayat.statusGizi === "Gizi Kurang" ? "#D97706" : "#DC2626",
                        fontWeight: 600
                      }}>
                        {riwayat.statusGizi}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                      <div style={{ background: "#fff", padding: 12, borderRadius: 8, textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 6 }}>Berat Badan</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#EF4444" }}>{riwayat.bb}<span style={{ fontSize: 12 }}>kg</span></div>
                      </div>
                      <div style={{ background: "#fff", padding: 12, borderRadius: 8, textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 6 }}>Tinggi Badan</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#3B82F6" }}>{riwayat.tb}<span style={{ fontSize: 12 }}>cm</span></div>
                      </div>
                      <div style={{ background: "#fff", padding: 12, borderRadius: 8, textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 6 }}>Lingkar Kepala</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#8B5CF6" }}>{riwayat.lingkarKepala}<span style={{ fontSize: 12 }}>cm</span></div>
                      </div>
                      <div style={{ background: "#fff", padding: 12, borderRadius: 8, textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 6 }}>Lingkar Lengan</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#06B6D4" }}>{riwayat.lingkarLengan}<span style={{ fontSize: 12 }}>cm</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: 32,
                textAlign: "center",
                background: "#F9FAFB",
                borderRadius: 8,
                color: "#9CA3AF",
                fontSize: 13
              }}>
                Belum ada data riwayat pemeriksaan
              </div>
            )}
          </div>
        )}

        {/* Tab: Orang Tua */}
        {activeTab === "orangtua" && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Informasi Orang Tua / Wali</h3>
            {parentInfo ? (
              <div style={{
                background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
                border: "2px solid #DCFCE7",
                borderRadius: 12,
                padding: 24
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", marginBottom: 8 }}>Nama</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{parentInfo.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", marginBottom: 8 }}>Email</div>
                    <div style={{ fontSize: 14, color: "#111827" }}>{parentInfo.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", marginBottom: 8 }}>Peran</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#16A34A" }}>{parentInfo.role === "orangtua" ? "Orang Tua" : parentInfo.role}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", marginBottom: 8 }}>Wilayah</div>
                    <div style={{ fontSize: 14, color: "#111827" }}>{parentInfo.wilayah}</div>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", marginBottom: 8 }}>Status</div>
                    <div>
                      <span style={{
                        fontSize: 12,
                        padding: "6px 14px",
                        borderRadius: 20,
                        background: parentInfo.status === "active" ? "#F0FDF4" : "#FEF2F2",
                        color: parentInfo.status === "active" ? "#16A34A" : "#EF4444",
                        fontWeight: 600
                      }}>
                        {parentInfo.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                padding: 32,
                textAlign: "center",
                background: "#F9FAFB",
                borderRadius: 8,
                color: "#9CA3AF",
                fontSize: 13
              }}>
                Data orang tua tidak tersedia
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 32, paddingTop: 24, borderTop: "1px solid #E5E7EB" }}>
          <button
            onClick={() => downloadPDF(child, parentInfo)}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 8,
              background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)"
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 20px rgba(59, 130, 246, 0.35)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.25)";
            }}
          >
            📥 Download PDF
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              background: "#fff",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => { e.target.style.background = "#F9FAFB"; }}
            onMouseOut={(e) => { e.target.style.background = "#fff"; }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

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

function EditRujukanModal({ rujukan, onClose, onSave }) {
  const { error: errorNotify } = useNotification();
  const [formData, setFormData] = useState({
    status: rujukan.status || "Proses",
    keterangan: rujukan.keterangan || ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.status) {
      errorNotify("⚠️ Harap pilih status");
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    // Update rujukan data
    const updatedRujukan = {
      ...rujukan,
      status: formData.status,
      keterangan: formData.keterangan
    };

    onSave(updatedRujukan);
    setLoading(false);
  };

  const statusOptions = [
    { value: "Terkirim", label: "Terkirim", color: "#EF4444" },
    { value: "Proses", label: "Proses", color: "#F59E0B" },
    { value: "Selesai", label: "Selesai", color: "#16A34A" }
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 550,
        padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", maxHeight: "90vh", overflow: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Edit Tindak Lanjut</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer", color: "#9CA3AF" }}>✕</button>
        </div>

        {/* Info Card */}
        <div style={{
          background: "#F3F4F6",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          borderLeft: "4px solid #16A34A"
        }}>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>Nama Anak</div>
          <div style={{ fontWeight: 600, fontSize: 16, color: "#111827" }}>{rujukan.namaAnak}</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 12, marginBottom: 4 }}>Alasan Rujukan</div>
          <div style={{ fontSize: 14, color: "#374151" }}>{rujukan.alasan}</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 12, marginBottom: 4 }}>Tujuan Rujukan</div>
          <div style={{ fontSize: 14, color: "#374151" }}>{rujukan.tujuan}</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          {/* Status Selection */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
              STATUS RUJUKAN <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {statusOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: opt.value }))}
                  style={{
                    padding: "12px",
                    borderRadius: 8,
                    border: formData.status === opt.value ? `2px solid ${opt.color}` : "2px solid #E5E7EB",
                    background: formData.status === opt.value ? `${opt.color}15` : "#fff",
                    color: opt.color,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontSize: 13
                  }}
                  onMouseOver={(e) => {
                    if (formData.status !== opt.value) {
                      e.target.style.borderColor = opt.color;
                      e.target.style.background = `${opt.color}08`;
                    }
                  }}
                  onMouseOut={(e) => {
                    if (formData.status !== opt.value) {
                      e.target.style.borderColor = "#E5E7EB";
                      e.target.style.background = "#fff";
                    }
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Keterangan/Deskripsi */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              KETERANGAN <span style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 400 }}>(Opsional)</span>
            </label>
            <textarea
              placeholder="Tambahkan catatan atau hasil penanganan..."
              value={formData.keterangan}
              onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 8,
                border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none",
                boxSizing: "border-box", fontFamily: "inherit", transition: "all 0.3s ease",
                background: "#fff", minHeight: "100px", resize: "vertical"
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

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #E5E7EB",
                background: "#fff", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", fontWeight: 600, transition: "all 0.2s ease",
                color: loading ? "#9CA3AF" : "#374151"
              }}
              onMouseOver={(e) => { if (!loading) e.target.style.background = "#F9FAFB"; }}
              onMouseOut={(e) => { if (!loading) e.target.style.background = "#fff"; }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1, padding: "12px", borderRadius: 8,
                background: loading ? "#9CA3AF" : "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", fontWeight: 600, transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)", opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.35)";
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.25)";
                }
              }}
            >
              {loading ? "⏳ Menyimpan..." : "✓ Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BuatSesiModal({ onClose, onSessionCreated, jadwalSesiState }) {
  const { success, error: errorNotify } = useNotification();
  const [formData, setFormData] = useState({
    namaSesi: "",
    tanggal: "",
    waktuMulai: "",
    lokasiPosyandu: "",
    deskripsi: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error saat user mulai mengetik
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.namaSesi.trim()) newErrors.namaSesi = "Nama sesi tidak boleh kosong";
    if (!formData.tanggal) newErrors.tanggal = "Tanggal harus dipilih";
    if (!formData.waktuMulai) newErrors.waktuMulai = "Waktu mulai harus dipilih";
    if (!formData.lokasiPosyandu.trim()) newErrors.lokasiPosyandu = "Lokasi posyandu tidak boleh kosong";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      errorNotify("⚠️ Harap isi semua field yang wajib");
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));

    // Create new session object
    const newSesi = {
      id: Math.max(...jadwalSesiState.map(j => j.id), 0) + 1,
      tanggal: formData.tanggal,
      waktu: `${formData.waktuMulai} - 12:00`,
      posyandu: formData.lokasiPosyandu,
      jumlahHadir: 0,
      status: "Mendatang",
      kader: "Siti Rahayu",
      nama: formData.namaSesi,
      deskripsi: formData.deskripsi
    };

    // Call parent callback
    onSessionCreated(newSesi);
    setLoading(false);
    
    // Reset form
    setFormData({
      namaSesi: "",
      tanggal: "",
      waktuMulai: "",
      lokasiPosyandu: "",
      deskripsi: ""
    });

    // Close modal after 1.5 seconds
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 600,
        padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", maxHeight: "90vh", overflow: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Buat Sesi Baru</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer", color: "#9CA3AF" }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          {/* Nama Sesi */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              NAMA SESI <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Sesi Pemeriksaan Balita Reguler"
              value={formData.namaSesi}
              onChange={(e) => handleInputChange(e, "namaSesi")}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 8,
                border: errors.namaSesi ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                transition: "all 0.3s ease", background: "#fff"
              }}
              onFocus={(e) => {
                if (!errors.namaSesi) {
                  e.target.style.borderColor = "#16A34A";
                  e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
                }
              }}
              onBlur={(e) => {
                if (!errors.namaSesi) {
                  e.target.style.borderColor = "#E5E7EB";
                  e.target.style.boxShadow = "none";
                }
              }}
            />
            {errors.namaSesi && <div style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>⚠️ {errors.namaSesi}</div>}
          </div>

          {/* Tanggal */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              TANGGAL <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="date"
              value={formData.tanggal}
              onChange={(e) => handleInputChange(e, "tanggal")}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 8,
                border: errors.tanggal ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                transition: "all 0.3s ease", background: "#fff"
              }}
              onFocus={(e) => {
                if (!errors.tanggal) {
                  e.target.style.borderColor = "#16A34A";
                  e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
                }
              }}
              onBlur={(e) => {
                if (!errors.tanggal) {
                  e.target.style.borderColor = "#E5E7EB";
                  e.target.style.boxShadow = "none";
                }
              }}
            />
            {errors.tanggal && <div style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>⚠️ {errors.tanggal}</div>}
          </div>

          {/* Waktu Mulai */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              WAKTU MULAI <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="time"
              value={formData.waktuMulai}
              onChange={(e) => handleInputChange(e, "waktuMulai")}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 8,
                border: errors.waktuMulai ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                transition: "all 0.3s ease", background: "#fff"
              }}
              onFocus={(e) => {
                if (!errors.waktuMulai) {
                  e.target.style.borderColor = "#16A34A";
                  e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
                }
              }}
              onBlur={(e) => {
                if (!errors.waktuMulai) {
                  e.target.style.borderColor = "#E5E7EB";
                  e.target.style.boxShadow = "none";
                }
              }}
            />
            {errors.waktuMulai && <div style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>⚠️ {errors.waktuMulai}</div>}
          </div>

          {/* Lokasi Posyandu */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              LOKASI POSYANDU <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Posyandu Melati"
              value={formData.lokasiPosyandu}
              onChange={(e) => handleInputChange(e, "lokasiPosyandu")}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 8,
                border: errors.lokasiPosyandu ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                transition: "all 0.3s ease", background: "#fff"
              }}
              onFocus={(e) => {
                if (!errors.lokasiPosyandu) {
                  e.target.style.borderColor = "#16A34A";
                  e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
                }
              }}
              onBlur={(e) => {
                if (!errors.lokasiPosyandu) {
                  e.target.style.borderColor = "#E5E7EB";
                  e.target.style.boxShadow = "none";
                }
              }}
            />
            {errors.lokasiPosyandu && <div style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>⚠️ {errors.lokasiPosyandu}</div>}
          </div>

          {/* Deskripsi */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              DESKRIPSI <span style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 400 }}>(Opsional)</span>
            </label>
            <textarea
              placeholder="Tambahkan catatan untuk sesi ini (opsional)"
              value={formData.deskripsi}
              onChange={(e) => handleInputChange(e, "deskripsi")}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 8,
                border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none",
                boxSizing: "border-box", fontFamily: "inherit", transition: "all 0.3s ease",
                background: "#fff", minHeight: "80px", resize: "vertical"
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

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #E5E7EB",
                background: "#fff", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", fontWeight: 600, transition: "all 0.2s ease",
                color: loading ? "#9CA3AF" : "#374151"
              }}
              onMouseOver={(e) => { if (!loading) e.target.style.background = "#F9FAFB"; }}
              onMouseOut={(e) => { if (!loading) e.target.style.background = "#fff"; }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1, padding: "12px", borderRadius: 8,
                background: loading ? "#9CA3AF" : "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", fontWeight: 600, transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)", opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.35)";
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.25)";
                }
              }}
            >
              {loading ? "⏳ Membuat Sesi..." : "✓ Buat Sesi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputPemeriksaanModal({ child, onClose, onSave }) {
  const { success, error: errorNotify } = useNotification();
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    bb: "",
    tb: "",
    lingkarKepala: "",
    lingkarLengan: "",
    statusGizi: "Normal"
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.tanggal) newErrors.tanggal = "Tanggal harus dipilih";
    if (!formData.bb || formData.bb <= 0) newErrors.bb = "Berat badan harus diisi dengan benar";
    if (!formData.tb || formData.tb <= 0) newErrors.tb = "Tinggi badan harus diisi dengan benar";
    if (!formData.lingkarKepala || formData.lingkarKepala <= 0) newErrors.lingkarKepala = "Lingkar kepala harus diisi";
    if (!formData.lingkarLengan || formData.lingkarLengan <= 0) newErrors.lingkarLengan = "Lingkar lengan harus diisi";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      errorNotify("⚠️ Harap isi semua field dengan benar");
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    // Create new pemeriksaan entry
    const newPemeriksaan = {
      tanggal: formData.tanggal,
      bb: parseFloat(formData.bb),
      tb: parseFloat(formData.tb),
      lingkarKepala: parseFloat(formData.lingkarKepala),
      lingkarLengan: parseFloat(formData.lingkarLengan),
      statusGizi: formData.statusGizi
    };

    // Update child data
    const updatedChild = {
      ...child,
      beratBadan: parseFloat(formData.bb),
      tinggiBadan: parseFloat(formData.tb),
      statusGizi: formData.statusGizi,
      riwayatPemeriksaan: [...child.riwayatPemeriksaan, newPemeriksaan]
    };

    setLoading(false);
    onSave(updatedChild);
  };

  const statusGiziOptions = ["Normal", "Gizi Kurang", "Gizi Lebih"];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 600,
        padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", maxHeight: "90vh", overflow: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Input Data Pemeriksaan</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer", color: "#9CA3AF" }}>✕</button>
        </div>

        {/* Child Info Card */}
        <div style={{
          background: "#F3F4F6",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          borderLeft: "4px solid #16A34A"
        }}>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>Nama Balita</div>
          <div style={{ fontWeight: 600, fontSize: 16, color: "#111827" }}>
            {child.jenisKelamin === "P" ? "👧" : "👦"} {child.nama}
          </div>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 12, marginBottom: 4 }}>Ibu/Orang Tua</div>
          <div style={{ fontSize: 14, color: "#374151" }}>{child.namaIbu}</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          {/* Tanggal Pemeriksaan */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              TANGGAL PEMERIKSAAN <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="date"
              value={formData.tanggal}
              onChange={(e) => handleInputChange(e, "tanggal")}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 8,
                border: errors.tanggal ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                transition: "all 0.3s ease", background: "#fff"
              }}
              onFocus={(e) => {
                if (!errors.tanggal) {
                  e.target.style.borderColor = "#16A34A";
                  e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
                }
              }}
              onBlur={(e) => {
                if (!errors.tanggal) {
                  e.target.style.borderColor = "#E5E7EB";
                  e.target.style.boxShadow = "none";
                }
              }}
            />
            {errors.tanggal && <div style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>⚠️ {errors.tanggal}</div>}
          </div>

          {/* Measurements Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {/* Berat Badan */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                BERAT BADAN (kg) <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="Contoh: 9.5"
                value={formData.bb}
                onChange={(e) => handleInputChange(e, "bb")}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 8,
                  border: errors.bb ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                  fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                  transition: "all 0.3s ease", background: "#fff"
                }}
                onFocus={(e) => {
                  if (!errors.bb) {
                    e.target.style.borderColor = "#16A34A";
                    e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
                  }
                }}
                onBlur={(e) => {
                  if (!errors.bb) {
                    e.target.style.borderColor = "#E5E7EB";
                    e.target.style.boxShadow = "none";
                  }
                }}
              />
              {errors.bb && <div style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>⚠️ {errors.bb}</div>}
            </div>

            {/* Tinggi Badan */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                TINGGI BADAN (cm) <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="Contoh: 75"
                value={formData.tb}
                onChange={(e) => handleInputChange(e, "tb")}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 8,
                  border: errors.tb ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                  fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                  transition: "all 0.3s ease", background: "#fff"
                }}
                onFocus={(e) => {
                  if (!errors.tb) {
                    e.target.style.borderColor = "#16A34A";
                    e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
                  }
                }}
                onBlur={(e) => {
                  if (!errors.tb) {
                    e.target.style.borderColor = "#E5E7EB";
                    e.target.style.boxShadow = "none";
                  }
                }}
              />
              {errors.tb && <div style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>⚠️ {errors.tb}</div>}
            </div>

            {/* Lingkar Kepala */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                LINGKAR KEPALA (cm) <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="Contoh: 45"
                value={formData.lingkarKepala}
                onChange={(e) => handleInputChange(e, "lingkarKepala")}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 8,
                  border: errors.lingkarKepala ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                  fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                  transition: "all 0.3s ease", background: "#fff"
                }}
                onFocus={(e) => {
                  if (!errors.lingkarKepala) {
                    e.target.style.borderColor = "#16A34A";
                    e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
                  }
                }}
                onBlur={(e) => {
                  if (!errors.lingkarKepala) {
                    e.target.style.borderColor = "#E5E7EB";
                    e.target.style.boxShadow = "none";
                  }
                }}
              />
              {errors.lingkarKepala && <div style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>⚠️ {errors.lingkarKepala}</div>}
            </div>

            {/* Lingkar Lengan */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                LINGKAR LENGAN (cm) <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="Contoh: 14"
                value={formData.lingkarLengan}
                onChange={(e) => handleInputChange(e, "lingkarLengan")}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 8,
                  border: errors.lingkarLengan ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                  fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                  transition: "all 0.3s ease", background: "#fff"
                }}
                onFocus={(e) => {
                  if (!errors.lingkarLengan) {
                    e.target.style.borderColor = "#16A34A";
                    e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
                  }
                }}
                onBlur={(e) => {
                  if (!errors.lingkarLengan) {
                    e.target.style.borderColor = "#E5E7EB";
                    e.target.style.boxShadow = "none";
                  }
                }}
              />
              {errors.lingkarLengan && <div style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>⚠️ {errors.lingkarLengan}</div>}
            </div>
          </div>

          {/* Status Gizi */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
              STATUS GIZI <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {statusGiziOptions.map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, statusGizi: status }))}
                  style={{
                    padding: "12px",
                    borderRadius: 8,
                    border: formData.statusGizi === status ? "2px solid #16A34A" : "2px solid #E5E7EB",
                    background: formData.statusGizi === status ? "#F0FDF4" : "#fff",
                    color: status === "Normal" ? "#16A34A" : status === "Gizi Kurang" ? "#F59E0B" : "#EF4444",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontSize: 13
                  }}
                  onMouseOver={(e) => {
                    if (formData.statusGizi !== status) {
                      e.target.style.borderColor = "#16A34A";
                      e.target.style.background = "#F0FDF408";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (formData.statusGizi !== status) {
                      e.target.style.borderColor = "#E5E7EB";
                      e.target.style.background = "#fff";
                    }
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #E5E7EB",
                background: "#fff", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", fontWeight: 600, transition: "all 0.2s ease",
                color: loading ? "#9CA3AF" : "#374151"
              }}
              onMouseOver={(e) => { if (!loading) e.target.style.background = "#F9FAFB"; }}
              onMouseOut={(e) => { if (!loading) e.target.style.background = "#fff"; }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1, padding: "12px", borderRadius: 8,
                background: loading ? "#9CA3AF" : "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", fontWeight: 600, transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)", opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.35)";
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.25)";
                }
              }}
            >
              {loading ? "⏳ Menyimpan..." : "✓ Simpan Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
