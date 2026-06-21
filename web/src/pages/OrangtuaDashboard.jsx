import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import logo from "../assets/POSCO_LOGO_KITA.png";
import { api } from "../utils/api";
import { jsPDF } from "jspdf";

export default function OrangtuaDashboard() {
  const { user, logout, updateCurrentUser } = useAuth();
  const navigate = useNavigate();
  const { success, error: errorNotify } = useNotification();
  const [activeMenu, setActiveMenu] = useState("home");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedChildForDetail, setSelectedChildForDetail] = useState(null);
  const [showRiwayatModal, setShowRiwayatModal] = useState(false);
  const [selectedChildForRiwayat, setSelectedChildForRiwayat] = useState(null);
  const [showSesiDetailModal, setShowSesiDetailModal] = useState(false);
  const [selectedSesiForDetail, setSelectedSesiForDetail] = useState(null);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [childrenData, setChildrenData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [editingChildId, setEditingChildId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [posyandus, setPosyandus] = useState([]);
  const [ibuHamilState, setIbuHamilState] = useState([]);
  const [jadwalSesiState, setJadwalSesiState] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState(user?.name || "");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setNewProfileName(user.name);
    }
  }, [user]);

  const loadOrangtuaData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const posList = await api.getPosyandus();
      setPosyandus(posList);

      const kids = await api.getChildren({ orangtuaId: user.id }, posList);
      setChildrenData(kids);

      // Resolve posyanduId from first child if not set on parent user profile
      let targetPosyanduId = user.posyanduId;
      if (!targetPosyanduId && kids.length > 0) {
        const firstKid = kids[0];
        targetPosyanduId = firstKid.posyanduId || posList.find(p => p.name === firstKid.posyandu || p.nama === firstKid.posyandu)?.id;
      }

      const params = targetPosyanduId ? { posyanduId: targetPosyanduId } : {};
      const pregs = await api.getPregnancies(params, posList);
      setIbuHamilState(pregs);

      const sessions = await api.getSessions(params, posList);
      setJadwalSesiState(sessions);
    } catch (err) {
      console.error("Gagal memuat data orang tua:", err);
      errorNotify("⚠️ Gagal memuat data dari server");
    } finally {
      setLoading(false);
    }
  }, [user, errorNotify]);

  useEffect(() => {
    loadOrangtuaData();
  }, [loadOrangtuaData]);

  // Filter data berdasarkan logged in user
  const myChildren = childrenData.filter(c => c.orangtuaId === user?.id);
  const myIbuHamil = ibuHamilState;
  const mySchedules = jadwalSesiState;
  const currentChild = myChildren[selectedChildIndex] || null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { id: "home", label: "Beranda", icon: "🏠" },
    { id: "child", label: "Data Anak", icon: "👶" },
    { id: "monitoring", label: "Monitoring Anak", icon: "📋" },
    { id: "growth", label: "Grafik Pertumbuhan", icon: "📈" },
    { id: "schedule", label: "Jadwal Kunjungan", icon: "📅" },
    { id: "profile", label: "Profil Saya", icon: "👤" },
  ];

  const handleStatusChange = async (childId, newStatus) => {
    const childToUpdate = childrenData.find(c => c.id === childId);
    if (!childToUpdate) return;

    const updatedChild = { ...childToUpdate, statusGizi: newStatus };
    try {
      const res = await api.updateChild(childId, updatedChild, posyandus);
      setChildrenData(prevData => prevData.map(child => 
        child.id === childId ? res : child
      ));
      success("✅ Status gizi berhasil diubah!");
    } catch (err) {
      console.error(err);
      errorNotify("⚠️ Gagal mengubah status gizi: " + err.message);
    }
    setEditingChildId(null);
    setEditingStatus("");
  };

  const filteredChildren = myChildren.filter(child => {
    const matchesSearch = child.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.namaIbu.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "Semua Status" || child.statusGizi === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    if (status === "Normal") return { bg: "#F0FDF4", color: "#16A34A" };
    if (status === "Gizi Kurang") return { bg: "#FFFBEB", color: "#D97706" };
    if (status === "Gizi Lebih") return { bg: "#FEF2F2", color: "#DC2626" };
    return { bg: "#F3F4F6", color: "#6B7280" };
  };

  const handleDownloadChildPDF = (child) => {
    try {
      downloadChildPDF(child, user);
      success(`✓ Berhasil mengunduh PDF untuk ${child.nama}`);
    } catch (err) {
      console.error(err);
      errorNotify(`⚠️ Gagal mengunduh PDF: ${err.message}`);
    }
  };

  const handleDownloadAllPDFs = async () => {
    if (myChildren.length === 0) {
      errorNotify("⚠️ Tidak ada data anak untuk diunduh");
      return;
    }
    
    success(`📥 Memulai pengunduhan ${myChildren.length} PDF laporan anak...`);
    
    for (let i = 0; i < myChildren.length; i++) {
      const child = myChildren[i];
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      try {
        downloadChildPDF(child, user);
      } catch (err) {
        console.error(`Gagal mengunduh untuk ${child.nama}:`, err);
      }
    }
  };

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
        minHeight: "100vh",
        overflowY: "auto"
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
          <div style={{ fontSize: 12, opacity: 0.8 }}>Orang Tua</div>
        </div>

        {/* Menu */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              style={{
                background: activeMenu === item.id ? "rgba(255,255,255,0.25)" : "transparent",
                border: activeMenu === item.id ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent",
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
                fontFamily: "inherit"
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            marginTop: "auto"
          }}
        >
          Keluar
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Top Bar */}
        <div style={{
          background: "white",
          borderBottom: "1px solid #E5E7EB",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 }}>Dashboard Orang Tua</h1>
          <span style={{ fontSize: 14, color: "#6B7280" }}>{user?.name}</span>
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          padding: "32px",
          overflowY: "auto",
          background: "#F9FAFB"
        }}>
          {/* HOME */}
          {activeMenu === "home" && (
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
                <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", color: "#fff" }}>
                  Selamat Datang, {user?.name}! 👋
                </h2>
                <p style={{ margin: 0, opacity: 0.9, fontSize: 16 }}>
                  📍 {user?.posyandu || user?.wilayah || "Posyandu Melati"} • {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
                </p>
              </div>
              
              {/* Stats */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
                marginBottom: 32
              }}>
                {[
                  { label: "Total Anak", value: myChildren.length, icon: "👶" },
                  { label: "Jadwal", value: mySchedules.length, icon: "📅" }
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: "white",
                    borderRadius: 12,
                    padding: 20,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#16A34A" }}>{stat.value}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Child Cards */}
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Data Anak Anda</h3>
              {myChildren.length > 0 ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: 16
                }}>
                  {myChildren.map((child) => {
                    const hasIssue = child.statusGizi !== "Normal";
                    return (
                      <div
                        key={child.id}
                        style={{
                          background: "white",
                          borderRadius: 12,
                          padding: 16,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          border: hasIssue ? "2px solid #F59E0B" : "1px solid #E5E7EB"
                        }}
                      >
                        {hasIssue && (
                          <div style={{
                            background: "#FFFBEB",
                            borderRadius: 6,
                            padding: "6px 10px",
                            marginBottom: 10,
                            fontSize: 11,
                            color: "#92400E",
                            fontWeight: 600
                          }}>
                            Perhatian: Status gizi {child.statusGizi}
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                          <div style={{ fontSize: 32 }}>{child.jenisKelamin === "P" ? "👧" : "👦"}</div>
                          <div>
                            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>{child.nama}</h4>
                            <p style={{ fontSize: 12, color: "#6B7280", margin: "2px 0 0" }}>{child.posyandu}</p>
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                          <div style={{ background: "#F3F4F6", padding: 8, borderRadius: 6, textAlign: "center" }}>
                            <div style={{ fontSize: 11, color: "#6B7280" }}>BB</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{child.beratBadan} kg</div>
                          </div>
                          <div style={{ background: "#F3F4F6", padding: 8, borderRadius: 6, textAlign: "center" }}>
                            <div style={{ fontSize: 11, color: "#6B7280" }}>TB</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{child.tinggiBadan} cm</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => { setSelectedChildForDetail(child); setShowDetailModal(true); }}
                            style={{
                              flex: 1,
                              padding: "8px",
                              borderRadius: 6,
                              background: "#F0FDF4",
                              border: "1px solid #DCFCE7",
                              color: "#16A34A",
                              fontWeight: 600,
                              fontSize: 12,
                              cursor: "pointer"
                            }}
                          >
                            Lihat Detail
                          </button>
                          <button
                            onClick={() => { setSelectedChildForRiwayat(child); setShowRiwayatModal(true); }}
                            style={{
                              flex: 1,
                              padding: "8px",
                              borderRadius: 6,
                              background: "#EFF6FF",
                              border: "1px solid #BFDBFE",
                              color: "#3B82F6",
                              fontWeight: 600,
                              fontSize: 12,
                              cursor: "pointer"
                            }}
                          >
                            Riwayat
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{
                  background: "white",
                  borderRadius: 12,
                  padding: 32,
                  textAlign: "center",
                  color: "#9CA3AF"
                }}>
                  Belum ada data anak
                </div>
              )}
            </div>
          )}

          {/* DATA ANAK */}
          {activeMenu === "child" && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 24 }}>Data Anak Saya</h2>
              {myChildren.length > 0 ? (
                <>
                  {/* Child Selection */}
                  <div style={{ display: "flex", gap: 12, marginBottom: 24, overflowX: "auto" }}>
                    {myChildren.map((child, idx) => (
                      <button
                        key={child.id}
                        onClick={() => setSelectedChildIndex(idx)}
                        style={{
                          padding: "12px 20px",
                          borderRadius: 8,
                          background: selectedChildIndex === idx ? "#16A34A" : "#F3F4F6",
                          color: selectedChildIndex === idx ? "white" : "#111827",
                          border: "none",
                          fontWeight: 600,
                          fontSize: 14,
                          cursor: "pointer",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {child.nama}
                      </button>
                    ))}
                  </div>

                  {currentChild && (
                    <div style={{
                      background: "white",
                      borderRadius: 12,
                      padding: 24,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                    }}>
                      <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
                        <div style={{
                          fontSize: 64,
                          width: 100,
                          height: 100,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#F0FDF4",
                          borderRadius: 12
                        }}>
                          {currentChild.jenisKelamin === "P" ? "👧" : "👦"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>
                            {currentChild.nama}
                          </h3>
                          <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 16px" }}>
                            Ibu: {currentChild.namaIbu}
                          </p>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                            <div>
                              <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 4px" }}>Jenis Kelamin</p>
                              <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>
                                {currentChild.jenisKelamin === "P" ? "Perempuan" : "Laki-laki"}
                              </p>
                            </div>
                            <div>
                              <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 4px" }}>Tanggal Lahir</p>
                              <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>
                                {new Date(currentChild.tanggalLahir).toLocaleDateString("id-ID")}
                              </p>
                            </div>
                            <div>
                              <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 4px" }}>Status Gizi</p>
                              <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>
                                {currentChild.statusGizi}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 24 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Pengukuran Terkini</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                          {[
                            { label: "Berat Badan", value: currentChild.beratBadan + " kg" },
                            { label: "Tinggi Badan", value: currentChild.tinggiBadan + " cm" },
                            { label: "Status Stunting", value: currentChild.statusStunting },
                            { label: "Posyandu", value: currentChild.posyandu }
                          ].map((item, i) => (
                            <div key={i} style={{
                              background: "#F9FAFB",
                              padding: 16,
                              borderRadius: 8,
                              textAlign: "center"
                            }}>
                              <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 8px" }}>{item.label}</p>
                              <p style={{ fontSize: 18, fontWeight: 700, color: "#16A34A", margin: 0 }}>{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 12, marginTop: 24, paddingTop: 24, borderTop: "1px solid #E5E7EB" }}>
                        <button
                          onClick={() => { setSelectedChildForDetail(currentChild); setShowDetailModal(true); }}
                          style={{
                            flex: 1,
                            padding: "12px 16px",
                            borderRadius: 8,
                            background: "#16A34A",
                            color: "white",
                            border: "none",
                            fontWeight: 600,
                            cursor: "pointer"
                          }}
                        >
                          Lihat Detail Lengkap
                        </button>
                        <button
                          onClick={() => { setSelectedChildForRiwayat(currentChild); setShowRiwayatModal(true); }}
                          style={{
                            flex: 1,
                            padding: "12px 16px",
                            borderRadius: 8,
                            background: "#3B82F6",
                            color: "white",
                            border: "none",
                            fontWeight: 600,
                            cursor: "pointer"
                          }}
                        >
                          Lihat Riwayat Lengkap
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{
                  background: "white",
                  borderRadius: 12,
                  padding: 32,
                  textAlign: "center",
                  color: "#9CA3AF"
                }}>
                  Belum ada data anak
                </div>
              )}
            </div>
          )}

          {/* MONITORING */}
          {activeMenu === "monitoring" && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 24 }}>Monitoring Anak</h2>
              
              {/* Search, Filter & Download All */}
              <div style={{
                display: "flex",
                gap: 16,
                marginBottom: 24,
                alignItems: "center",
                flexWrap: "wrap"
              }}>
                <input
                  type="text"
                  placeholder="Cari nama anak atau ibu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: "200px",
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    fontSize: 14,
                    background: "white",
                    fontFamily: "inherit"
                  }}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    fontSize: 14,
                    background: "white",
                    cursor: "pointer",
                    fontFamily: "inherit"
                  }}
                >
                  <option>Semua Status</option>
                  <option>Normal</option>
                  <option>Gizi Kurang</option>
                  <option>Gizi Lebih</option>
                </select>
                <button
                  onClick={handleDownloadAllPDFs}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "none",
                    background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(22, 163, 74, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.2)";
                  }}
                >
                  <span>📥</span> Unduh Semua PDF
                </button>
              </div>

              {/* Info */}
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>
                Menampilkan {filteredChildren.length} dari {myChildren.length} data anak
              </p>

              {/* Table */}
              {filteredChildren.length > 0 ? (
                <div style={{
                  background: "white",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#F3F4F6", borderBottom: "2px solid #E5E7EB" }}>
                        {["Nama Anak", "Nama Ibu", "Wilayah", "BB / TB", "Status", "Aksi"].map(h => (
                          <th key={h} style={{ textAlign: h === "Aksi" ? "center" : "left", padding: 16, color: "#374151", fontWeight: 700, fontSize: 12 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredChildren.map((child) => {
                        const statusColors = getStatusColor(child.statusGizi);
                        return (
                          <tr key={child.id} style={{ borderBottom: "1px solid #E5E7EB" }}>
                            <td style={{ padding: 16, color: "#111827", fontWeight: 600 }}>
                              {child.jenisKelamin === "P" ? "👧" : "👦"} {child.nama}
                            </td>
                            <td style={{ padding: 16, color: "#6B7280" }}>{child.namaIgu || child.namaIbu}</td>
                            <td style={{ padding: 16, color: "#6B7280" }}>{child.posyandu}</td>
                            <td style={{ padding: 16, color: "#6B7280" }}>
                              {child.beratBadan} kg / {child.tinggiBadan} cm
                            </td>
                            <td style={{ padding: 16 }}>
                              <span style={{
                                display: "inline-block",
                                padding: "6px 12px",
                                borderRadius: 4,
                                fontSize: 12,
                                fontWeight: 600,
                                background: statusColors.bg,
                                color: statusColors.color
                              }}>
                                {child.statusGizi}
                              </span>
                            </td>
                            <td style={{ padding: 16, textAlign: "center" }}>
                              <button
                                onClick={() => handleDownloadChildPDF(child)}
                                style={{
                                  padding: "6px 12px",
                                  borderRadius: 6,
                                  border: "1px solid #16A34A",
                                  background: "white",
                                  color: "#16A34A",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                  transition: "all 0.2s ease",
                                  fontFamily: "inherit"
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.background = "#16A34A";
                                  e.currentTarget.style.color = "white";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.background = "white";
                                  e.currentTarget.style.color = "#16A34A";
                                }}
                              >
                                📄 Unduh PDF
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{
                  background: "white",
                  borderRadius: 12,
                  padding: 32,
                  textAlign: "center",
                  color: "#9CA3AF"
                }}>
                  Tidak ada data yang sesuai dengan pencarian
                </div>
              )}
            </div>
          )}

          {/* GROWTH */}
          {activeMenu === "growth" && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 24 }}>Grafik Pertumbuhan</h2>
              {myChildren.length > 0 ? (
                <>
                  <div style={{ display: "flex", gap: 12, marginBottom: 24, overflowX: "auto" }}>
                    {myChildren.map((child, idx) => (
                      <button
                        key={child.id}
                        onClick={() => setSelectedChildIndex(idx)}
                        style={{
                          padding: "12px 20px",
                          borderRadius: 8,
                          background: selectedChildIndex === idx ? "#16A34A" : "#F3F4F6",
                          color: selectedChildIndex === idx ? "white" : "#111827",
                          border: "none",
                          fontWeight: 600,
                          fontSize: 14,
                          cursor: "pointer",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {child.nama}
                      </button>
                    ))}
                  </div>

                  {currentChild && currentChild.riwayatPemeriksaan && currentChild.riwayatPemeriksaan.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                      <GrowthLineChart
                        data={[...currentChild.riwayatPemeriksaan].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))}
                        title="📈 Tren Berat Badan (BB)"
                        valueKey="bb"
                        unit="kg"
                        colorGrad="#10B981"
                        strokeColor="#10B981"
                      />
                      <GrowthLineChart
                        data={[...currentChild.riwayatPemeriksaan].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))}
                        title="📈 Tren Tinggi Badan (TB)"
                        valueKey="tb"
                        unit="cm"
                        colorGrad="#3B82F6"
                        strokeColor="#3B82F6"
                      />
                    </div>
                  )}

                  {currentChild && currentChild.riwayatPemeriksaan && currentChild.riwayatPemeriksaan.length > 0 ? (
                    <div style={{
                      background: "white",
                      borderRadius: 12,
                      padding: 24,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                    }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                          <tr style={{ borderBottom: "2px solid #E5E7EB" }}>
                            {["Tanggal", "BB (kg)", "TB (cm)", "LK (cm)", "LL (cm)", "Status"].map(h => (
                              <th key={h} style={{ textAlign: "left", padding: 12, color: "#6B7280", fontWeight: 600 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[...currentChild.riwayatPemeriksaan].reverse().map((pemeriksaan, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #E5E7EB" }}>
                              <td style={{ padding: 12, color: "#111827" }}>
                                {new Date(pemeriksaan.tanggal).toLocaleDateString("id-ID")}
                              </td>
                              <td style={{ padding: 12, color: "#111827" }}>{pemeriksaan.bb}</td>
                              <td style={{ padding: 12, color: "#111827" }}>{pemeriksaan.tb}</td>
                              <td style={{ padding: 12, color: "#111827" }}>{pemeriksaan.lingkarKepala}</td>
                              <td style={{ padding: 12, color: "#111827" }}>{pemeriksaan.lingkarLengan}</td>
                              <td style={{ padding: 12 }}>
                                <span style={{
                                  fontSize: 11,
                                  padding: "2px 8px",
                                  borderRadius: 12,
                                  background: pemeriksaan.statusGizi === "Normal" ? "#F0FDF4" : pemeriksaan.statusGizi === "Gizi Kurang" ? "#FFFBEB" : "#FEF2F2",
                                  color: pemeriksaan.statusGizi === "Normal" ? "#16A34A" : pemeriksaan.statusGizi === "Gizi Kurang" ? "#D97706" : "#DC2626",
                                  fontWeight: 600
                                }}>
                                  {pemeriksaan.statusGizi}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{
                      background: "white",
                      borderRadius: 12,
                      padding: 32,
                      textAlign: "center",
                      color: "#9CA3AF"
                    }}>
                      Belum ada data
                    </div>
                  )}
                </>
              ) : (
                <div style={{
                  background: "white",
                  borderRadius: 12,
                  padding: 32,
                  textAlign: "center",
                  color: "#9CA3AF"
                }}>
                  Belum ada data anak
                </div>
              )}
            </div>
          )}

          {/* SCHEDULE */}
          {activeMenu === "schedule" && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 24 }}>Jadwal</h2>
              
              {mySchedules.length > 0 ? (
                <div style={{
                  background: "white",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  marginBottom: 32
                }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#F3F4F6", borderBottom: "2px solid #E5E7EB" }}>
                        {["Posyandu", "Tanggal", "Waktu", "Status"].map(h => (
                          <th key={h} style={{ textAlign: "left", padding: 16, color: "#374151", fontWeight: 700, fontSize: 12 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mySchedules.map((schedule) => {
                        const getSessionStatus = (s) => {
                          if (!s.tanggal) return "Mendatang";
                          const parts = s.tanggal.split('-');
                          if (parts.length !== 3) return "Mendatang";
                          const sessionDate = new Date(parts[0], parts[1] - 1, parts[2]);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          if (sessionDate < today) {
                            return "Sudah Berlalu";
                          }
                          return s.status || "Mendatang";
                        };
                        const displayStatus = getSessionStatus(schedule);
                        const isPast = displayStatus === "Sudah Berlalu";

                        return (
                          <tr 
                            key={schedule.id} 
                            onClick={() => {
                              setSelectedSesiForDetail(schedule);
                              setShowSesiDetailModal(true);
                            }}
                            style={{ 
                              borderBottom: "1px solid #E5E7EB", 
                              cursor: "pointer",
                              transition: "background 0.2s ease"
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = "#F9FAFB"; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
                          >
                            <td style={{ padding: 16, color: "#111827", fontWeight: 600 }}>{schedule.posyandu}</td>
                            <td style={{ padding: 16, color: "#6B7280" }}>
                              {new Date(schedule.tanggal).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                            </td>
                            <td style={{ padding: 16, color: "#6B7280" }}>{schedule.waktu}</td>
                            <td style={{ padding: 16 }}>
                              <span style={{
                                display: "inline-block",
                                padding: "6px 12px",
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 600,
                                background: isPast ? "#F3F4F6" : "#F0FDF4",
                                color: isPast ? "#6B7280" : "#16A34A"
                              }}>
                                {displayStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{
                  background: "white",
                  borderRadius: 12,
                  padding: 32,
                  textAlign: "center",
                  color: "#9CA3AF",
                  marginBottom: 32
                }}>
                  Belum ada jadwal
                </div>
              )}

              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Ibu Hamil</h3>
              {myIbuHamil.length > 0 ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 16
                }}>
                  {myIbuHamil.map(ibu => (
                    <div key={ibu.id} style={{
                      background: "white",
                      borderRadius: 12,
                      padding: 16,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      border: ibu.risikoTinggi ? "2px solid #EF4444" : "1px solid #E5E7EB"
                    }}>
                      {ibu.risikoTinggi && (
                        <div style={{
                          background: "#FEF2F2",
                          borderRadius: 6,
                          padding: "6px 10px",
                          marginBottom: 10,
                          fontSize: 11,
                          color: "#DC2626",
                          fontWeight: 600
                        }}>
                          Risiko Tinggi
                        </div>
                      )}
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>
                        {ibu.nama}
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ color: "#6B7280" }}>Usia Kehamilan</span>
                          <span style={{ fontWeight: 600 }}>{ibu.usiaKehamilan} minggu</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ color: "#6B7280" }}>Taksi Persalinan</span>
                          <span style={{ fontWeight: 600, color: "#16A34A" }}>
                            {new Date(ibu.taksirPersalinan).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  background: "white",
                  borderRadius: 12,
                  padding: 32,
                  textAlign: "center",
                  color: "#9CA3AF"
                }}>
                  Tidak ada ibu hamil
                </div>
              )}
            </div>
          )}

          {/* PROFILE */}
          {activeMenu === "profile" && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 24 }}>Profil Saya</h2>
              
              {/* Info Pribadi */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Informasi Pribadi</h3>
                <div style={{
                  background: "white",
                  borderRadius: 12,
                  padding: 24
                }}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, display: "block", marginBottom: 6 }}>
                      NAMA
                    </label>
                    <input
                      type="text"
                      value={isEditingProfile ? newProfileName : (user?.name || "")}
                      disabled={!isEditingProfile || updatingProfile}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 4,
                        border: isEditingProfile ? "1.5px solid #16A34A" : "1px solid #E5E7EB",
                        fontSize: 14,
                        background: "white",
                        color: "#111827",
                        outline: "none",
                        transition: "all 0.3s ease"
                      }}
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, display: "block", marginBottom: 6 }}>
                      EMAIL
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 4,
                        border: "1px solid #E5E7EB",
                        fontSize: 14,
                        background: "#F3F4F6",
                        color: "#6B7280"
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, display: "block", marginBottom: 6 }}>
                      WILAYAH
                    </label>
                    <input
                      type="text"
                      value={user?.wilayah || ""}
                      disabled
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 4,
                        border: "1px solid #E5E7EB",
                        fontSize: 14,
                        background: "#F3F4F6",
                        color: "#6B7280"
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, display: "block", marginBottom: 6 }}>
                      ROLE
                    </label>
                    <input
                      type="text"
                      value="Orang Tua"
                      disabled
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 4,
                        border: "1px solid #E5E7EB",
                        fontSize: 14,
                        background: "#F3F4F6",
                        color: "#6B7280"
                      }}
                    />
                  </div>
                  
                  {/* Action Buttons for Profile Editing */}
                  <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                    {!isEditingProfile ? (
                      <button
                        onClick={() => {
                          setNewProfileName(user?.name || "");
                          setIsEditingProfile(true);
                        }}
                        style={{
                          padding: "10px 24px",
                          borderRadius: 8,
                          background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                          color: "#fff",
                          border: "none",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)"
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = "translateY(-1px)";
                          e.target.style.boxShadow = "0 6px 16px rgba(22, 163, 74, 0.3)";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.2)";
                        }}
                      >
                        📝 Edit Profil
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingProfile(false);
                            setNewProfileName(user?.name || "");
                          }}
                          disabled={updatingProfile}
                          style={{
                            padding: "10px 20px",
                            borderRadius: 8,
                            border: "1px solid #D1D5DB",
                            background: "#fff",
                            color: "#374151",
                            fontWeight: 600,
                            cursor: updatingProfile ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease"
                          }}
                          onMouseOver={(e) => { if (!updatingProfile) e.target.style.background = "#F9FAFB"; }}
                          onMouseOut={(e) => { if (!updatingProfile) e.target.style.background = "#fff"; }}
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!newProfileName.trim()) {
                              errorNotify("⚠️ Nama tidak boleh kosong!");
                              return;
                            }
                            setUpdatingProfile(true);
                            try {
                              const updatedUser = await api.updateUser(user.id, {
                                ...user,
                                name: newProfileName
                              });
                              updateCurrentUser(updatedUser);
                              success("✅ Profil berhasil diperbarui!");
                              setIsEditingProfile(false);
                            } catch (err) {
                              console.error(err);
                              errorNotify("⚠️ Gagal memperbarui profil: " + err.message);
                            } finally {
                              setUpdatingProfile(false);
                            }
                          }}
                          disabled={updatingProfile}
                          style={{
                            padding: "10px 24px",
                            borderRadius: 8,
                            background: updatingProfile ? "#9CA3AF" : "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                            color: "#fff",
                            border: "none",
                            fontWeight: 600,
                            cursor: updatingProfile ? "not-allowed" : "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)"
                          }}
                          onMouseOver={(e) => {
                            if (!updatingProfile) {
                              e.target.style.transform = "translateY(-1px)";
                              e.target.style.boxShadow = "0 6px 16px rgba(22, 163, 74, 0.3)";
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!updatingProfile) {
                              e.target.style.transform = "translateY(0)";
                              e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.2)";
                            }
                          }}
                        >
                          {updatingProfile ? "⏳ Menyimpan..." : "✓ Simpan"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Data Anak */}
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Data Anak-Anak ({myChildren.length})</h3>
                {myChildren.length > 0 ? (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 16
                  }}>
                    {myChildren.map((child) => (
                      <div
                        key={child.id}
                        style={{
                          background: "white",
                          borderRadius: 12,
                          padding: 16,
                          border: "1px solid #E5E7EB"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                          <div style={{ fontSize: 32 }}>{child.jenisKelamin === "P" ? "👧" : "👦"}</div>
                          <div>
                            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
                              {child.nama}
                            </h4>
                            <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
                              Lahir: {new Date(child.tanggalLahir).toLocaleDateString("id-ID")}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                          <div style={{ background: "#F3F4F6", padding: 8, borderRadius: 6, textAlign: "center" }}>
                            <div style={{ fontSize: 11, color: "#6B7280" }}>BB</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{child.beratBadan} kg</div>
                          </div>
                          <div style={{ background: "#F3F4F6", padding: 8, borderRadius: 6, textAlign: "center" }}>
                            <div style={{ fontSize: 11, color: "#6B7280" }}>TB</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{child.tinggiBadan} cm</div>
                          </div>
                        </div>
                        <div style={{ padding: 10, background: "#F9FAFB", borderRadius: 6, marginBottom: 12 }}>
                          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Ibu</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{child.namaIbu}</div>
                        </div>
                        <div style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          background: child.statusGizi === "Normal" ? "#F0FDF4" : child.statusGizi === "Gizi Kurang" ? "#FFFBEB" : "#FEF2F2",
                          color: child.statusGizi === "Normal" ? "#16A34A" : child.statusGizi === "Gizi Kurang" ? "#D97706" : "#DC2626"
                        }}>
                          {child.statusGizi}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    background: "white",
                    borderRadius: 12,
                    padding: 32,
                    textAlign: "center",
                    color: "#9CA3AF"
                  }}>
                    Belum ada data anak
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedChildForDetail && (
        <DetailBalitaModal child={selectedChildForDetail} onClose={() => setShowDetailModal(false)} />
      )}

      {/* Riwayat Modal */}
      {showRiwayatModal && selectedChildForRiwayat && (
        <RiwayatModal child={selectedChildForRiwayat} onClose={() => setShowRiwayatModal(false)} />
      )}

      {/* Detail Sesi Modal */}
      {showSesiDetailModal && selectedSesiForDetail && (
        <DetailSesiModal sesi={selectedSesiForDetail} onClose={() => { setShowSesiDetailModal(false); setSelectedSesiForDetail(null); }} />
      )}
    </div>
  );
}

