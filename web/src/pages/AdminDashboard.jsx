import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import ModalForm from "./ModalForm";
import EmptyState from "../components/EmptyState";
import logo from "../assets/POSCO_LOGO_KITA.png";

// Dummy Data
const dummyUsers = [
  { id: 1, name: "Siti Kader", role: "kader", wilayah: "Kecamatan Padang Utara", status: "Aktif" },
  { id: 2, name: "Budi Admin", role: "admin", wilayah: "Kota Padang", status: "Aktif" },
  { id: 3, name: "Rina Orangtua", role: "orangtua", wilayah: "Kecamatan Padang Timur", status: "Aktif" },
  { id: 4, name: "Susi Kader", role: "kader", wilayah: "Kecamatan Padang Selatan", status: "Aktif" },
];

const dummyPosyandu = [
  { id: 1, name: "Posyandu Harapan", kecamatan: "Padang Utara", kelurahan: "Ujung Gurun", status: "Aktif" },
  { id: 2, name: "Posyandu Sehat", kecamatan: "Padang Timur", kelurahan: "Sawahan", status: "Aktif" },
  { id: 3, name: "Posyandu Maju", kecamatan: "Padang Selatan", kelurahan: "Teluk Bayur", status: "Aktif" },
];

const dummyChildren = [
  { id: 1, name: "Aditya", mother: "Siti Nurhaliza", wilayah: "Padang Utara", status: "Normal", bb: 12, tb: 85 },
  { id: 2, name: "Rasyid", mother: "Erni Wijaya", wilayah: "Padang Timur", status: "Risiko", bb: 10, tb: 80 },
  { id: 3, name: "Maya", mother: "Linda Safitri", wilayah: "Padang Selatan", status: "Stunting", bb: 9, tb: 75 },
  { id: 4, name: "Hana", mother: "Dewi Lestari", wilayah: "Padang Utara", status: "Normal", bb: 13, tb: 88 },
  { id: 5, name: "Aldi", mother: "Nita Kusuma", wilayah: "Padang Timur", status: "Risiko", bb: 11, tb: 82 },
];

const dummyNotifications = [
  { id: 1, message: "Kunjungan Posyandu Harapan ditambahkan", time: "2 jam lalu", type: "info" },
  { id: 2, message: "Data stunting ditemukan di Padang Selatan", time: "4 jam lalu", type: "warning" },
  { id: 3, message: "User baru terdaftar: Rina Orangtua", time: "6 jam lalu", type: "success" },
];

const trendData = [
  { month: "Jan", posyandu: 40, kunjungan: 120, anak: 240, stunting: 24 },
  { month: "Feb", posyandu: 45, kunjungan: 130, anak: 260, stunting: 26 },
  { month: "Mar", posyandu: 48, kunjungan: 145, anak: 280, stunting: 28 },
  { month: "Apr", posyandu: 50, kunjungan: 155, anak: 300, stunting: 30 },
  { month: "May", posyandu: 52, kunjungan: 165, anak: 320, stunting: 32 },
  { month: "Jun", posyandu: 55, kunjungan: 180, anak: 350, stunting: 35 },
];

