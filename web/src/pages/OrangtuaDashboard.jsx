import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import logo from "../assets/POSCO_LOGO_KITA.png";
import { children, ibuHamil, jadwalSesi } from "../data/dummyData";

export default function OrangtuaDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("home");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedChildForDetail, setSelectedChildForDetail] = useState(null);
  const [showRiwayatModal, setShowRiwayatModal] = useState(false);
  const [selectedChildForRiwayat, setSelectedChildForRiwayat] = useState(null);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [childrenData, setChildrenData] = useState(children);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [editingChildId, setEditingChildId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("");

  // Filter data berdasarkan logged in user
  const myChildren = childrenData.filter(c => c.orangtuaId === user?.id);
  const myIbuHamil = ibuHamil;
  const mySchedules = jadwalSesi;
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

  const handleStatusChange = (childId, newStatus) => {
    setChildrenData(prevData => prevData.map(child => 
      child.id === childId ? { ...child, statusGizi: newStatus } : child
    ));
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
              <h2 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 24 }}>
                Selamat Datang, {user?.name}
              </h2>
              
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
              
              {/* Search & Filter */}
              <div style={{
                display: "flex",
                gap: 16,
                marginBottom: 24,
                alignItems: "center"
              }}>
                <input
                  type="text"
                  placeholder="Cari nama anak atau ibu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
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
                        {["Nama Anak", "Nama Ibu", "Wilayah", "BB / TB", "Status"].map(h => (
                          <th key={h} style={{ textAlign: "left", padding: 16, color: "#374151", fontWeight: 700, fontSize: 12 }}>{h}</th>
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
                            <td style={{ padding: 16, color: "#6B7280" }}>{child.namaIbu}</td>
                            <td style={{ padding: 16, color: "#6B7280" }}>{child.posyandu}</td>
                            <td style={{ padding: 16, color: "#6B7280" }}>
                              {child.beratBadan} kg / {child.tinggiBadan} cm
                            </td>
                            <td style={{ padding: 16 }}>
                              {editingChildId === child.id ? (
                                <div style={{ display: "flex", gap: 8 }}>
                                  <select
                                    value={editingStatus}
                                    onChange={(e) => setEditingStatus(e.target.value)}
                                    style={{
                                      padding: "6px 8px",
                                      borderRadius: 4,
                                      border: "1px solid #16A34A",
                                      fontSize: 12,
                                      background: "white",
                                      cursor: "pointer",
                                      fontFamily: "inherit"
                                    }}
                                  >
                                    <option value="">Pilih Status</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Gizi Kurang">Gizi Kurang</option>
                                    <option value="Gizi Lebih">Gizi Lebih</option>
                                  </select>
                                  <button
                                    onClick={() => handleStatusChange(child.id, editingStatus)}
                                    style={{
                                      padding: "6px 12px",
                                      borderRadius: 4,
                                      background: "#16A34A",
                                      color: "white",
                                      border: "none",
                                      cursor: "pointer",
                                      fontSize: 12,
                                      fontWeight: 600
                                    }}
                                  >
                                    Simpan
                                  </button>
                                  <button
                                    onClick={() => setEditingChildId(null)}
                                    style={{
                                      padding: "6px 12px",
                                      borderRadius: 4,
                                      background: "#E5E7EB",
                                      color: "#6B7280",
                                      border: "none",
                                      cursor: "pointer",
                                      fontSize: 12,
                                      fontWeight: 600
                                    }}
                                  >
                                    Batal
                                  </button>
                                </div>
                              ) : (
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
                                  <button
                                    onClick={() => {
                                      setEditingChildId(child.id);
                                      setEditingStatus(child.statusGizi);
                                    }}
                                    style={{
                                      padding: "4px 8px",
                                      borderRadius: 4,
                                      background: "#F3F4F6",
                                      border: "1px solid #D1D5DB",
                                      color: "#6B7280",
                                      cursor: "pointer",
                                      fontSize: 11,
                                      fontWeight: 600
                                    }}
                                  >
                                    Ubah
                                  </button>
                                </div>
                              )}
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
                      {mySchedules.map((schedule) => (
                        <tr key={schedule.id} style={{ borderBottom: "1px solid #E5E7EB" }}>
                          <td style={{ padding: 16, color: "#111827", fontWeight: 600 }}>{schedule.posyandu}</td>
                          <td style={{ padding: 16, color: "#6B7280" }}>
                            {new Date(schedule.tanggal).toLocaleDateString("id-ID")}
                          </td>
                          <td style={{ padding: 16, color: "#6B7280" }}>{schedule.waktu}</td>
                          <td style={{ padding: 16 }}>
                            <span style={{
                              display: "inline-block",
                              padding: "6px 12px",
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 600,
                              background: schedule.status === "Mendatang" ? "#F0FDF4" : "#F3F4F6",
                              color: schedule.status === "Mendatang" ? "#166534" : "#6B7280"
                            }}>
                              {schedule.status}
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
                      value={user?.name || ""}
                      disabled
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 4,
                        border: "1px solid #E5E7EB",
                        fontSize: 14,
                        background: "white",
                        color: "#111827"
                      }}
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
                        background: "white",
                        color: "#111827"
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
                        background: "white",
                        color: "#111827"
                      }}
                    />
                  </div>
                  <div>
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
                        background: "white",
                        color: "#111827"
                      }}
                    />
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