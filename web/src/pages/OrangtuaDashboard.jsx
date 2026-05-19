import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/POSCO_LOGO_KITA.png";

export default function OrangtuaDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("home");
  const [selectedChild, setSelectedChild] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dummy data for children
  const children = [
    {
      id: 1,
      name: "Ade Putra Wijaya",
      age: 2.5,
      birthDate: "2024-12-15",
      gender: "Laki-laki",
      nik: "3271060001000001",
      weight: 12.5,
      height: 88,
      lastCheckup: "2025-04-20",
      status: "Baik",
      statusColor: "#10B981",
      bmi: 16.1,
      umur: "2 tahun 5 bulan",
      photoUrl: "👦"
    },
    {
      id: 2,
      name: "Siti Maryam Putri",
      age: 1.2,
      birthDate: "2025-01-10",
      gender: "Perempuan",
      nik: "3271060001000002",
      weight: 9.8,
      height: 75,
      lastCheckup: "2025-04-18",
      status: "Baik",
      statusColor: "#10B981",
      bmi: 17.4,
      umur: "1 tahun 2 bulan",
      photoUrl: "👧"
    }
  ];

  // Growth data
  const growthData = [
    { month: "Jan", weight: 8.2, height: 65, bmi: 19.4 },
    { month: "Feb", weight: 8.9, height: 68, bmi: 19.1 },
    { month: "Mar", weight: 9.5, height: 71, bmi: 18.8 },
    { month: "Apr", weight: 10.2, height: 74, bmi: 18.6 },
    { month: "May", weight: 10.8, height: 76, bmi: 18.7 },
    { month: "Jun", weight: 11.5, height: 79, bmi: 18.4 },
  ];

  // Schedule data
  const schedules = [
    {
      id: 1,
      childName: "Ade Putra Wijaya",
      date: "2025-05-15",
      time: "09:00",
      location: "Posyandu Melati",
      type: "Pengecekan Rutin",
      status: "Mendatang"
    },
    {
      id: 2,
      childName: "Siti Maryam Putri",
      date: "2025-05-10",
      time: "10:30",
      location: "Posyandu Bunga Raya",
      type: "Imunisasi",
      status: "Mendatang"
    },
    {
      id: 3,
      childName: "Ade Putra Wijaya",
      date: "2025-04-20",
      time: "14:00",
      location: "Posyandu Melati",
      type: "Pengecekan Rutin",
      status: "Selesai"
    }
  ];

  const currentChild = children[selectedChild];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div style={{
      width: "100vw",
      minHeight: "100vh",
      display: "flex",
      background: "#F0F9F4",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 280 : 80,
        background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
        padding: sidebarOpen ? "24px 16px" : "24px 12px",
        color: "white",
        transition: "all 0.3s ease",
        boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
        position: "fixed",
        height: "100vh",
        overflowY: "auto",
        zIndex: 50
      }}>
        {/* Logo */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 32,
          paddingBottom: 20,
          borderBottom: "1px solid rgba(255,255,255,0.2)"
        }}>
          <img src={logo} alt="POSCO Logo" style={{ 
            width: 42, 
            height: 42, 
            objectFit: "contain",
            flexShrink: 0
          }} />
          {sidebarOpen && (
            <div style={{ 
              fontWeight: 800, 
              fontSize: 18,
              letterSpacing: "-0.5px",
              whiteSpace: "nowrap",
              color: "#fff"
            }}>
              POSCO
            </div>
          )}
        </div>

        {/* Menu */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { id: "home", label: "Beranda", icon: "🏠" },
            { id: "child", label: "Data Anak", icon: "👶" },
            { id: "growth", label: "Grafik Pertumbuhan", icon: "📊" },
            { id: "schedule", label: "Jadwal Kunjungan", icon: "📅" },
            { id: "profile", label: "Profil Saya", icon: "👤" },
            { id: "download", label: "Unduh Aplikasi", icon: "📱" },
          ].map(menu => (
            <button
              key={menu.id}
              onClick={() => setActiveMenu(menu.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 10,
                background: activeMenu === menu.id ? "rgba(255,255,255,0.25)" : "transparent",
                border: activeMenu === menu.id ? "1px solid rgba(255,255,255,0.3)" : "none",
                color: "white",
                cursor: "pointer",
                fontSize: sidebarOpen ? 14 : 12,
                fontWeight: 600,
                transition: "all 0.3s ease",
                width: "100%",
                justifyContent: sidebarOpen ? "flex-start" : "center",
                fontFamily: "inherit"
              }}
              onMouseOver={(e) => {
                if (activeMenu !== menu.id) {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                }
              }}
              onMouseOut={(e) => {
                if (activeMenu !== menu.id) {
                  e.target.style.background = "transparent";
                }
              }}
            >
              <span style={{ fontSize: 18 }}>{menu.icon}</span>
              {sidebarOpen && menu.label}
            </button>
          ))}
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            width: sidebarOpen ? "calc(100% - 28px)" : 44,
            padding: "10px 14px",
            marginTop: "auto",
            borderRadius: 10,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            transition: "all 0.3s ease",
            fontFamily: "inherit"
          }}
        >
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? 280 : 80,
        transition: "margin-left 0.3s ease"
      }}>
        {/* Top Bar */}
        <div style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          padding: "14px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #E5E7EB",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 40
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <img src={logo} alt="POSCO Logo" style={{ 
              width: 44, 
              height: 44, 
              objectFit: "contain",
              flexShrink: 0
            }} />
            <div style={{ borderLeft: "2px solid #E5E7EB", paddingLeft: 18 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0, letterSpacing: "-0.5px" }}>
                POSCO
              </h1>
              <p style={{ fontSize: 12, color: "#6B7280", margin: "2px 0 0" }}>
                Dashboard Orang Tua
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "#FEF2F2",
              border: "1px solid #FCA5A5",
              color: "#DC2626",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              transition: "all 0.3s ease",
              fontFamily: "inherit"
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#FEE2E2";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#FEF2F2";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Keluar
          </button>
        </div>

        {/* Content Area */}
        <div style={{
          padding: "32px",
          overflow: "auto",
          height: "calc(100vh - 90px)"
        }}>
          {/* HOME */}
          {activeMenu === "home" && (
            <div>
              {/* Welcome Card */}
              <div style={{
                background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                borderRadius: 16,
                padding: 32,
                color: "white",
                marginBottom: 32,
                boxShadow: "0 12px 32px rgba(22, 163, 74, 0.2)"
              }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Selamat Datang, {user?.email}! 👋</h2>
                <p style={{ fontSize: 15, opacity: 0.9, margin: "8px 0 0" }}>
                  Pantau perkembangan kesehatan anak Anda secara real-time melalui sistem POSCO
                </p>
              </div>

              {/* Child Cards */}
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Data Anak Anda</h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: 20
                }}>
                  {children.map((child, idx) => (
                    <div
                      key={child.id}
                      style={{
                        background: "white",
                        borderRadius: 16,
                        overflow: "hidden",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        border: selectedChild === idx ? "2px solid #16A34A" : "1px solid #E5E7EB"
                      }}
                      onClick={() => setSelectedChild(idx)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow = "0 12px 32px rgba(22, 163, 74, 0.15)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                      }}
                    >
                      {/* Top Color Bar */}
                      <div style={{
                        height: 4,
                        background: "linear-gradient(90deg, #16A34A, #15803D)"
                      }} />

                      {/* Content */}
                      <div style={{ padding: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                          <div style={{
                            width: 60,
                            height: 60,
                            borderRadius: 12,
                            background: "#F0FDF4",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 32
                          }}>
                            {child.photoUrl}
                          </div>
                          <div>
                            <h4 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>
                              {child.name}
                            </h4>
                            <p style={{ fontSize: 12, color: "#6B7280", margin: "2px 0 0" }}>
                              {child.umur}
                            </p>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 12,
                          marginBottom: 16
                        }}>
                          {[
                            { label: "BB", value: `${child.weight} kg` },
                            { label: "TB", value: `${child.height} cm` },
                            { label: "BMI", value: child.bmi },
                            { label: "Status", value: child.status }
                          ].map((stat, i) => (
                            <div key={i} style={{
                              background: "#F9FAFB",
                              padding: 12,
                              borderRadius: 8,
                              textAlign: "center"
                            }}>
                              <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>{stat.label}</p>
                              <p style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: stat.label === "Status" ? child.statusColor : "#111827",
                                margin: "4px 0 0"
                              }}>
                                {stat.value}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div style={{ fontSize: 12, color: "#6B7280", paddingTop: 12, borderTop: "1px solid #E5E7EB" }}>
                          Pemeriksaan terakhir: {formatDate(child.lastCheckup)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CHILD DATA */}
          {activeMenu === "child" && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 24 }}>Detail Data Anak</h2>

              {/* Child Selection */}
              <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                {children.map((child, idx) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(idx)}
                    style={{
                      padding: "12px 20px",
                      borderRadius: 10,
                      background: selectedChild === idx ? "#16A34A" : "#F3F4F6",
                      color: selectedChild === idx ? "white" : "#111827",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 14,
                      transition: "all 0.3s ease",
                      fontFamily: "inherit"
                    }}
                  >
                    {child.name}
                  </button>
                ))}
              </div>

              {/* Profile Card */}
              <div style={{
                background: "white",
                borderRadius: 16,
                padding: 32,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
              }}>
                <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
                  <div style={{
                    width: 120,
                    height: 120,
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #16A34A, #15803D)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 64,
                    flexShrink: 0
                  }}>
                    {currentChild.photoUrl}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0, marginBottom: 4 }}>
                      {currentChild.name}
                    </h3>
                    <p style={{ fontSize: 14, color: "#6B7280", margin: 0, marginBottom: 16 }}>
                      {currentChild.umur}
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                      {[
                        { label: "Jenis Kelamin", value: currentChild.gender },
                        { label: "Tanggal Lahir", value: formatDate(currentChild.birthDate) },
                        { label: "Status Kesehatan", value: currentChild.status }
                      ].map((item, i) => (
                        <div key={i}>
                          <p style={{ fontSize: 12, color: "#6B7280", margin: 0, marginBottom: 4 }}>{item.label}</p>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Measurements Table */}
                <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 24 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Pengukuran Terkini</h4>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 16
                  }}>
                    {[
                      { label: "Berat Badan", value: currentChild.weight, unit: "kg" },
                      { label: "Tinggi Badan", value: currentChild.height, unit: "cm" },
                      { label: "BMI", value: currentChild.bmi, unit: "" },
                      { label: "Pemeriksaan Terakhir", value: formatDate(currentChild.lastCheckup), unit: "" }
                    ].map((item, i) => (
                      <div key={i} style={{
                        background: "#F9FAFB",
                        padding: 16,
                        borderRadius: 10,
                        textAlign: "center"
                      }}>
                        <p style={{ fontSize: 12, color: "#6B7280", margin: 0, marginBottom: 8 }}>{item.label}</p>
                        <p style={{ fontSize: 20, fontWeight: 800, color: "#16A34A", margin: 0 }}>
                          {item.value}
                          {item.unit && <span style={{ fontSize: 14, color: "#6B7280", marginLeft: 4 }}>{item.unit}</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GROWTH CHART */}
          {activeMenu === "growth" && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 24 }}>Grafik Pertumbuhan</h2>

              {/* Child Selection */}
              <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                {children.map((child, idx) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(idx)}
                    style={{
                      padding: "12px 20px",
                      borderRadius: 10,
                      background: selectedChild === idx ? "#16A34A" : "#F3F4F6",
                      color: selectedChild === idx ? "white" : "#111827",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 14,
                      transition: "all 0.3s ease",
                      fontFamily: "inherit"
                    }}
                  >
                    {child.name}
                  </button>
                ))}
              </div>

              {/* Charts Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 24
              }}>
                {[
                  { title: "Berat Badan", data: "weight", unit: "kg", icon: "⚖️" },
                  { title: "Tinggi Badan", data: "height", unit: "cm", icon: "📏" },
                  { title: "BMI", data: "bmi", unit: "", icon: "📊" },
                  { title: "Kurva KMS", data: "weight", unit: "", icon: "📈" }
                ].map((chart, i) => (
                  <div key={i} style={{
                    background: "white",
                    borderRadius: 16,
                    padding: 24,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                      <div style={{ fontSize: 24 }}>{chart.icon}</div>
                      <div>
                        <h4 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>{chart.title}</h4>
                        {chart.unit && <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>Satuan: {chart.unit}</p>}
                      </div>
                    </div>

                    {/* Simple Chart Visualization */}
                    <div style={{
                      height: 200,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-around",
                      gap: 8,
                      padding: "16px 0",
                      borderBottom: "2px solid #E5E7EB"
                    }}>
                      {growthData.map((d, idx) => {
                        let value = d[chart.data];
                        let maxValue = chart.data === "weight" ? 12 : chart.data === "height" ? 80 : 20;
                        let height = (value / maxValue) * 150;
                        return (
                          <div
                            key={idx}
                            style={{
                              flex: 1,
                              height: height,
                              background: "linear-gradient(180deg, #16A34A, #D1FAE5)",
                              borderRadius: "8px 8px 0 0",
                              transition: "all 0.3s ease",
                              cursor: "pointer"
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = "scaleY(1.1)";
                              e.currentTarget.style.filter = "brightness(1.1)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = "scaleY(1)";
                              e.currentTarget.style.filter = "brightness(1)";
                            }}
                            title={`${d.month}: ${value}${chart.unit}`}
                          />
                        );
                      })}
                    </div>

                    {/* Labels */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-around",
                      marginTop: 12
                    }}>
                      {growthData.map((d, idx) => (
                        <span key={idx} style={{ fontSize: 11, color: "#6B7280", fontWeight: 600 }}>
                          {d.month}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCHEDULE */}
          {activeMenu === "schedule" && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 24 }}>Jadwal Kunjungan</h2>

              <div style={{
                background: "white",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
              }}>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse"
                }}>
                  <thead>
                    <tr style={{ background: "#F3F4F6", borderBottom: "2px solid #E5E7EB" }}>
                      {["Nama Anak", "Tanggal", "Jam", "Lokasi", "Tipe", "Status"].map(h => (
                        <th
                          key={h}
                          style={{
                            padding: "16px",
                            textAlign: "left",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#374151",
                            textTransform: "uppercase",
                            letterSpacing: 0.5
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule, idx) => (
                      <tr key={schedule.id} style={{
                        borderBottom: idx < schedules.length - 1 ? "1px solid #E5E7EB" : "none",
                        transition: "background 0.3s ease"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#F9FAFB";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                      >
                        <td style={{ padding: "16px", fontSize: 14, color: "#111827", fontWeight: 600 }}>
                          {schedule.childName}
                        </td>
                        <td style={{ padding: "16px", fontSize: 14, color: "#6B7280" }}>
                          {formatDate(schedule.date)}
                        </td>
                        <td style={{ padding: "16px", fontSize: 14, color: "#6B7280" }}>
                          {schedule.time}
                        </td>
                        <td style={{ padding: "16px", fontSize: 14, color: "#6B7280" }}>
                          {schedule.location}
                        </td>
                        <td style={{ padding: "16px", fontSize: 14, color: "#6B7280" }}>
                          {schedule.type}
                        </td>
                        <td style={{ padding: "16px" }}>
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
            </div>
          )}

          {/* PROFILE */}
          {activeMenu === "profile" && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 24 }}>Profil Saya</h2>

              <div style={{
                background: "white",
                borderRadius: 16,
                padding: 32,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                maxWidth: 600
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
                  <div style={{
                    width: 100,
                    height: 100,
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #16A34A, #15803D)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 48
                  }}>
                    👨‍👩‍👧
                  </div>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 }}>Profil Orang Tua</h3>
                    <p style={{ fontSize: 14, color: "#6B7280", margin: "4px 0 0" }}>{user?.email}</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
                  {[
                    { label: "Email", value: user?.email },
                    { label: "Role", value: "Orang Tua" },
                    { label: "Jumlah Anak", value: children.length },
                    { label: "Status Akun", value: "Aktif" }
                  ].map((item, i) => (
                    <div key={i} style={{ borderBottom: "1px solid #E5E7EB", paddingBottom: 16 }}>
                      <p style={{ fontSize: 12, color: "#6B7280", margin: 0, marginBottom: 4 }}>{item.label}</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 10,
                    background: "#FEF2F2",
                    border: "1px solid #FCA5A5",
                    color: "#DC2626",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 14,
                    transition: "all 0.3s ease",
                    fontFamily: "inherit"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#FEE2E2";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#FEF2F2";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Keluar dari Akun
                </button>
              </div>
            </div>
          )}

          {/* DOWNLOAD APP */}
          {activeMenu === "download" && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 24 }}>Unduh Aplikasi Mobile</h2>

              <div style={{
                background: "linear-gradient(135deg, #F0F9F4 0%, #E0F7EE 100%)",
                borderRadius: 20,
                padding: 48,
                border: "2px solid #DCFCE7",
                textAlign: "center",
                maxWidth: 700,
                margin: "0 auto"
              }}>
                <div style={{
                  fontSize: 64,
                  marginBottom: 24,
                  display: "flex",
                  justifyContent: "center",
                  gap: 16
                }}>
                  📱 ✨
                </div>

                <h3 style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#111827",
                  marginBottom: 12
                }}>
                  POSCO Mobile App
                </h3>

                <p style={{
                  fontSize: 16,
                  color: "#6B7280",
                  marginBottom: 32,
                  lineHeight: 1.7
                }}>
                  Pantau kesehatan anak Anda kapan saja, di mana saja dengan aplikasi mobile POSCO. Dapatkan notifikasi real-time untuk jadwal kunjungan dan hasil pemeriksaan.
                </p>

                <div style={{
                  display: "flex",
                  gap: 20,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginBottom: 32
                }}>
                  {/* App Store Badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#000",
                      color: "#fff",
                      padding: "12px 20px",
                      borderRadius: 12,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      flex: "1 1 auto",
                      minWidth: 180,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.2)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 24 }}>🍎</span>
                      <div>
                        <div style={{ fontSize: 10, opacity: 0.8 }}>Download on</div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>App Store</div>
                      </div>
                    </div>
                  </div>

                  {/* Google Play Badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#fff",
                      color: "#111827",
                      border: "2px solid #DCFCE7",
                      padding: "12px 20px",
                      borderRadius: 12,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      flex: "1 1 auto",
                      minWidth: 180,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 28px rgba(22, 163, 74, 0.15)";
                      e.currentTarget.style.borderColor = "#16A34A";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "#DCFCE7";
                    }}
                  >
                    <div style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 24 }}>▶️</span>
                      <div>
                        <div style={{ fontSize: 10, opacity: 0.8, color: "#6B7280" }}>Get it on</div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>Play Store</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: 16,
                  marginTop: 32,
                  paddingTop: 32,
                  borderTop: "1px solid rgba(22, 163, 74, 0.2)"
                }}>
                  {[
                    { icon: "⚡", label: "Akses Cepat" },
                    { icon: "🔔", label: "Notifikasi Penting" },
                    { icon: "📊", label: "Laporan Lengkap" },
                    { icon: "🔒", label: "Keamanan Data" },
                  ].map((feature, idx) => (
                    <div key={idx} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{feature.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>
                        {feature.label}
                      </div>
                    </div>
                  ))}
                </div>

                <p style={{
                  fontSize: 13,
                  color: "#6B7280",
                  marginTop: 32,
                  fontStyle: "italic"
                }}>
                  Tersedia di iOS 12+ dan Android 8+
                </p>
              </div>

              {/* System Requirements */}
              <div style={{
                marginTop: 40,
                background: "white",
                borderRadius: 16,
                padding: 32,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
              }}>
                <h4 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: 20
                }}>
                  Persyaratan Sistem
                </h4>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 24
                }}>
                  <div>
                    <h5 style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }}>
                      <span>🍎</span> iOS
                    </h5>
                    <ul style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      fontSize: 13,
                      color: "#6B7280",
                      lineHeight: 2
                    }}>
                      <li>✓ iOS 12 atau lebih baru</li>
                      <li>✓ 50 MB storage</li>
                      <li>✓ Koneksi internet stabil</li>
                    </ul>
                  </div>

                  <div>
                    <h5 style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }}>
                      <span>▶️</span> Android
                    </h5>
                    <ul style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      fontSize: 13,
                      color: "#6B7280",
                      lineHeight: 2
                    }}>
                      <li>✓ Android 8 atau lebih baru</li>
                      <li>✓ 45 MB storage</li>
                      <li>✓ Koneksi internet stabil</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