function DetailBalitaModal({ child, onClose }) {
  const [activeTab, setActiveTab] = useState("info");

  const imunisasiList = [
    { id: "bcg", label: "BCG", icon: "Vaccine" },
    { id: "hb0", label: "HB0", icon: "Vaccine" },
    { id: "polio", label: "Polio", icon: "Vaccine" },
    { id: "dpt1", label: "DPT 1", icon: "Vaccine" },
    { id: "dpt2", label: "DPT 2", icon: "Vaccine" },
    { id: "campak", label: "Campak", icon: "Vaccine" }
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff", borderRadius: 12, width: "100%", maxWidth: 700,
        padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", maxHeight: "90vh", overflow: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px" }}>
            {child.jenisKelamin === "P" ? "Girl" : "Boy"}: {child.nama}
          </h2>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer", color: "#9CA3AF" }}>X</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, borderBottom: "2px solid #E5E7EB" }}>
          {["info", "riwayat", "orangtua"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 16px",
                borderBottom: activeTab === tab ? "3px solid #16A34A" : "none",
                background: "none",
                border: "none",
                color: activeTab === tab ? "#16A34A" : "#6B7280",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                marginBottom: "-2px"
              }}
            >
              {tab === "info" && "Info"}
              {tab === "riwayat" && "History"}
              {tab === "orangtua" && "Parents"}
            </button>
          ))}
        </div>

        {/* Info Tab */}
        {activeTab === "info" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Measurements</h4>
              {[
                { label: "Weight", value: child.beratBadan + " kg" },
                { label: "Height", value: child.tinggiBadan + " cm" },
                { label: "Head", value: (child.riwayatPemeriksaan && child.riwayatPemeriksaan.length > 0 ? child.riwayatPemeriksaan[child.riwayatPemeriksaan.length - 1].lingkarKepala : "-") + " cm" },
                { label: "Arm", value: (child.riwayatPemeriksaan && child.riwayatPemeriksaan.length > 0 ? child.riwayatPemeriksaan[child.riwayatPemeriksaan.length - 1].lingkarLengan : "-") + " cm" }
              ].map((item, i) => (
                <div key={i} style={{ background: "#F3F4F6", padding: 12, borderRadius: 8, marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{item.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginTop: 4 }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Status</h4>
              {[
                { label: "Nutrition", value: child.statusGizi },
                { label: "Stunting", value: child.statusStunting },
                { label: "Birth Date", value: new Date(child.tanggalLahir).toLocaleDateString("id-ID") },
                { label: "Posyandu", value: child.posyandu }
              ].map((item, i) => (
                <div key={i} style={{ background: "#F3F4F6", padding: 12, borderRadius: 8, marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginTop: 4 }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Immunizations</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {imunisasiList.map(imun => (
                  <div key={imun.id} style={{
                    background: child.imunisasi[imun.id] ? "#F0FDF4" : "#FEF2F2",
                    border: `1px solid ${child.imunisasi[imun.id] ? "#DCFCE7" : "#FECACA"}`,
                    borderRadius: 8,
                    padding: 12,
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{imun.label}</div>
                    <div style={{ fontSize: 11, color: child.imunisasi[imun.id] ? "#16A34A" : "#DC2626", marginTop: 4 }}>
                      {child.imunisasi[imun.id] ? "Done" : "Pending"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "riwayat" && (
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Examination History</h4>
            {child.riwayatPemeriksaan && child.riwayatPemeriksaan.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[...child.riwayatPemeriksaan].reverse().map((pemeriksaan, idx) => (
                  <div key={idx} style={{
                    background: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    padding: 16
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
                      {new Date(pemeriksaan.tanggal).toLocaleDateString("id-ID")}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>Weight</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{pemeriksaan.bb} kg</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>Height</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{pemeriksaan.tb} cm</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>Head</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{pemeriksaan.lingkarKepala} cm</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>Arm</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{pemeriksaan.lingkarLengan} cm</div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 12, padding: "4px 12px", borderRadius: 20,
                      background: pemeriksaan.statusGizi === "Normal" ? "#F0FDF4" : "#FFFBEB",
                      color: pemeriksaan.statusGizi === "Normal" ? "#16A34A" : "#D97706",
                      fontWeight: 600
                    }}>
                      {pemeriksaan.statusGizi}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#9CA3AF", padding: 20 }}>
                No examination data yet
              </div>
            )}
          </div>
        )}

        {/* Parents Tab */}
        {activeTab === "orangtua" && (
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Parent Info</h4>
            {[
              { label: "Mother Name", value: child.namaIbu },
              { label: "Child Name", value: child.nama },
              { label: "Posyandu", value: child.posyandu }
            ].map((item, i) => (
              <div key={i} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{item.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RiwayatModal({ child, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff", borderRadius: 12, width: "100%", maxWidth: 600,
        padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", maxHeight: "90vh", overflow: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Examination History - {child.nama}</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer", color: "#9CA3AF" }}>X</button>
        </div>

        {child.riwayatPemeriksaan && child.riwayatPemeriksaan.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[...child.riwayatPemeriksaan].reverse().map((pemeriksaan, idx) => (
              <div key={idx} style={{
                borderLeft: "4px solid #16A34A",
                padding: 16,
                background: "#F9FAFB",
                borderRadius: 8
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
                  {new Date(pemeriksaan.tanggal).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>Weight</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{pemeriksaan.bb} kg</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>Height</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{pemeriksaan.tb} cm</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>Head</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{pemeriksaan.lingkarKepala} cm</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>Arm</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{pemeriksaan.lingkarLengan} cm</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E5E7EB" }}>
                  <span style={{
                    fontSize: 12, padding: "4px 12px", borderRadius: 20,
                    background: pemeriksaan.statusGizi === "Normal" ? "#F0FDF4" : pemeriksaan.statusGizi === "Gizi Kurang" ? "#FFFBEB" : "#FEF2F2",
                    color: pemeriksaan.statusGizi === "Normal" ? "#16A34A" : pemeriksaan.statusGizi === "Gizi Kurang" ? "#D97706" : "#DC2626",
                    fontWeight: 600
                  }}>
                    {pemeriksaan.statusGizi}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: 20, textAlign: "center", color: "#9CA3AF" }}>
            No examination data
          </div>
        )}
      </div>
    </div>
  );
}

function GrowthLineChart({ data, title, valueKey, unit, colorGrad, strokeColor }) {
  if (!data || data.length === 0) return null;

  const width = 450;
  const height = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Extracted values
  const values = data.map(d => d[valueKey]);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  
  // Margins for Y scale
  const range = maxVal - minVal;
  const yMin = Math.max(0, minVal - (range === 0 ? 1 : range * 0.15));
  const yMax = maxVal + (range === 0 ? 1 : range * 0.15);

  const getX = (index) => {
    if (data.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (val) => {
    if (yMax === yMin) return paddingTop + chartHeight / 2;
    return paddingTop + chartHeight - ((val - yMin) / (yMax - yMin)) * chartHeight;
  };

  // Build line path
  const points = data.map((d, index) => ({
    x: getX(index),
    y: getY(d[valueKey])
  }));

  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
  }

  // Build area path for gradient under line
  let areaD = "";
  if (points.length > 0) {
    areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;
  }

  const gradId = `grad-${valueKey}`;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: 20,
      border: "1px solid #E5E7EB",
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
    }}>
      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#374151", margin: "0 0 12px" }}>{title}</h4>
      <div style={{ position: "relative" }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorGrad} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colorGrad} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + ratio * chartHeight;
            const gridVal = (yMax - (ratio * (yMax - yMin))).toFixed(1);
            return (
              <g key={idx}>
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#F3F4F6" strokeWidth="1" />
                <text x={paddingLeft - 8} y={y + 4} textAnchor="end" style={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "inherit" }}>
                  {gridVal}
                </text>
              </g>
            );
          })}

          {/* Paths */}
          {points.length > 1 && (
            <>
              <path d={areaD} fill={`url(#${gradId})`} />
              <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}

          {/* Interactive dots */}
          {points.map((p, index) => {
            const dateStr = new Date(data[index].tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
            return (
              <g key={index}>
                <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke={strokeColor} strokeWidth="3" />
                {/* Tooltip value */}
                <text x={p.x} y={p.y - 10} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, fill: "#1F2937" }}>
                  {data[index][valueKey]} {unit}
                </text>
                {/* X Axis Label */}
                <text x={p.x} y={paddingTop + chartHeight + 20} textAnchor="middle" style={{ fontSize: 10, fill: "#6B7280" }}>
                  {dateStr}
                </text>
              </g>
            );
          })}
        </svg>
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

  const displayStatus = getSessionStatus(sesi);
  const isPast = displayStatus === "Sudah Berlalu";
  const badgeBg = isPast ? "#E5E7EB" : "#DCFCE7";
  const badgeColor = isPast ? "#4B5563" : "#16A34A";

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

function downloadChildPDF(child, parentInfo) {
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
  doc.setFont("helvetica", "bold");
  doc.text("INFORMASI BALITA", 20, 30);
  
  doc.setFont("helvetica", "normal");
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
  doc.setFont("helvetica", "bold");
  doc.text("INFORMASI ORANG TUA", 20, yPosition);
  yPosition += 8;
  
  doc.setFont("helvetica", "normal");
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
  doc.setFont("helvetica", "bold");
  doc.text("RIWAYAT PEMERIKSAAN", 20, yPosition);
  yPosition += 8;
  
  doc.setFont("helvetica", "normal");
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
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  
  const headers = ["Tanggal", "BB (kg)", "TB (cm)", "L. Kepala (cm)", "L. Lengan (cm)", "Status Gizi"];
  headers.forEach((header, index) => {
    const x = colPositions[index] + colWidths[index] / 2;
    doc.text(header, x, yPosition + 5.5, { align: "center" });
  });
  
  yPosition += headerHeight;

  // Draw Rows
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  
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
      doc.setFont("helvetica", "bold");
      headers.forEach((header, index) => {
        const x = colPositions[index] + colWidths[index] / 2;
        doc.text(header, x, yPosition + 5.5, { align: "center" });
      });
      yPosition += headerHeight;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
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
  doc.setTextColor(150, 150, 150);
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
    doc.setTextColor(100, 100, 100);
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