const wilayahData = [
  { wilayah: "Padang Utara", total: 85, normal: 65, risiko: 15, stunting: 5 },
  { wilayah: "Padang Timur", total: 92, normal: 70, risiko: 18, stunting: 4 },
  { wilayah: "Padang Selatan", total: 78, normal: 55, risiko: 18, stunting: 5 },
  { wilayah: "Padang Barat", total: 88, normal: 68, risiko: 16, stunting: 4 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { success, error, warning } = useNotification();
  const [activePage, setActivePage] = useState("dashboard");
  const [users, setUsers] = useState(dummyUsers);
  const [posyandus, setPosyandus] = useState(dummyPosyandu);
  const [children, setChildren] = useState(dummyChildren);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "user", "posyandu", "child"
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [formData, setFormData] = useState({});
  const [editingChildStatus, setEditingChildStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // useCallback untuk form handler - tidak akan recreate setiap render
  const handleFormChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Filter children
  const filteredChildren = useMemo(() => {
    return children.filter((child) => {
      const matchesSearch =
        child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        child.mother.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = !filterStatus || child.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterStatus, children]);

  // Handlers
  const handleAddClick = (type) => {
    setModalType(type);
    setEditingId(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEditClick = (type, item) => {
    setModalType(type);
    setEditingId(item.id);
    setFormData(item);
    setShowModal(true);
  };

  const handleDeleteClick = (type, id) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      if (type === "user") {
        setUsers(users.filter((u) => u.id !== id));
        success("✓ User berhasil dihapus");
      }
      if (type === "posyandu") {
        setPosyandus(posyandus.filter((p) => p.id !== id));
        success("✓ Posyandu berhasil dihapus");
      }
      if (type === "child") {
        setChildren(children.filter((c) => c.id !== id));
        success("✓ Data anak berhasil dihapus");
      }
    }
  };

  const handleSaveClick = () => {
    if (!formData.name) {
      error("⚠️ Nama harus diisi");
      return;
    }

    if (editingId) {
      if (modalType === "user")
        setUsers(users.map((u) => (u.id === editingId ? { ...u, ...formData } : u)));
      if (modalType === "posyandu")
        setPosyandus(posyandus.map((p) => (p.id === editingId ? { ...p, ...formData } : p)));
      if (modalType === "child")
        setChildren(children.map((c) => (c.id === editingId ? { ...c, ...formData } : c)));
      
      success("✓ Data berhasil diperbarui");
    } else {
      const newId = Math.max(...(modalType === "user" ? users : modalType === "posyandu" ? posyandus : children).map((i) => i.id), 0) + 1;
      const newItem = { id: newId, ...formData };
      if (modalType === "user") setUsers([...users, newItem]);
      if (modalType === "posyandu") setPosyandus([...posyandus, newItem]);
      if (modalType === "child") setChildren([...children, newItem]);
      
      success("✓ Data baru berhasil ditambahkan");
    }
    setShowModal(false);
  };

  const getStatusColor = (status) => {
    if (status === "Normal") return "#16A34A";
    if (status === "Risiko") return "#D97706";
    if (status === "Stunting") return "#DC2626";
    return "#6B7280";
  };

  const handleStatusChange = (childId, newStatusValue) => {
    setChildren(children.map(child =>
      child.id === childId ? { ...child, status: newStatusValue } : child
    ));
    setEditingChildStatus(null);
    setNewStatus("");
    success("✓ Status anak berhasil diperbarui");
  };

  // Component: Sidebar
  const Sidebar = () => (
    <div
      style={{
        width: 280,
        background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
        padding: "24px 16px",
        minHeight: "100vh",
        color: "#fff",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
      }}
    >
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
        <div style={{ fontSize: 18, fontWeight: 800 }}>POSCO</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { id: "dashboard", label: "Dashboard", icon: "📊" },
          { id: "users", label: "Manajemen User", icon: "👥" },
          { id: "posyandu", label: "Wilayah & Posyandu", icon: "🏥" },
          { id: "monitoring", label: "Monitoring Anak", icon: "👶" },
          { id: "analytics", label: "Analitik", icon: "📈" },
        ].map((menu) => (
          <button
            key={menu.id}
            onClick={() => setActivePage(menu.id)}
            className="sidebar-link"
            style={{
              background: activePage === menu.id ? "rgba(255,255,255,0.25)" : "transparent",
              border: activePage === menu.id ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent",
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
              if (activePage !== menu.id) {
                e.target.style.background = "rgba(255,255,255,0.15)";
              }
            }}
            onMouseOut={(e) => {
              if (activePage !== menu.id) {
                e.target.style.background = "transparent";
              }
            }}
          >
            <span style={{ fontSize: 18 }}>{menu.icon}</span>
            {menu.label}
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: "auto",
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.2)",
          marginTop: 40,
        }}
      >
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
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
          Logout
        </button>
      </div>
    </div>
  );

  // Component: Dashboard
  const Dashboard = () => (
    <div className="fade-in">
      {/* Greeting Section */}
      <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #E5E7EB" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: "#111827" }}>
          Selamat Datang, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280" }}>
          Wilayah: <strong>{user?.wilayah || "Kota Padang"}</strong> | Role: <strong>Administrator</strong>
        </p>
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, color: "#111827" }}>
        Dashboard
      </h2>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          marginBottom: 40,
        }}
      >
        {[
          { title: "Total Posyandu", value: "55", icon: "🏥", trend: "+5 bulan ini" },
          { title: "Kunjungan", value: "180", icon: "📅", trend: "+15 bulan ini" },
          { title: "Anak Terdaftar", value: "350", icon: "👶", trend: "+30 bulan ini" },
          { title: "Status Stunting", value: "35", icon: "⚠️", trend: "+3 bulan ini" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="card-hover"
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 28 }}>{stat.icon}</div>
              <span style={{ fontSize: 12, color: "#16A34A", fontWeight: 600 }}>
                {stat.trend}
              </span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>{stat.title}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Trend Chart */}
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 12,
            border: "1px solid #E5E7EB",
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: "#111827" }}>
            Tren 6 Bulan
          </h3>
          <div style={{ height: 250, display: "flex", alignItems: "flex-end", gap: 12 }}>
            {trendData.map((data, idx) => (
              <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    height: `${(data.anak / 350) * 200}px`,
                    background: "linear-gradient(180deg, #16A34A 0%, #D1FAE5 100%)",
                    borderRadius: "8px 8px 0 0",
                    marginBottom: 8,
                  }}
                />
                <div style={{ fontSize: 11, color: "#6B7280", textAlign: "center" }}>
                  {data.month}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 12,
            border: "1px solid #E5E7EB",
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#111827" }}>
            Notifikasi
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {dummyNotifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  padding: 12,
                  background: "#F9FAFB",
                  borderRadius: 8,
                  borderLeft: `3px solid ${
                    notif.type === "warning"
                      ? "#D97706"
                      : notif.type === "success"
                      ? "#16A34A"
                      : "#3B82F6"
                  }`,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>
                  {notif.message}
                </div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
                  {notif.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Component: User Management
  const UserManagement = () => (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>Manajemen User</h2>
        <button
          className="btn-hover"
          onClick={() => handleAddClick("user")}
          style={{
            background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
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
          + Tambah User
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #E5E7EB",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>
                Nama
              </th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>
                Role
              </th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>
                Wilayah
              </th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>
                Status
              </th>
              <th style={{ padding: "16px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #E5E7EB" }}>
                <td style={{ padding: "16px", fontSize: 14, color: "#111827" }}>{user.name}</td>
                <td style={{ padding: "16px", fontSize: 14, color: "#111827" }}>
                  <span className="status-badge status-active">{user.role}</span>
                </td>
                <td style={{ padding: "16px", fontSize: 14, color: "#6B7280" }}>{user.wilayah}</td>
                <td style={{ padding: "16px", fontSize: 14, color: "#111827" }}>
                  <span className="status-badge status-active">{user.status}</span>
                </td>
                <td style={{ padding: "16px", textAlign: "center" }}>
                  <button
                    onClick={() => handleEditClick("user", user)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#3B82F6",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 12,
                      transition: "all 0.2s ease",
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
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick("user", user.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#DC2626",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.color = "#991B1B";
                      e.target.style.textDecoration = "underline";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = "#DC2626";
                      e.target.style.textDecoration = "none";
                    }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Component: Posyandu Management
  const PosyanduManagement = () => (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>Wilayah & Posyandu</h2>
        <button
          className="btn-hover"
          onClick={() => handleAddClick("posyandu")}
          style={{
            background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
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
          + Tambah Posyandu
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #E5E7EB",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>
                Nama Posyandu
              </th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>
                Kecamatan
              </th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>
                Kelurahan
              </th>
              <th style={{ padding: "16px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {posyandus.map((posyandu) => (
              <tr key={posyandu.id} style={{ borderBottom: "1px solid #E5E7EB" }}>
                <td style={{ padding: "16px", fontSize: 14, color: "#111827", fontWeight: 600 }}>
                  {posyandu.name}
                </td>
                <td style={{ padding: "16px", fontSize: 14, color: "#6B7280" }}>
                  {posyandu.kecamatan}
                </td>
                <td style={{ padding: "16px", fontSize: 14, color: "#6B7280" }}>
                  {posyandu.kelurahan}
                </td>
                <td style={{ padding: "16px", textAlign: "center" }}>
                  <button
                    onClick={() => handleEditClick("posyandu", posyandu)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#3B82F6",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      marginRight: 12,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick("posyandu", posyandu.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#DC2626",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Component: Monitoring Anak
  const MonitoringAnak = () => (
    <div className="fade-in">
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, color: "#111827" }}>
        Monitoring Anak
      </h2>

      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Cari nama anak atau ibu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 16px",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            fontSize: 14,
          }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "10px 16px",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          <option value="">Semua Status</option>
          <option value="Normal">Normal</option>
          <option value="Risiko">Risiko</option>
          <option value="Stunting">Stunting</option>
        </select>
      </div>

      {filteredChildren.length === 0 ? (
        <EmptyState
          icon="📊"
          title="Tidak Ada Data"
          description={searchQuery || filterStatus ? "Coba ubah filter atau pencarian Anda" : "Belum ada data anak yang tersimpan"}
          actionLabel={searchQuery || filterStatus ? "Reset Filter" : undefined}
          onAction={() => {
            setSearchQuery("");
            setFilterStatus("");
          }}
        />
      ) : (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 16 }}>
            Menampilkan <strong>{filteredChildren.length}</strong> dari <strong>{children.length}</strong> data anak
          </p>
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>
                    Nama Anak
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>
                    Nama Ibu
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>
                    Wilayah
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>
                    BB / TB
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredChildren.map((child) => (
              <tr key={child.id} style={{ borderBottom: "1px solid #E5E7EB" }}>
                <td style={{ padding: "16px", fontSize: 14, color: "#111827", fontWeight: 600 }}>
                  {child.name}
                </td>
                <td style={{ padding: "16px", fontSize: 14, color: "#6B7280" }}>
                  {child.mother}
                </td>
                <td style={{ padding: "16px", fontSize: 14, color: "#6B7280" }}>
                  {child.wilayah}
                </td>
                <td style={{ padding: "16px", fontSize: 14, color: "#6B7280" }}>
                  {child.bb} kg / {child.tb} cm
                </td>
                <td style={{ padding: "16px" }}>
                  {editingChildStatus === child.id ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
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
                        <option value="Risiko">Risiko</option>
                        <option value="Stunting">Stunting</option>
                      </select>
                      <button
                        onClick={() => handleStatusChange(child.id, newStatus)}
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
                        onClick={() => {
                          setEditingChildStatus(null);
                          setNewStatus("");
                        }}
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
                      <span
                        className={`status-badge status-${child.status.toLowerCase()}`}
                        style={{
                          background: getStatusColor(child.status) + "20",
                          color: getStatusColor(child.status),
                          padding: "6px 12px",
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          display: "inline-block"
                        }}
                      >
                        {child.status}
                      </span>
                      <button
                        onClick={() => {
                          setEditingChildStatus(child.id);
                          setNewStatus(child.status);
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
            ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // Component: Analytics
  const Analytics = () => (
    <div className="fade-in">
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, color: "#111827" }}>
        Analitik
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        {/* Line Chart */}
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 12,
            border: "1px solid #E5E7EB",
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: "#111827" }}>
            Tren Pertumbuhan Anak
          </h3>
          <div style={{ height: 250, display: "flex", alignItems: "flex-end", gap: 8 }}>
            {trendData.map((data, idx) => (
              <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    height: `${(data.anak / 350) * 200}px`,
                    background: "linear-gradient(180deg, #16A34A 0%, #D1FAE5 100%)",
                    borderRadius: "8px 8px 0 0",
                    marginBottom: 8,
                  }}
                />
                <div style={{ fontSize: 10, color: "#6B7280", textAlign: "center" }}>
                  {data.month}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: "#111827" }}>
            Komposisi Status Gizi
          </h3>
          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "#16A34A",
                  margin: "0 auto 12px",
                }}
              />
              <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>Normal</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#16A34A" }}>70%</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "#D97706",
                  margin: "0 auto 12px",
                }}
              />
              <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>Risiko</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#D97706" }}>20%</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "#DC2626",
                  margin: "0 auto 12px",
                }}
              />
              <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>Stunting</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#DC2626" }}>10%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          border: "1px solid #E5E7EB",
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: "#111827" }}>
          Distribusi Per Wilayah
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {wilayahData.map((data, idx) => (
            <div key={idx}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                  {data.wilayah}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#6B7280" }}>
                  {data.total} anak
                </span>
              </div>
              <div style={{ display: "flex", height: 24, borderRadius: 4, overflow: "hidden", gap: 2 }}>
                <div
                  style={{
                    flex: data.normal,
                    background: "#16A34A",
                    height: "100%",
                    position: "relative",
                  }}
                />
                <div
                  style={{
                    flex: data.risiko,
                    background: "#D97706",
                    height: "100%",
                  }}
                />
                <div
                  style={{
                    flex: data.stunting,
                    background: "#DC2626",
                    height: "100%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
          {[
            { label: "Normal", color: "#16A34A" },
            { label: "Risiko", color: "#D97706" },
            { label: "Stunting", color: "#DC2626" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: item.color,
                }}
              />
              <span style={{ fontSize: 12, color: "#6B7280" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <Sidebar />

      <div style={{ marginLeft: 280, flex: 1, padding: 32 }}>
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "users" && <UserManagement />}
        {activePage === "posyandu" && <PosyanduManagement />}
        {activePage === "monitoring" && <MonitoringAnak />}
        {activePage === "analytics" && <Analytics />}
      </div>

      <ModalForm
        showModal={showModal}
        onClose={() => setShowModal(false)}
        modalType={modalType}
        editingId={editingId}
        formData={formData}
        onFormChange={handleFormChange}
        onSave={handleSaveClick}
      />
    </div>
  );
}
