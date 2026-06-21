import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import logo from "../assets/POSCO_LOGO_KITA.png";
import { api } from "../utils/api";
import { jsPDF } from "jspdf";

export default function KaderDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { success, error: errorNotify } = useNotification();
  const [activePage, setActivePage] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedIbu, setSelectedIbu] = useState(null);
  const [showIbuDetailModal, setShowIbuDetailModal] = useState(false);
  const [jadwalSesiState, setJadwalSesiState] = useState([]);
  const [selectedSesi, setSelectedSesi] = useState(null);
  const [showSesiDetailModal, setShowSesiDetailModal] = useState(false);
  const [rujukanState, setRujukanState] = useState([]);
  const [selectedRujukan, setSelectedRujukan] = useState(null);
  const [showEditRujukanModal, setShowEditRujukanModal] = useState(false);
  const [childrenData, setChildrenData] = useState([]);
  const [ibuHamilState, setIbuHamilState] = useState([]);
  const [posyandus, setPosyandus] = useState([]);
  const [usersState, setUsersState] = useState([]);
  const [showInputPemeriksaanModal, setShowInputPemeriksaanModal] = useState(false);
  const [childForInput, setChildForInput] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEditWargaModal, setShowEditWargaModal] = useState(false);
  const [selectedWargaToEdit, setSelectedWargaToEdit] = useState(null);
  const [wargaTypeToEdit, setWargaTypeToEdit] = useState("balita");

  const loadKaderData = useCallback(async () => {
    setLoading(true);
    try {
      const posList = await api.getPosyandus();
      setPosyandus(posList);

      const kids = await api.getChildren({}, posList);
      setChildrenData(kids);

      const pregs = await api.getPregnancies({}, posList);
      setIbuHamilState(pregs);

      const sessions = await api.getSessions({}, posList);
      setJadwalSesiState(sessions);

      const refs = await api.getReferrals();
      setRujukanState(refs);

      const uList = await api.getUsers();
      setUsersState(uList);
    } catch (err) {
      console.error("Gagal memuat data kader:", err);
      errorNotify("⚠️ Gagal memuat data dari server");
    } finally {
      setLoading(false);
    }
  }, [errorNotify]);

  useEffect(() => {
    loadKaderData();
  }, [loadKaderData]);

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
          {activePage === "dashboard" && <DashboardPage user={user} childrenData={childrenData} onInputClick={(child) => { setChildForInput(child); setShowInputPemeriksaanModal(true); }} childrenCount={childrenData.length} pregnanciesCount={ibuHamilState.length} sessionsList={jadwalSesiState} referralsList={rujukanState} />}
          {activePage === "data-warga" && (
            <DataWargaPage 
              childrenData={childrenData} 
              ibuHamilData={ibuHamilState} 
              setShowModal={setShowAddModal} 
              setSelectedChild={setSelectedChild} 
              setShowDetailModal={setShowDetailModal}
              setSelectedIbu={setSelectedIbu}
              setShowIbuDetailModal={setShowIbuDetailModal}
            />
          )}
          {activePage === "jadwal" && (
            <JadwalPage 
              jadwalSesi={jadwalSesiState} 
              onSelectSession={(sesi) => {
                setSelectedSesi(sesi);
                setShowSesiDetailModal(true);
              }} 
            />
          )}
          {activePage === "buat-sesi" && <BuatSesiPage setShowModal={setShowAddModal} />}
          {activePage === "tindak-lanjut" && (
            <TindakLanjutPage 
              rujukan={rujukanState} 
              onEditRujukan={(r) => { setSelectedRujukan(r); setShowEditRujukanModal(true); }} 
              childrenData={childrenData}
              ibuHamilData={ibuHamilState}
              onEditChild={(child) => {
                setWargaTypeToEdit("balita");
                setSelectedWargaToEdit(child);
                setShowEditWargaModal(true);
              }}
              onEditIbu={(ibu) => {
                setWargaTypeToEdit("ibu");
                setSelectedWargaToEdit(ibu);
                setShowEditWargaModal(true);
              }}
              onInputPemeriksaan={(child) => {
                setChildForInput(child);
                setShowInputPemeriksaanModal(true);
              }}
            />
          )}
          {activePage === "riwayat" && <RiwayatPage childrenData={childrenData} />}
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && selectedChild && (
        <DetailBalitaModal child={selectedChild} users={usersState} onClose={() => { setShowDetailModal(false); setSelectedChild(null); }} />
      )}
      {showIbuDetailModal && selectedIbu && (
        <DetailIbuHamilModal ibu={selectedIbu} onClose={() => { setShowIbuDetailModal(false); setSelectedIbu(null); }} />
      )}
      {showSesiDetailModal && selectedSesi && (
        <DetailSesiModal sesi={selectedSesi} onClose={() => { setShowSesiDetailModal(false); setSelectedSesi(null); }} />
      )}
      {showAddModal === "data-warga" && (
        <AddDataModal 
          onClose={() => setShowAddModal(null)} 
          onSave={async (type, data) => {
            try {
              if (type === "balita") {
                const created = await api.createChild(data, posyandus);
                setChildrenData([...childrenData, created]);
                success("✅ Data balita berhasil disimpan!");
              } else {
                const created = await api.createPregnancy(data, posyandus);
                setIbuHamilState([...ibuHamilState, created]);
                success("✅ Data ibu hamil berhasil disimpan!");
              }
              setShowAddModal(null);
            } catch (err) {
              errorNotify("⚠️ Gagal menyimpan data: " + err.message);
            }
          }}
        />
      )}
      {showAddModal === "buat-sesi" && (
        <BuatSesiModal 
          onClose={() => setShowAddModal(null)} 
          jadwalSesiState={jadwalSesiState}
          onSessionCreated={async (newSesi) => {
            try {
              const created = await api.createSession(newSesi, posyandus);
              setJadwalSesiState([...jadwalSesiState, created]);
              success("✅ Sesi berhasil dibuat! Jadwal telah ditambahkan ke sistem.");
            } catch (err) {
              errorNotify("⚠️ Gagal membuat sesi: " + err.message);
            }
          }}
        />
      )}
      {showEditRujukanModal && selectedRujukan && (
        <EditRujukanModal 
          rujukan={selectedRujukan}
          onClose={() => { setShowEditRujukanModal(false); setSelectedRujukan(null); }}
          onSave={async (updatedRujukan) => {
            try {
              const updated = await api.updateReferral(updatedRujukan.id, updatedRujukan);
              setRujukanState(rujukanState.map(r => r.id === updated.id ? updated : r));
              setShowEditRujukanModal(false);
              setSelectedRujukan(null);
              success("✅ Data tindak lanjut berhasil diperbarui!");
            } catch (err) {
              errorNotify("⚠️ Gagal memperbarui rujukan: " + err.message);
            }
          }}
        />
      )}
      {showInputPemeriksaanModal && childForInput && (
        <InputPemeriksaanModal
          child={childForInput}
          onClose={() => { setShowInputPemeriksaanModal(false); setChildForInput(null); }}
          onSave={async (updatedChild) => {
            try {
              const res = await api.updateChild(updatedChild.id, updatedChild, posyandus);
              setChildrenData(childrenData.map(c => c.id === res.id ? res : c));
              setShowInputPemeriksaanModal(false);
              setChildForInput(null);
              success("✅ Data pemeriksaan berhasil disimpan!");
            } catch (err) {
              errorNotify("⚠️ Gagal menyimpan pemeriksaan: " + err.message);
            }
          }}
        />
      )}
      {showEditWargaModal && selectedWargaToEdit && (
        <EditWargaModal
          type={wargaTypeToEdit}
          data={selectedWargaToEdit}
          onClose={() => { setShowEditWargaModal(false); setSelectedWargaToEdit(null); }}
          onSave={async (type, updatedData) => {
            try {
              if (type === "balita") {
                const res = await api.updateChild(updatedData.id, updatedData, posyandus);
                setChildrenData(childrenData.map(c => c.id === res.id ? res : c));
                success("✅ Data balita berhasil diperbarui!");
              } else {
                const res = await api.updatePregnancy(updatedData.id, updatedData, posyandus);
                setIbuHamilState(ibuHamilState.map(i => i.id === res.id ? res : i));
                success("✅ Data ibu hamil berhasil diperbarui!");
              }
              setShowEditWargaModal(false);
              setSelectedWargaToEdit(null);
            } catch (err) {
              errorNotify("⚠️ Gagal memperbarui data: " + err.message);
            }
          }}
        />
      )}
    </div>
  );
}

