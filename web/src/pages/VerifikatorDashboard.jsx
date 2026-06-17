import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { api } from "../utils/api";
import EmptyState from "../components/EmptyState";
import logo from "../assets/POSCO_LOGO_KITA.png";

export default function VerifikatorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { success, error } = useNotification();
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "active"
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const loadCadres = useCallback(async () => {
    setLoading(true);
    try {
      const userList = await api.getUsers();
      // Only show cadres (kader and kader_pending)
      const cadresOnly = userList.filter(u => u.role === "kader" || u.role === "kader_pending");
      setUsers(cadresOnly);
    } catch (err) {
      console.error("Gagal memuat data kader:", err);
      error("⚠️ Gagal memuat data kader dari server");
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadCadres();
  }, [loadCadres]);

  const handleApprove = async (cadre) => {
    if (!window.confirm(`Setujui pendaftaran kader untuk ${cadre.name}?`)) return;
    setProcessingId(cadre.id);
    try {
      await api.updateUser(cadre.id, {
        name: cadre.name,
        email: cadre.email,
        role: "kader",
        wilayah: cadre.wilayah
      });
      
      setUsers(prev => prev.map(u => u.id === cadre.id ? { ...u, role: "kader", status: "Aktif" } : u));
      success(`✓ Kader ${cadre.name} berhasil diverifikasi!`);
    } catch (err) {
      error(`⚠️ Gagal menyetujui kader: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (cadre) => {
    if (!window.confirm(`Yakin ingin menolak dan menghapus pendaftaran kader untuk ${cadre.name}?`)) return;
    setProcessingId(cadre.id);
    try {
      await api.deleteUser(cadre.id);
      setUsers(prev => prev.filter(u => u.id !== cadre.id));
      success(`✓ Pendaftaran kader ${cadre.name} telah ditolak dan dihapus`);
    } catch (err) {
      error(`⚠️ Gagal menolak kader: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCadres = useMemo(() => {
    return users.filter(u => u.role === "kader_pending" && u.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [users, searchQuery]);

  const activeCadres = useMemo(() => {
    return users.filter(u => u.role === "kader" && u.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [users, searchQuery]);

  return (
    <div style={{
      width: "100vw",
      minHeight: "100vh",
      display: "flex",
      background: "#F8FAFC",
      fontFamily: "'Inter', sans-serif",
      margin: 0,
      padding: 0
    }}>
      {/* Sidebar */}
      <div style={{
        width: 280,
        background: "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
        padding: "24px 16px",
        minHeight: "100vh",
        color: "#fff",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 20px rgba(79, 70, 229, 0.15)"
      }}>
        {/* App Title */}
        <div style={{ marginBottom: 40, display: "flex", alignItems: "center", gap: 12 }}>
          <img 
            src={logo} 
            alt="POSCO Logo"
            style={{
              width: 40,
              height: 40,
              objectFit: "contain",
              background: "#fff",
              borderRadius: 8,
              padding: 4
            }}
          />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 0.5 }}>POSCO</div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>Verifikator Portal</div>
          </div>
        </div>

        {/* Navigation links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          <button
            onClick={() => setActiveTab("pending")}
            style={{
              background: activeTab === "pending" ? "rgba(255,255,255,0.2)" : "transparent",
              border: "none",
              color: "#fff",
              padding: "12px 16px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
              textAlign: "left",
              transition: "all 0.2s"
            }}
          >
            <span style={{ fontSize: 18 }}>📥</span>
            Menunggu Verifikasi
            {users.filter(u => u.role === "kader_pending").length > 0 && (
              <span style={{
                marginLeft: "auto",
                background: "#EF4444",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 10
              }}>
                {users.filter(u => u.role === "kader_pending").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("active")}
            style={{
              background: activeTab === "active" ? "rgba(255,255,255,0.2)" : "transparent",
              border: "none",
              color: "#fff",
              padding: "12px 16px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
              textAlign: "left",
              transition: "all 0.2s"
            }}
          >
            <span style={{ fontSize: 18 }}>👥</span>
            Kader Terverifikasi
          </button>
        </div>

        {/* User profile footer */}
        <div style={{
          marginTop: "auto",
          paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.15)",
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{user?.name || "Verifikator"}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>{user?.email}</div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              width: "100%",
              transition: "all 0.2s",
              fontFamily: "inherit"
            }}
            onMouseOver={(e) => {
              e.target.style.background = "rgba(239, 68, 68, 0.2)";
              e.target.style.borderColor = "rgba(239, 68, 68, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "rgba(255,255,255,0.15)";
              e.target.style.borderColor = "rgba(255,255,255,0.25)";
            }}
          >
            Logout Portal
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        marginLeft: 280,
        flex: 1,
        padding: "40px 48px",
        overflowY: "auto"
      }}>
        {/* Top Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
          paddingBottom: 20,
          borderBottom: "1px solid #E2E8F0"
        }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1E293B", margin: 0 }}>
              {activeTab === "pending" ? "Verifikasi Akun Kader" : "Kader Posyandu Aktif"}
            </h1>
            <p style={{ color: "#64748B", margin: "4px 0 0", fontSize: 14 }}>
              {activeTab === "pending"
                ? "Tinjau dan setujui berkas pendaftaran kader posyandu yang masuk."
                : "Daftar kader posyandu yang memiliki akses aktif ke sistem POSCO."}
            </p>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <input
              type="text"
              placeholder="Cari nama kader..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "1.5px solid #CBD5E1",
                fontSize: 14,
                outline: "none",
                width: 240,
                transition: "all 0.2s",
                background: "#fff"
              }}
              onFocus={(e) => e.target.style.borderColor = "#4F46E5"}
              onBlur={(e) => e.target.style.borderColor = "#CBD5E1"}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginBottom: 32
        }}>
          <div style={{
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
          }}>
            <div style={{ fontSize: 28 }}>📥</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#1E293B", margin: "6px 0 2px" }}>
              {users.filter(u => u.role === "kader_pending").length}
            </div>
            <div style={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>Menunggu Verifikasi</div>
          </div>

          <div style={{
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
          }}>
            <div style={{ fontSize: 28 }}>✅</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#1E293B", margin: "6px 0 2px" }}>
              {users.filter(u => u.role === "kader").length}
            </div>
            <div style={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>Kader Aktif</div>
          </div>

          <div style={{
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
          }}>
            <div style={{ fontSize: 28 }}>👥</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#1E293B", margin: "6px 0 2px" }}>
              {users.length}
            </div>
            <div style={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>Total Kader</div>
          </div>
        </div>

        {/* Content Lists */}
        {loading ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 80
          }}>
            <div style={{
              width: 32,
              height: 32,
              border: "3px solid #E2E8F0",
              borderTop: "3px solid #4F46E5",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <div style={{ marginTop: 16, fontSize: 14, color: "#64748B", fontWeight: 500 }}>Memuat data kader...</div>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : activeTab === "pending" ? (
          pendingCadres.length === 0 ? (
            <EmptyState
              icon="🎉"
              title="Tidak ada pendaftaran pending"
              description={searchQuery ? "Coba kata kunci pencarian yang lain" : "Semua pendaftaran kader posyandu telah diverifikasi!"}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {pendingCadres.map(cadre => (
                <div
                  key={cadre.id}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    padding: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)",
                    transition: "transform 0.2s, box-shadow 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.04), 0 4px 6px -2px rgba(0,0,0,0.02)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)";
                  }}
                >
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "rgba(79, 70, 229, 0.1)",
                      color: "#4F46E5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      fontWeight: 700
                    }}>
                      {cadre.name ? cadre.name.substring(0, 1).toUpperCase() : "K"}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E293B", margin: "0 0 4px" }}>
                        {cadre.name}
                      </h3>
                      <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#64748B" }}>
                        <span>📧 {cadre.email}</span>
                        {cadre.wilayah && <span>📍 {cadre.wilayah}</span>}
                        <span>🆔 NIK: {cadre.nik || "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={() => handleReject(cadre)}
                      disabled={processingId !== null}
                      style={{
                        background: "#FEF2F2",
                        color: "#EF4444",
                        border: "1px solid #FCA5A5",
                        padding: "8px 16px",
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = "#FEE2E2";
                        e.target.style.borderColor = "#F87171";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = "#FEF2F2";
                        e.target.style.borderColor = "#FCA5A5";
                      }}
                    >
                      Tolak
                    </button>

                    <button
                      onClick={() => handleApprove(cadre)}
                      disabled={processingId !== null}
                      style={{
                        background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                        color: "#fff",
                        border: "none",
                        padding: "8px 20px",
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        boxShadow: "0 2px 6px rgba(16, 185, 129, 0.2)",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = "translateY(-1px)";
                        e.target.style.boxShadow = "0 4px 10px rgba(16, 185, 129, 0.3)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 2px 6px rgba(16, 185, 129, 0.2)";
                      }}
                    >
                      Setujui Kader
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          activeCadres.length === 0 ? (
            <EmptyState
              icon="👥"
              title="Tidak ada kader aktif"
              description="Saat ini belum ada kader posyandu yang terverifikasi."
            />
          ) : (
            <div style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Nama</th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Email</th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Wilayah Tugas</th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>NIK</th>
                    <th style={{ padding: "16px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCadres.map(cadre => (
                    <tr key={cadre.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "16px", fontSize: 14, fontWeight: 600, color: "#1E293B" }}>{cadre.name}</td>
                      <td style={{ padding: "16px", fontSize: 14, color: "#64748B" }}>{cadre.email}</td>
                      <td style={{ padding: "16px", fontSize: 14, color: "#64748B" }}>📍 {cadre.wilayah || "Posyandu"}</td>
                      <td style={{ padding: "16px", fontSize: 14, color: "#64748B" }}>{cadre.nik || "-"}</td>
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <span style={{
                          background: "#E6F4EA",
                          color: "#137333",
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          display: "inline-block"
                        }}>
                          Aktif
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