function DashboardPage({ user, childrenData, onInputClick, childrenCount, pregnanciesCount, sessionsList, referralsList }) {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Aggregate Nutrition Status & Gender
  const nutStats = { "Normal": 0, "Gizi Kurang": 0, "Gizi Lebih": 0, "Stunting": 0 };
  let maleCount = 0;
  let femaleCount = 0;
  
  childrenData.forEach(c => {
    const status = (c.statusGizi || "Normal").trim();
    if (status === "Normal") {
      nutStats["Normal"]++;
    } else if (status === "Gizi Kurang" || status === "Berisiko" || status === "Beresiko") {
      nutStats["Gizi Kurang"]++;
    } else if (status === "Gizi Lebih" || status === "Obesitas") {
      nutStats["Gizi Lebih"]++;
    } else if (status === "Stunting") {
      nutStats["Stunting"]++;
    } else {
      const lower = status.toLowerCase();
      if (lower.includes("normal")) {
        nutStats["Normal"]++;
      } else if (lower.includes("kurang") || lower.includes("risiko") || lower.includes("berisiko") || lower.includes("beresiko")) {
        nutStats["Gizi Kurang"]++;
      } else if (lower.includes("lebih") || lower.includes("obesitas")) {
        nutStats["Gizi Lebih"]++;
      } else if (lower.includes("stunting")) {
        nutStats["Stunting"]++;
      } else {
        nutStats["Normal"]++;
      }
    }

    if (c.jenisKelamin === "P" || c.jenisKelamin === "Perempuan") {
      femaleCount++;
    } else {
      maleCount++;
    }
  });

  const maxVal = Math.max(1, ...Object.values(nutStats));
  const bars = Object.entries(nutStats).map(([label, val], i) => {
    const barHeight = (val / maxVal) * 140;
    const x = 50 + i * 90;
    const y = 170 - barHeight;
    const colors = [
      "url(#greenGrad)",  // Normal
      "url(#orangeGrad)", // Gizi Kurang
      "url(#redGrad)",    // Gizi Lebih
      "url(#purpleGrad)"  // Stunting
    ];
    return { label, val, x, y, height: barHeight, color: colors[i] };
  });

  const totalGender = maleCount + femaleCount;
  const malePercent = totalGender > 0 ? (maleCount / totalGender) : 0.5;
  const femalePercent = totalGender > 0 ? (femaleCount / totalGender) : 0.5;
  
  const radius = 55;
  const circ = 2 * Math.PI * radius; // 345.575
  const maleStroke = circ * malePercent;
  const femaleStroke = circ * femalePercent;

  // Sessions attendance trend (last 6 sessions)
  const sortedSessions = [...sessionsList]
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
    .slice(-6);

  const chartSessions = sortedSessions;

  const trendWidth = 550;
  const trendHeight = 220;
  const padding = 35;
  const chartW = trendWidth - 2 * padding;
  const chartH = trendHeight - 2 * padding;
  
  const maxAttendance = Math.max(12, ...chartSessions.map(s => s.jumlahHadir || 0));
  
  const points = chartSessions.map((s, idx) => {
    const x = padding + (idx / Math.max(1, chartSessions.length - 1)) * chartW;
    const y = padding + chartH - ((s.jumlahHadir || 0) / maxAttendance) * chartH;
    return {
      x,
      y,
      val: s.jumlahHadir || 0,
      label: new Date(s.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      posyandu: s.posyandu || "Posyandu"
    };
  });
  
  const linePath = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${padding + chartH} L ${points[0].x} ${padding + chartH} Z`
    : "";

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
          📍 {user?.posyandu || user?.wilayah || "Posyandu Melati"} • {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Grid containing Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24, marginBottom: 24 }}>
        {/* Nutrition Status Bar Chart */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #E5E7EB",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)"
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
            📊 Status Gizi Balita
          </h3>
          <div style={{ position: "relative" }}>
            <svg width="100%" height={220} viewBox="0 0 420 220">
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#B91C1C" />
                </linearGradient>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#6D28D9" />
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = 30 + ratio * 130;
                const gridVal = Math.round(maxVal * (1 - ratio));
                return (
                  <g key={idx}>
                    <line x1="45" y1={y} x2={400} y2={y} stroke="#E5E7EB" strokeDasharray="3 3" />
                    <text x="35" y={y + 4} textAnchor="end" style={{ fontSize: 10, fill: "#9CA3AF" }}>{gridVal}</text>
                  </g>
                );
              })}
              
              {/* Bars */}
              {bars.map((bar, idx) => {
                const isHovered = hoveredBar === idx;
                return (
                  <g
                    key={idx}
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <rect
                      x={bar.x}
                      y={bar.y}
                      width="40"
                      height={Math.max(4, bar.height)}
                      rx="6"
                      ry="6"
                      fill={bar.color}
                      opacity={hoveredBar === null || isHovered ? 1 : 0.7}
                      style={{ transition: "all 0.3s ease" }}
                    />
                    <text
                      x={bar.x + 20}
                      y={bar.y - 8}
                      textAnchor="middle"
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        fill: isHovered ? "#111827" : "#4B5563",
                        transition: "all 0.2s ease",
                        opacity: bar.val > 0 || isHovered ? 1 : 0
                      }}
                    >
                      {bar.val}
                    </text>
                    <text
                      x={bar.x + 20}
                      y="190"
                      textAnchor="middle"
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        fill: isHovered ? "#111827" : "#6B7280"
                      }}
                    >
                      {bar.label.split(" ")[0]}
                    </text>
                    <text
                      x={bar.x + 20}
                      y="205"
                      textAnchor="middle"
                      style={{
                        fontSize: 8,
                        fill: "#9CA3AF"
                      }}
                    >
                      {bar.label.split(" ").slice(1).join(" ")}
                    </text>
                  </g>
                );
              })}
              <line x1="45" y1="170" x2={400} y2="170" stroke="#9CA3AF" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Gender Distribution Donut Chart */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #E5E7EB",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16, width: "100%", textAlign: "left" }}>
            👫 Distribusi Gender Balita
          </h3>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>
            <div style={{ position: "relative", width: 140, height: 140 }}>
              <svg width="100%" height="100%" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke="#E5E7EB"
                  strokeWidth="20"
                />
                {totalGender > 0 && (
                  <>
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="transparent"
                      stroke="#3B82F6"
                      strokeWidth="20"
                      strokeDasharray={`${maleStroke} ${circ}`}
                      strokeDashoffset="0"
                      transform="rotate(-90 100 100)"
                      style={{ transition: "stroke-dasharray 0.5s ease" }}
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="transparent"
                      stroke="#EC4899"
                      strokeWidth="20"
                      strokeDasharray={`${femaleStroke} ${circ}`}
                      strokeDashoffset={-maleStroke}
                      transform="rotate(-90 100 100)"
                      style={{ transition: "stroke-dasharray 0.5s ease" }}
                    />
                  </>
                )}
                <circle cx="100" cy="100" r="45" fill="#fff" />
                <text x="100" y="92" textAnchor="middle" style={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600 }}>TOTAL</text>
                <text x="100" y="118" textAnchor="middle" style={{ fontSize: 24, fill: "#111827", fontWeight: 800 }}>{totalGender}</text>
              </svg>
            </div>
            
            <div style={{ display: "flex", width: "100%", justifyContent: "space-around", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#3B82F6" }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
                    {maleCount} <span style={{ fontSize: 11, fontWeight: 500, color: "#6B7280" }}>({totalGender > 0 ? Math.round((maleCount / totalGender) * 100) : 0}%)</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>Laki-laki</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EC4899" }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
                    {femaleCount} <span style={{ fontSize: 11, fontWeight: 500, color: "#6B7280" }}>({totalGender > 0 ? Math.round((femaleCount / totalGender) * 100) : 0}%)</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>Perempuan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session attendance trends */}
      <div style={{
        background: "#fff",
        borderRadius: 16,
        padding: 24,
        border: "1px solid #E5E7EB",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
        marginBottom: 24
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
          📈 Tren Kehadiran Sesi Posyandu (6 Sesi Terakhir)
        </h3>
        <div style={{ position: "relative" }}>
          {chartSessions.length > 0 ? (
            <svg width="100%" height={220} viewBox={`0 0 ${trendWidth} ${trendHeight}`}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Horizontal dashed lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = padding + ratio * chartH;
                const gridVal = Math.round(maxAttendance * (1 - ratio));
                return (
                  <g key={idx}>
                    <line x1={padding} y1={y} x2={trendWidth - padding} y2={y} stroke="#E5E7EB" strokeDasharray="3 3" />
                    <text x={padding - 10} y={y + 4} textAnchor="end" style={{ fontSize: 10, fill: "#9CA3AF" }}>{gridVal}</text>
                  </g>
                );
              })}
              
              {/* Area fill */}
              {areaPath && (
                <path d={areaPath} fill="url(#areaGrad)" />
              )}
              
              {/* Line */}
              {linePath && (
                <path d={linePath} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              )}
              
              {/* Points */}
              {points.map((p, idx) => {
                const isHovered = hoveredPoint === idx;
                return (
                  <g
                    key={idx}
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 10 : 0}
                      fill="#10B981"
                      opacity="0.3"
                      style={{ transition: "r 0.2s ease" }}
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 6 : 4}
                      fill="#fff"
                      stroke="#10B981"
                      strokeWidth="3"
                      style={{ transition: "all 0.2s ease" }}
                    />
                    <text
                      x={p.x}
                      y={p.y - 12}
                      textAnchor="middle"
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        fill: "#047857",
                        opacity: isHovered ? 1 : 0,
                        transition: "opacity 0.2s ease"
                      }}
                    >
                      {p.val} Anak
                    </text>
                    <text
                      x={p.x}
                      y={padding + chartH + 18}
                      textAnchor="middle"
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        fill: isHovered ? "#111827" : "#6B7280"
                      }}
                    >
                      {p.label}
                    </text>
                    <text
                      x={p.x}
                      y={padding + chartH + 30}
                      textAnchor="middle"
                      style={{
                        fontSize: 8,
                        fill: "#9CA3AF"
                      }}
                    >
                      {p.posyandu}
                    </text>
                  </g>
                );
              })}
            </svg>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 220,
              background: "#F9FAFB",
              borderRadius: 12,
              border: "1px dashed #E5E7EB",
              color: "#6B7280",
              fontSize: 14
            }}>
              📅 Belum ada data sesi posyandu di database
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DataWargaPage({ 
  childrenData, 
  ibuHamilData, 
  setSelectedChild, 
  setShowDetailModal,
  setSelectedIbu,
  setShowIbuDetailModal
}) {
  const [tab, setTab] = useState("balita");
  
  const handleViewDetail = (child) => {
    setSelectedChild(child);
    setShowDetailModal(true);
  };

  const handleViewIbuDetail = (ibu) => {
    setSelectedIbu(ibu);
    setShowIbuDetailModal(true);
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
            {(tab === "balita" ? childrenData : ibuHamilData).slice(0, 5).map((item, i) => (
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
                    <button 
                      onClick={() => handleViewIbuDetail(item)}
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

function JadwalPage({ jadwalSesi, onSelectSession }) {
  // Helper to determine if a session has passed (before today's local date)
  const getSessionStatus = (j) => {
    if (!j.tanggal) return "Mendatang";
    const parts = j.tanggal.split('-');
    if (parts.length !== 3) return "Mendatang";
    const sessionDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (sessionDate < today) {
      return "Sudah Berlalu";
    }
    return j.status || "Mendatang";
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: 24,
      border: "1px solid #E5E7EB",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {jadwalSesi.map(j => {
          const isPast = getSessionStatus(j) === "Sudah Berlalu";
          const cardBg = isPast 
            ? "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)" 
            : "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)";
          const cardBorder = isPast ? "1px solid #E5E7EB" : "1px solid #DCFCE7";
          const titleColor = isPast ? "#4B5563" : "#16A34A";
          const badgeBg = isPast ? "#E5E7EB" : "#DCFCE7";
          const badgeColor = isPast ? "#4B5563" : "#16A34A";
          const displayStatus = isPast ? "Sudah Berlalu" : j.status;

          return (
            <div 
              key={j.id} 
              onClick={() => onSelectSession && onSelectSession(j)}
              style={{
                background: cardBg,
                borderRadius: 12,
                padding: 20,
                border: cardBorder,
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.06)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: titleColor, marginBottom: 8 }}>
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
                background: badgeBg,
                color: badgeColor,
                fontWeight: 600
              }}>
                {displayStatus}
              </span>
            </div>
          );
        })}
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

function TindakLanjutPage({ 
  rujukan, 
  onEditRujukan, 
  childrenData = [], 
  ibuHamilData = [], 
  onEditChild, 
  onEditIbu,
  onInputPemeriksaan
}) {
  const [tab, setTab] = useState("rujukan");

  const getStatusColor = (status) => {
    const s = (status || "Normal").toLowerCase();
    if (s.includes("normal")) return { bg: "#F0FDF4", color: "#16A34A" };
    if (s.includes("kurang") || s.includes("risiko") || s.includes("berisiko") || s.includes("beresiko")) return { bg: "#FFFBEB", color: "#D97706" };
    if (s.includes("lebih") || s.includes("stunting") || s.includes("buruk") || s.includes("obesitas")) return { bg: "#FEF2F2", color: "#EF4444" };
    return { bg: "#F3F4F6", color: "#6B7280" };
  };

  return (
    <div>
      {/* Tab Selectors */}
      <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 24,
        background: "#F3F4F6",
        padding: 4,
        borderRadius: 10,
        width: "fit-content"
      }}>
        {[
          { id: "rujukan", label: "📋 Rujukan Sesi" },
          { id: "balita", label: "👶 Data Balita" },
          { id: "ibu", label: "🤰 Data Ibu Hamil" }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: tab === t.id ? "#fff" : "transparent",
              color: tab === t.id ? "#16A34A" : "#6B7280",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: tab === t.id ? "0 2px 4px rgba(0,0,0,0.08)" : "none"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{
        background: "#fff",
        borderRadius: 12,
        padding: 24,
        border: "1px solid #E5E7EB",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
      }}>
        {/* Tab 1: Rujukan */}
        {tab === "rujukan" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rujukan.length > 0 ? (
              rujukan.slice(0, 8).map((r, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px",
                  borderRadius: 8,
                  background: "#F9FAFB",
                  borderBottom: "1px solid #F3F4F6",
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
              ))
            ) : (
              <div style={{ padding: 32, textAlign: "center", color: "#9CA3AF" }}>
                📋 Belum ada data rujukan tindak lanjut
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Balita */}
        {tab === "balita" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {childrenData.length > 0 ? (
              childrenData.map((c, i) => {
                const statusColors = getStatusColor(c.statusGizi);
                return (
                  <div key={c.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px",
                    borderRadius: 8,
                    background: "#F9FAFB",
                    borderBottom: "1px solid #F3F4F6",
                    transition: "all 0.2s ease"
                  }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#F3F4F6"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#F9FAFB"}
                  >
                    <div style={{ fontSize: 24, flexShrink: 0 }}>{c.jenisKelamin === "P" ? "👧" : "👦"}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{c.nama}</div>
                      <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>Ibu: {c.namaIbu || "-"} • Lahir: {new Date(c.tanggalLahir).toLocaleDateString("id-ID")}</div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>BB: {c.beratBadan} kg • TB: {c.tinggiBadan} cm</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{
                        fontSize: 11,
                        padding: "4px 12px",
                        borderRadius: 20,
                        background: statusColors.bg,
                        color: statusColors.color,
                        fontWeight: 600
                      }}>
                        {c.statusGizi}
                      </span>
                      <button
                        onClick={() => onInputPemeriksaan && onInputPemeriksaan(c)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#16A34A",
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 600,
                          transition: "all 0.2s ease",
                          padding: "4px 8px"
                        }}
                        onMouseOver={(e) => {
                          e.target.style.color = "#15803D";
                          e.target.style.textDecoration = "underline";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.color = "#16A34A";
                          e.target.style.textDecoration = "none";
                        }}
                      >
                        ➕ Pemeriksaan
                      </button>
                      <button
                        onClick={() => onEditChild(c)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#F59E0B",
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 600,
                          transition: "all 0.2s ease",
                          padding: "4px 8px"
                        }}
                        onMouseOver={(e) => {
                          e.target.style.color = "#D97706";
                          e.target.style.textDecoration = "underline";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.color = "#F59E0B";
                          e.target.style.textDecoration = "none";
                        }}
                      >
                        📝 Edit
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: 32, textAlign: "center", color: "#9CA3AF" }}>
                👶 Belum ada data balita
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Ibu Hamil */}
        {tab === "ibu" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ibuHamilData.length > 0 ? (
              ibuHamilData.map((ibu, i) => {
                return (
                  <div key={ibu.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px",
                    borderRadius: 8,
                    background: "#F9FAFB",
                    borderBottom: "1px solid #F3F4F6",
                    transition: "all 0.2s ease"
                  }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#F3F4F6"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#F9FAFB"}
                  >
                    <div style={{ fontSize: 24, flexShrink: 0 }}>🤰</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{ibu.nama}</div>
                      <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>Usia Kehamilan: {ibu.usiaKehamilan} minggu • Tensi: {ibu.tekananDarah || "-"}</div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>Usia Ibu: {ibu.usia} tahun • BB: {ibu.beratBadan} kg</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{
                        fontSize: 11,
                        padding: "4px 12px",
                        borderRadius: 20,
                        background: ibu.risikoTinggi ? "#FEF2F2" : "#F0FDF4",
                        color: ibu.risikoTinggi ? "#EF4444" : "#16A34A",
                        fontWeight: 600
                      }}>
                        {ibu.risikoTinggi ? "⚠️ Risiko Tinggi" : "✅ Normal"}
                      </span>
                      <button
                        onClick={() => onEditIbu(ibu)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#F59E0B",
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 600,
                          transition: "all 0.2s ease",
                          padding: "4px 8px"
                        }}
                        onMouseOver={(e) => {
                          e.target.style.color = "#D97706";
                          e.target.style.textDecoration = "underline";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.color = "#F59E0B";
                          e.target.style.textDecoration = "none";
                        }}
                      >
                        📝 Edit
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: 32, textAlign: "center", color: "#9CA3AF" }}>
                🤰 Belum ada data ibu hamil
              </div>
            )}
          </div>
        )}
      </div>
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
    ["Nama", child.nama || "-"],
    ["Jenis Kelamin", child.jenisKelamin === "P" ? "Perempuan" : "Laki-laki"],
    ["Tanggal Lahir", child.tanggalLahir ? new Date(child.tanggalLahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"],
    ["Berat Badan", `${child.beratBadan ?? 0} kg`],
    ["Tinggi Badan", `${child.tinggiBadan ?? 0} cm`],
    ["Status Gizi", child.statusGizi || "-"],
    ["Status Stunting", child.statusStunting || "-"],
    ["Posyandu", child.posyandu || "-"],
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
      ["Nama", parentInfo.name || "-"],
      ["Email", parentInfo.email || "-"],
      ["Wilayah", parentInfo.wilayah || "-"],
    ];
    parentData.forEach(([label, value]) => {
      doc.text(`${label}:`, 20, yPosition);
      doc.text(value, 70, yPosition);
      yPosition += 6;
    });
  } else {
    doc.text("Data orang tua tidak tersedia", 20, yPosition);
    yPosition += 6;
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
        r.tanggal ? new Date(r.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-",
        r.bb?.toString() ?? "-",
        r.tb?.toString() ?? "-",
        r.lingkarKepala?.toString() ?? "-",
        r.lingkarLengan?.toString() ?? "-",
        r.statusGizi || "-"
      ]);
    });
  } else {
    tableData.push(["-", "-", "-", "-", "-", "Tidak ada data"]);
  }

  // Draw Manual Table
  const colWidths = [35, 20, 20, 35, 35, 25];
  const colPositions = [];
  let currentX = 20;
  for (let i = 0; i < colWidths.length; i++) {
    colPositions.push(currentX);
    currentX += colWidths[i];
  }

  // Draw Header
  const headerHeight = 8;
  doc.setFillColor(...primaryColor);
  doc.rect(20, yPosition, 170, headerHeight, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, "bold");
  doc.setFontSize(9);
  
  const headers = ["Tanggal", "BB (kg)", "TB (cm)", "L. Kepala (cm)", "L. Lengan (cm)", "Status Gizi"];
  headers.forEach((header, index) => {
    const x = colPositions[index] + colWidths[index] / 2;
    doc.text(header, x, yPosition + 5.5, { align: "center" });
  });
  
  yPosition += headerHeight;

  // Draw Rows
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, "normal");
  
  const rowHeight = 7;
  const pageHeight = doc.internal.pageSize.getHeight();
  const rows = tableData.slice(1);

  rows.forEach((row) => {
    if (yPosition + rowHeight > pageHeight - 25) {
      doc.addPage();
      yPosition = 20;
      
      // Draw Header again
      doc.setFillColor(...primaryColor);
      doc.rect(20, yPosition, 170, headerHeight, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, "bold");
      headers.forEach((header, index) => {
        const x = colPositions[index] + colWidths[index] / 2;
        doc.text(header, x, yPosition + 5.5, { align: "center" });
      });
      yPosition += headerHeight;
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "normal");
    }

    // Border line under row
    doc.setDrawColor(229, 231, 235);
    doc.line(20, yPosition + rowHeight, 190, yPosition + rowHeight);

    row.forEach((cellValue, index) => {
      const x = colPositions[index] + colWidths[index] / 2;
      doc.text(cellValue, x, yPosition + 5, { align: "center" });
    });
    
    yPosition += rowHeight;
  });

  // Tanggal cetak
  doc.setFontSize(8);
  doc.setTextColor(150);
  let printY = yPosition + 15;
  if (printY > pageHeight - 20) {
    doc.addPage();
    printY = 30;
  }
  doc.text(`Dicetak pada: ${new Date().toLocaleDateString("id-ID")}`, 20, printY);

  // Add Page Numbers to all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      doc.internal.pageSize.getWidth() / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // Download
  const safeFilename = (child.nama || "Balita").replace(/\s/g, "-");
  doc.save(`Laporan-${safeFilename}.pdf`);
}

function DetailBalitaModal({ child, onClose, users = [] }) {
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

function AddDataModal({ onClose, onSave }) {
  const [dataType, setDataType] = useState("balita");
  const [balitaForm, setBalitaForm] = useState({
    nama: "",
    namaIbu: "",
    tanggalLahir: new Date().toISOString().split("T")[0],
    jenisKelamin: "L",
    beratBadan: "",
    tinggiBadan: ""
  });
  const [ibuForm, setIbuForm] = useState({
    nama: "",
    tanggalLahir: new Date().toISOString().split("T")[0],
    usiaKehamilan: "",
    tekananDarah: "",
    beratBadan: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dataType === "balita") {
      if (!balitaForm.nama.trim()) return alert("Nama Balita harus diisi");
      onSave("balita", {
        nama: balitaForm.nama,
        namaIbu: balitaForm.namaIbu,
        tanggalLahir: balitaForm.tanggalLahir,
        jenisKelamin: balitaForm.jenisKelamin,
        beratLahir: parseFloat(balitaForm.beratBadan) || 0,
        beratBadan: parseFloat(balitaForm.beratBadan) || 0,
        tinggiBadan: parseFloat(balitaForm.tinggiBadan) || 0,
        statusGizi: "Normal",
        statusStunting: "Tidak Stunting",
        imunisasi: { bcg: false, hb0: false, polio: false, dpt1: false, dpt2: false, campak: false },
        riwayatPemeriksaan: []
      });
    } else {
      if (!ibuForm.nama.trim()) return alert("Nama Ibu harus diisi");
      onSave("ibu", {
        nama: ibuForm.nama,
        usia: 25,
        usiaKehamilan: parseInt(ibuForm.usiaKehamilan) || 0,
        hpht: ibuForm.tanggalLahir,
        taksirPersalinan: new Date().toISOString().split("T")[0],
        tekananDarah: ibuForm.tekananDarah,
        beratBadan: parseFloat(ibuForm.beratBadan) || 0,
        risikoTinggi: false
      });
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none",
    boxSizing: "border-box", fontFamily: "inherit",
    transition: "all 0.3s ease", background: "#fff"
  };

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

        <form onSubmit={handleSubmit}>
          {/* Form */}
          {dataType === "balita" ? (
            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>NAMA BALITA</label>
                <input style={inputStyle} value={balitaForm.nama} onChange={e => setBalitaForm({...balitaForm, nama: e.target.value})} placeholder="Masukkan nama balita" required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>NAMA IBU</label>
                <input style={inputStyle} value={balitaForm.namaIbu} onChange={e => setBalitaForm({...balitaForm, namaIbu: e.target.value})} placeholder="Masukkan nama ibu" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>TANGGAL LAHIR</label>
                <input type="date" style={inputStyle} value={balitaForm.tanggalLahir} onChange={e => setBalitaForm({...balitaForm, tanggalLahir: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>JENIS KELAMIN</label>
                <select style={inputStyle} value={balitaForm.jenisKelamin} onChange={e => setBalitaForm({...balitaForm, jenisKelamin: e.target.value})}>
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>BERAT BADAN (KG)</label>
                <input type="number" step="0.1" style={inputStyle} value={balitaForm.beratBadan} onChange={e => setBalitaForm({...balitaForm, beratBadan: e.target.value})} placeholder="Masukkan berat badan" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>TINGGI BADAN (CM)</label>
                <input type="number" step="0.1" style={inputStyle} value={balitaForm.tinggiBadan} onChange={e => setBalitaForm({...balitaForm, tinggiBadan: e.target.value})} placeholder="Masukkan tinggi badan" />
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>NAMA IBU HAMIL</label>
                <input style={inputStyle} value={ibuForm.nama} onChange={e => setIbuForm({...ibuForm, nama: e.target.value})} placeholder="Masukkan nama ibu hamil" required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>TANGGAL LAHIR / HPHT</label>
                <input type="date" style={inputStyle} value={ibuForm.tanggalLahir} onChange={e => setIbuForm({...ibuForm, tanggalLahir: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>USIA KEHAMILAN (MINGGU)</label>
                <input type="number" style={inputStyle} value={ibuForm.usiaKehamilan} onChange={e => setIbuForm({...ibuForm, usiaKehamilan: e.target.value})} placeholder="Masukkan usia kehamilan" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>TEKANAN DARAH</label>
                <input style={inputStyle} value={ibuForm.tekananDarah} onChange={e => setIbuForm({...ibuForm, tekananDarah: e.target.value})} placeholder="Masukkan tekanan darah (misal: 120/80)" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>BERAT BADAN (KG)</label>
                <input type="number" step="0.1" style={inputStyle} value={ibuForm.beratBadan} onChange={e => setIbuForm({...ibuForm, beratBadan: e.target.value})} placeholder="Masukkan berat badan" />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #E5E7EB",
              background: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
              transition: "all 0.2s ease"
            }}
              onMouseOver={(e) => { e.target.style.background = "#F9FAFB"; }}
              onMouseOut={(e) => { e.target.style.background = "#fff"; }}
            >
              Batal
            </button>
            <button type="submit" style={{
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
        </form>
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
  const { error: errorNotify } = useNotification();
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

function DetailSesiModal({ sesi, onClose }) {
  // Helper to determine if a session has passed (before today's local date)
  const getSessionStatus = (j) => {
    if (!j.tanggal) return "Mendatang";
    const parts = j.tanggal.split('-');
    if (parts.length !== 3) return "Mendatang";
    const sessionDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (sessionDate < today) {
      return "Sudah Berlalu";
    }
    return j.status || "Mendatang";
  };

  const isPast = getSessionStatus(sesi) === "Sudah Berlalu";
  const badgeBg = isPast ? "#E5E7EB" : "#DCFCE7";
  const badgeColor = isPast ? "#4B5563" : "#16A34A";
  const displayStatus = isPast ? "Sudah Berlalu" : (sesi.status || "Mendatang");

  // Format date nicely
  const formattedDate = new Date(sesi.tanggal).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 500,
        padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <span style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 20,
              background: badgeBg,
              color: badgeColor,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              display: "inline-block",
              marginBottom: 8
            }}>
              {displayStatus}
            </span>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "#111827", lineHeight: 1.3 }}>
              {sesi.nama || "Sesi Pemeriksaan Kesehatan"}
            </h2>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer", color: "#9CA3AF", padding: 0 }}>✕</button>
        </div>

        {/* Content Details */}
        <div style={{ display: "grid", gap: 16, marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>🏥</span>
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>POSYANDU</div>
              <div style={{ fontSize: 14, color: "#374151", fontWeight: 700 }}>{sesi.posyandu}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>📅</span>
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>TANGGAL</div>
              <div style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>{formattedDate}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>⏰</span>
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>WAKTU</div>
              <div style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>{sesi.waktu} WIB</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>👤</span>
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>KADER PENANGGUNG JAWAB (PJ)</div>
              <div style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>{sesi.kader || "Kader Posyandu"}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>👥</span>
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>JUMLAH KEHADIRAN</div>
              <div style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>{sesi.jumlahHadir} Balita</div>
            </div>
          </div>

          {sesi.deskripsi && (
            <div style={{
              background: "#F9FAFB",
              border: "1px solid #F3F4F6",
              borderRadius: 10,
              padding: 16,
              marginTop: 8
            }}>
              <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, marginBottom: 4 }}>CATATAN / KETERANGAN</div>
              <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.5 }}>{sesi.deskripsi}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "12px", borderRadius: 8, border: "none",
            background: isPast ? "#6B7280" : "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
            color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
            transition: "all 0.2s ease",
            boxShadow: isPast ? "0 4px 12px rgba(107, 114, 128, 0.2)" : "0 4px 12px rgba(22, 163, 74, 0.25)"
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
          }}
        >
          Tutup Detail
        </button>
      </div>
    </div>
  );
}

function InputPemeriksaanModal({ child, onClose, onSave }) {
  const { error: errorNotify } = useNotification();
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

function DetailIbuHamilModal({ ibu, onClose }) {
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
        maxWidth: 600,
        padding: 32,
        maxHeight: "90vh",
        overflow: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#111827" }}>
              🤰 {ibu.nama}
            </h2>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "8px 0 0" }}>
              Status Risiko: {ibu.risikoTinggi ? "⚠️ Risiko Tinggi" : "✅ Normal / Risiko Rendah"}
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

        {/* Info Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 16, textTransform: "uppercase" }}>Informasi Ibu</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["Nama", ibu.nama],
                ["Usia Ibu", `${ibu.usia || 25} tahun`],
                ["Posyandu", ibu.posyandu || "-"],
              ].map(([label, value], i) => (
                <div key={i}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginTop: 4 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 16, textTransform: "uppercase" }}>Kondisi Kehamilan</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["Usia Kehamilan", `${ibu.usiaKehamilan || 0} minggu`, "#3B82F6"],
                ["Tekanan Darah", ibu.tekananDarah || "-", "#8B5CF6"],
                ["Berat Badan", `${ibu.beratBadan || 0} kg`, "#10B981"],
              ].map(([label, value, color], i) => (
                <div key={i} style={{ padding: 12, background: "#F9FAFB", borderLeft: `4px solid ${color}`, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: color, marginTop: 4 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 16, textTransform: "uppercase" }}>Detail Persalinan</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, background: "#F9FAFB", padding: 16, borderRadius: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>HPHT (Hari Pertama Haid Terakhir)</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginTop: 4 }}>
                  {ibu.hpht ? new Date(ibu.hpht).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Taksiran Persalinan (HPL)</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#EF4444", marginTop: 4 }}>
                  {ibu.taksirPersalinan ? new Date(ibu.taksirPersalinan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 32, paddingTop: 24, borderTop: "1px solid #E5E7EB" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 8,
              background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)"
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
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function EditWargaModal({ type, data, onClose, onSave }) {
  const { error: errorNotify } = useNotification();
  const [loading, setLoading] = useState(false);
  
  const [balitaForm, setBalitaForm] = useState({
    id: data.id,
    nama: data.nama || "",
    namaIbu: data.namaIbu || "",
    tanggalLahir: data.tanggalLahir || "",
    jenisKelamin: data.jenisKelamin || "L",
    beratLahir: data.beratLahir || 0,
    beratBadan: data.beratBadan || "",
    tinggiBadan: data.tinggiBadan || "",
    statusGizi: data.statusGizi || "Normal",
    statusStunting: data.statusStunting || "Tidak Stunting",
    imunisasi: data.imunisasi || { bcg: false, hb0: false, polio: false, dpt1: false, dpt2: false, campak: false },
    riwayatPemeriksaan: data.riwayatPemeriksaan || [],
    orangtuaId: data.orangtuaId || ""
  });

  const [ibuForm, setIbuForm] = useState({
    id: data.id,
    nama: data.nama || "",
    usia: data.usia || 25,
    usiaKehamilan: data.usiaKehamilan || "",
    hpht: data.hpht || "",
    taksirPersalinan: data.taksirPersalinan || "",
    tekananDarah: data.tekananDarah || "",
    beratBadan: data.beratBadan || "",
    posyanduId: data.posyanduId || "",
    risikoTinggi: data.risikoTinggi || false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === "balita") {
        if (!balitaForm.nama.trim()) {
          errorNotify("⚠️ Nama Balita tidak boleh kosong!");
          setLoading(false);
          return;
        }
        await onSave("balita", {
          ...balitaForm,
          beratBadan: parseFloat(balitaForm.beratBadan) || 0,
          tinggiBadan: parseFloat(balitaForm.tinggiBadan) || 0,
          beratLahir: parseFloat(balitaForm.beratLahir) || 0
        });
      } else {
        if (!ibuForm.nama.trim()) {
          errorNotify("⚠️ Nama Ibu tidak boleh kosong!");
          setLoading(false);
          return;
        }
        await onSave("ibu", {
          ...ibuForm,
          usia: parseInt(ibuForm.usia) || 25,
          usiaKehamilan: parseInt(ibuForm.usiaKehamilan) || 0,
          beratBadan: parseFloat(ibuForm.beratBadan) || 0
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none",
    boxSizing: "border-box", fontFamily: "inherit",
    transition: "all 0.3s ease", background: "#fff"
  };

  const statusGiziOptions = ["Normal", "Gizi Kurang", "Gizi Lebih", "Stunting"];
  const statusStuntingOptions = ["Tidak Stunting", "Stunting", "Indikasi Stunting"];

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
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Edit Data {type === "balita" ? "Balita" : "Ibu Hamil"}</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer", color: "#9CA3AF" }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {type === "balita" ? (
            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>NAMA BALITA</label>
                <input style={inputStyle} value={balitaForm.nama} onChange={e => setBalitaForm({...balitaForm, nama: e.target.value})} required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>NAMA IBU</label>
                <input style={inputStyle} value={balitaForm.namaIbu} onChange={e => setBalitaForm({...balitaForm, namaIbu: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>TANGGAL LAHIR</label>
                <input type="date" style={inputStyle} value={balitaForm.tanggalLahir} onChange={e => setBalitaForm({...balitaForm, tanggalLahir: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>JENIS KELAMIN</label>
                <select style={inputStyle} value={balitaForm.jenisKelamin} onChange={e => setBalitaForm({...balitaForm, jenisKelamin: e.target.value})}>
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>BERAT BADAN (KG)</label>
                  <input type="number" step="0.1" style={inputStyle} value={balitaForm.beratBadan} onChange={e => setBalitaForm({...balitaForm, beratBadan: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>TINGGI BADAN (CM)</label>
                  <input type="number" step="0.1" style={inputStyle} value={balitaForm.tinggiBadan} onChange={e => setBalitaForm({...balitaForm, tinggiBadan: e.target.value})} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>STATUS GIZI</label>
                <select style={inputStyle} value={balitaForm.statusGizi} onChange={e => setBalitaForm({...balitaForm, statusGizi: e.target.value})}>
                  {statusGiziOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>STATUS STUNTING</label>
                <select style={inputStyle} value={balitaForm.statusStunting} onChange={e => setBalitaForm({...balitaForm, statusStunting: e.target.value})}>
                  {statusStuntingOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>NAMA IBU HAMIL</label>
                <input style={inputStyle} value={ibuForm.nama} onChange={e => setIbuForm({...ibuForm, nama: e.target.value})} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>USIA IBU (TAHUN)</label>
                  <input type="number" style={inputStyle} value={ibuForm.usia} onChange={e => setIbuForm({...ibuForm, usia: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>USIA KEHAMILAN (MINGGU)</label>
                  <input type="number" style={inputStyle} value={ibuForm.usiaKehamilan} onChange={e => setIbuForm({...ibuForm, usiaKehamilan: e.target.value})} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>HPHT / TANGGAL LAHIR</label>
                  <input type="date" style={inputStyle} value={ibuForm.hpht} onChange={e => setIbuForm({...ibuForm, hpht: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>HPL (TAKDIR PERSALINAN)</label>
                  <input type="date" style={inputStyle} value={ibuForm.taksirPersalinan} onChange={e => setIbuForm({...ibuForm, taksirPersalinan: e.target.value})} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>TEKANAN DARAH</label>
                  <input style={inputStyle} value={ibuForm.tekananDarah} onChange={e => setIbuForm({...ibuForm, tekananDarah: e.target.value})} placeholder="Misal: 120/80" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>BERAT BADAN (KG)</label>
                  <input type="number" step="0.1" style={inputStyle} value={ibuForm.beratBadan} onChange={e => setIbuForm({...ibuForm, beratBadan: e.target.value})} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>RISIKO TINGGI</label>
                <select style={inputStyle} value={ibuForm.risikoTinggi ? "true" : "false"} onChange={e => setIbuForm({...ibuForm, risikoTinggi: e.target.value === "true"})}>
                  <option value="false">Tidak / Risiko Rendah</option>
                  <option value="true">Ya (Risiko Tinggi)</option>
                </select>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button type="button" onClick={onClose} disabled={loading} style={{
              flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #E5E7EB",
              background: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", fontWeight: 600,
              transition: "all 0.2s ease", color: "#374151"
            }}
              onMouseOver={(e) => { if (!loading) e.target.style.background = "#F9FAFB"; }}
              onMouseOut={(e) => { if (!loading) e.target.style.background = "#fff"; }}
            >
              Batal
            </button>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: "12px", borderRadius: 8,
              background: loading ? "#9CA3AF" : "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
              color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
              fontWeight: 600, transition: "all 0.3s ease", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)"
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
              {loading ? "⏳ Menyimpan..." : "✓ Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
