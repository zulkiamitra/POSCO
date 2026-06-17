import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { api } from "../utils/api";
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

// Removed global static trendData and dummy data declarations to use database values

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { success, error } = useNotification();
  const [activePage, setActivePage] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [posyandus, setPosyandus] = useState([]);
  const [children, setChildren] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "user", "posyandu", "child"
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [formData, setFormData] = useState({});
  const [editingChildStatus, setEditingChildStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [sessions, setSessions] = useState([]);

  const wilayahData = useMemo(() => {
    const map = {};
    children.forEach(c => {
      const w = c.wilayah || "Lainnya";
      if (!map[w]) {
        map[w] = { wilayah: w, total: 0, normal: 0, risiko: 0, stunting: 0 };
      }
      map[w].total += 1;
      const status = (c.status || "").trim().toLowerCase();
      if (status === "normal") {
        map[w].normal += 1;
      } else if (status === "risiko" || status === "berisiko") {
        map[w].risiko += 1;
      } else if (status === "stunting") {
        map[w].stunting += 1;
      } else {
        map[w].normal += 1;
      }
    });
    const list = Object.values(map);
    return list.length > 0 ? list : [
      { wilayah: "Belum Ada Data", total: 1, normal: 1, risiko: 0, stunting: 0 }
    ];
  }, [children]);

  const compositionData = useMemo(() => {
    const total = children.length || 1;
    let normal = 0;
    let risiko = 0;
    let stunting = 0;

    children.forEach(c => {
      const status = (c.status || "").trim().toLowerCase();
      if (status === "normal") normal++;
      else if (status === "risiko" || status === "berisiko") risiko++;
      else if (status === "stunting") stunting++;
      else normal++;
    });

    return {
      normal: Math.round((normal / total) * 100),
      risiko: Math.round((risiko / total) * 100),
      stunting: Math.round((stunting / total) * 100),
    };
  }, [children]);

  const loadAllData = useCallback(async () => {
    setLoadingData(true);
    try {
      const posList = await api.getPosyandus();
      setPosyandus(posList.map(p => ({
        id: p.id,
        name: p.name,
        kecamatan: p.kecamatan,
        kelurahan: p.kelurahan,
        kaderName: p.kaderName || "",
        status: p.active ? "Aktif" : "Nonaktif"
      })));
      
      const userList = await api.getUsers();
      setUsers(userList.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        wilayah: u.wilayah,
        posyanduId: u.posyanduId || "",
        nik: u.nik || "",
        phone: u.phone || "",
        status: u.status
      })));
      
      const childList = await api.getChildren({}, posList);
      setChildren(childList.map(c => ({
        id: c.id,
        name: c.nama,
        mother: c.namaIbu,
        wilayah: c.posyandu,
        posyanduId: c.posyanduId,
        status: c.statusGizi,
        bb: c.beratBadan,
        tb: c.tinggiBadan,
        original: c
      })));

      const sessList = await api.getSessions({}, posList);
      setSessions(sessList);
    } catch (err) {
      console.error("Failed to load data:", err);
      error("⚠️ Gagal memuat data dari server");
    } finally {
      setLoadingData(false);
    }
  }, [error]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

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

  const trendData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    const currentMonth = new Date().getMonth();
    
    // Get last 6 months indices
    const last6MonthsIndices = [];
    for (let i = 5; i >= 0; i--) {
      const idx = (currentMonth - i + 12) % 12;
      last6MonthsIndices.push(idx);
    }

    const data = last6MonthsIndices.map(idx => ({ month: months[idx], index: idx, anak: 0, stunting: 0, kunjungan: 0 }));

    children.forEach(c => {
      if (c.original?.tanggalLahir) {
        const d = new Date(c.original.tanggalLahir);
        const mIdx = d.getMonth();
        const dataObj = data.find(item => item.index === mIdx);
        if (dataObj) {
          dataObj.anak += 1;
          if (c.status === "Stunting") {
            dataObj.stunting += 1;
          }
        }
      }
    });

    sessions.forEach(s => {
      if (s.tanggal) {
        const d = new Date(s.tanggal);
        const mIdx = d.getMonth();
        const dataObj = data.find(item => item.index === mIdx);
        if (dataObj) {
          dataObj.kunjungan += 1;
        }
      }
    });

    return data;
  }, [children, sessions]);

  const getRoleStyle = (role) => {
    switch(role) {
      case "admin":
        return { background: "#E8F5E9", color: "#2E7D32", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", display: "inline-block" };
      case "kader":
        return { background: "#E3F2FD", color: "#1565C0", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", display: "inline-block" };
      case "verifikator":
        return { background: "#EDE7F6", color: "#5E35B1", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", display: "inline-block" };
      case "kader_pending":
        return { background: "#FFF3E0", color: "#E65100", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", display: "inline-block" };
      case "orangtua":
        return { background: "#F3E5F5", color: "#6A1B9A", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", display: "inline-block" };
      default:
        return { background: "#ECEFF1", color: "#37474F", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", display: "inline-block" };
    }
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case "admin": return "ADMIN";
      case "kader": return "KADER";
      case "verifikator": return "VERIFIKATOR";
      case "kader_pending": return "PENDING";
      case "orangtua": return "ORANG TUA";
      default: return role?.toUpperCase() || "";
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Aktif" || status === "active" || status === "Normal") {
      return { background: "#E8F5E9", color: "#2E7D32", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", display: "inline-block" };
    }
    return { background: "#FFF8E1", color: "#F57F17", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", display: "inline-block" };
  };

  const handleVerifyKader = async (userId) => {
    try {
      const userToVerify = users.find(u => u.id === userId);
      if (!userToVerify) return;

      await api.updateUser(userId, {
        name: userToVerify.name,
        email: userToVerify.email,
        role: "kader",
        wilayah: userToVerify.wilayah
      });

      setUsers(prev => prev.map((u) => (u.id === userId ? {
        ...u,
        role: "kader",
        status: "Aktif"
      } : u)));

      success("✓ Kader berhasil diverifikasi dan aktif");
    } catch (err) {
      error("⚠️ Gagal memverifikasi kader: " + err.message);
    }
  };

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

  const handleDeleteClick = async (type, id) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      try {
        if (type === "user") {
          await api.deleteUser(id);
          setUsers(users.filter((u) => u.id !== id));
          success("✓ User berhasil dihapus");
        }
        if (type === "posyandu") {
          await api.deletePosyandu(id);
          setPosyandus(posyandus.filter((p) => p.id !== id));
          success("✓ Posyandu berhasil dihapus");
        }
        if (type === "child") {
          await api.deleteChild(id);
          setChildren(children.filter((c) => c.id !== id));
          success("✓ Data anak berhasil dihapus");
        }
      } catch (err) {
        error("⚠️ Gagal menghapus data: " + err.message);
      }
    }
  };

  const handleSaveClick = async () => {
    if (!formData.name) {
      error("⚠️ Nama harus diisi");
      return;
    }

    try {
      if (editingId) {
        if (modalType === "user") {
          const updated = await api.updateUser(editingId, {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            wilayah: formData.wilayah,
            nik: formData.nik || undefined,
            phone: formData.phone || undefined,
            posyanduId: formData.posyanduId || undefined,
            password: formData.password || undefined
          });
          setUsers(users.map((u) => (u.id === editingId ? {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            wilayah: updated.wilayah,
            posyanduId: updated.posyanduId || "",
            nik: updated.nik || "",
            phone: updated.phone || "",
            status: "Aktif"
          } : u)));
        }
        if (modalType === "posyandu") {
          const updated = await api.updatePosyandu(editingId, {
            name: formData.name,
            kecamatan: formData.kecamatan,
            kelurahan: formData.kelurahan,
            active: formData.status !== "Nonaktif",
            kaderName: formData.kaderName || ""
          });
          setPosyandus(posyandus.map((p) => (p.id === editingId ? {
            id: updated.posyandu.id,
            name: updated.posyandu.name,
            kecamatan: updated.posyandu.kecamatan,
            kelurahan: updated.posyandu.kelurahan,
            kaderName: updated.posyandu.kaderName || "",
            status: updated.posyandu.active ? "Aktif" : "Nonaktif"
          } : p)));
        }
        if (modalType === "child") {
          const orig = children.find(c => c.id === editingId)?.original;
          const updatedChild = {
            ...orig,
            nama: formData.name,
            namaIbu: formData.mother,
            jenisKelamin: formData.gender || "L",
            tanggalLahir: formData.birthDate || (orig?.tanggalLahir ? orig.tanggalLahir.split("T")[0] : new Date().toISOString().split("T")[0]),
            beratLahir: parseFloat(formData.birthWeight) || 3.0,
            statusGizi: formData.status,
            beratBadan: parseFloat(formData.bb) || 0,
            tinggiBadan: parseFloat(formData.tb) || 0,
            posyanduId: formData.posyanduId || null
          };
          const res = await api.updateChild(editingId, updatedChild, posyandus);
          setChildren(children.map((c) => (c.id === editingId ? {
            id: editingId,
            name: res.nama,
            mother: res.namaIbu,
            wilayah: res.posyandu,
            posyanduId: res.posyanduId,
            status: res.statusGizi,
            bb: res.beratBadan,
            tb: res.tinggiBadan,
            original: res
          } : c)));
        }
        
        success("✓ Data berhasil diperbarui");
      } else {
        if (modalType === "user") {
          const payload = {
            name: formData.name,
            email: formData.email || `${formData.name.toLowerCase().replace(/\s/g, "")}@posco.id`,
            role: formData.role || "orangtua",
            wilayah: formData.wilayah || "",
            password: formData.password || "password123",
            nik: formData.nik || undefined,
            phone: formData.phone || undefined,
            posyanduId: formData.posyanduId || undefined
          };
          const created = await api.createUser(payload);
          setUsers([...users, {
            id: created.id,
            name: created.name,
            email: created.email,
            role: created.role,
            wilayah: created.wilayah,
            posyanduId: created.posyanduId || "",
            nik: created.nik || "",
            phone: created.phone || "",
            status: "Aktif"
          }]);
        }
        if (modalType === "posyandu") {
          const payload = {
            name: formData.name,
            kecamatan: formData.kecamatan,
            kelurahan: formData.kelurahan,
            active: formData.status !== "Nonaktif",
            kaderName: formData.kaderName || ""
          };
          const res = await api.createPosyandu(payload);
          setPosyandus([...posyandus, {
            id: res.posyandu.id,
            name: res.posyandu.name,
            kecamatan: res.posyandu.kecamatan,
            kelurahan: res.posyandu.kelurahan,
            kaderName: res.posyandu.kaderName || "",
            status: res.posyandu.active ? "Aktif" : "Nonaktif"
          }]);
        }
        if (modalType === "child") {
          const payload = {
            nama: formData.name,
            namaIbu: formData.mother || "",
            jenisKelamin: formData.gender || "L",
            tanggalLahir: formData.birthDate || new Date().toISOString().split("T")[0],
            beratLahir: parseFloat(formData.birthWeight) || 3.0,
            tinggiBadan: parseFloat(formData.tb) || 0,
            beratBadan: parseFloat(formData.bb) || 0,
            statusGizi: formData.status || "Normal",
            statusStunting: "Tidak Stunting",
            posyanduId: formData.posyanduId || null,
            imunisasi: { bcg: false, hb0: false, polio: false, dpt1: false, dpt2: false, campak: false },
            riwayatPemeriksaan: []
          };
          const res = await api.createChild(payload, posyandus);
          setChildren([...children, {
            id: res.id,
            name: res.nama,
            mother: res.namaIbu,
            wilayah: res.posyandu,
            posyanduId: res.posyanduId,
            status: res.statusGizi,
            bb: res.beratBadan,
            tb: res.tinggiBadan,
            original: res
          }]);
        }
        
        success("✓ Data baru berhasil ditambahkan");
      }
      setShowModal(false);
    } catch (err) {
      error("⚠️ Gagal menyimpan data: " + err.message);
    }
  };

  const getStatusColor = (status) => {
    if (status === "Normal") return "#16A34A";
    if (status === "Risiko") return "#D97706";
    if (status === "Stunting") return "#DC2626";
    return "#6B7280";
  };

  const handleStatusChange = async (childId, newStatusValue) => {
    try {
      const child = children.find(c => c.id === childId);
      if (!child) return;
      const updatedChild = {
        ...child.original,
        statusGizi: newStatusValue
      };
      const res = await api.updateChild(childId, updatedChild, posyandus);
      setChildren(children.map(c =>
        c.id === childId ? {
          ...c,
          status: res.statusGizi,
          original: res
        } : c
      ));
      setEditingChildStatus(null);
      setNewStatus("");
      success("✓ Status anak berhasil diperbarui");
    } catch (err) {
      error("⚠️ Gagal memperbarui status: " + err.message);
    }
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
          Selamat Datang, {user?.name?.split(" ")[0]}! 👋
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: 14 }}>
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
          { title: "Total Posyandu", value: posyandus.length, icon: "🏥", trend: "+5 posyandu" },
          { title: "Kunjungan Sesi", value: sessions.length, icon: "📅", trend: "+15 bulan ini" },
          { title: "Anak Terdaftar", value: children.length, icon: "👶", trend: "+30 anak" },
          { title: "Status Stunting", value: children.filter(c => c.status === "Stunting").length, icon: "⚠️", trend: "aktif stunting" },
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
            {trendData.map((data, idx) => {
              const maxAnak = Math.max(...trendData.map(d => d.anak), 1);
              return (
                <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      height: `${(data.anak / maxAnak) * 200}px`,
                      background: "linear-gradient(180deg, #16A34A 0%, #D1FAE5 100%)",
                      borderRadius: "8px 8px 0 0",
                      marginBottom: 8,
                    }}
                  />
                  <div style={{ fontSize: 11, color: "#6B7280", textAlign: "center" }}>
                    {data.month}
                  </div>
                </div>
              );
            })}
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
                Wilayah / Posyandu
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
                <td style={{ padding: "16px", fontSize: 14, color: "#111827" }}>
                  <div style={{ fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>{user.email}</div>
                </td>
                <td style={{ padding: "16px", fontSize: 14, color: "#111827" }}>
                  <span style={getRoleStyle(user.role)}>{getRoleLabel(user.role)}</span>
                </td>
                <td style={{ padding: "16px", fontSize: 14, color: "#6B7280" }}>
                  <div>{user.wilayah || "-"}</div>
                  {user.posyanduId && (
                    <div style={{ fontSize: 11, color: "#16A34A", fontWeight: 600, marginTop: 2 }}>
                      📍 {posyandus.find(p => p.id === user.posyanduId)?.name || "Posyandu"}
                    </div>
                  )}
                </td>
                <td style={{ padding: "16px", fontSize: 14, color: "#111827" }}>
                  <span style={getStatusStyle(user.status)}>{user.status}</span>
                </td>
                <td style={{ padding: "16px", textAlign: "center" }}>
                  {user.role === "kader_pending" && (
                    <button
                      onClick={() => handleVerifyKader(user.id)}
                      style={{
                        background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                        border: "none",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "6px 12px",
                        borderRadius: "6px",
                        marginRight: 12,
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 6px rgba(22, 163, 74, 0.2)",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = "translateY(-1px)";
                        e.target.style.boxShadow = "0 4px 10px rgba(22, 163, 74, 0.3)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 2px 6px rgba(22, 163, 74, 0.2)";
                      }}
                    >
                      Verifikasi
                    </button>
                  )}
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: 0 }}>
          Monitoring Anak
        </h2>
        <button
          className="btn-hover"
          onClick={() => handleAddClick("child")}
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
          + Tambah Anak
        </button>
      </div>

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
                  <th style={{ padding: "16px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#6B7280" }}>
                    Aksi
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
                <td style={{ padding: "16px", textAlign: "center" }}>
                  <button
                    onClick={() => {
                      handleEditClick("child", {
                        id: child.id,
                        name: child.name,
                        mother: child.mother,
                        gender: child.original?.gender || "L",
                        birthDate: child.original?.tanggalLahir || "",
                        birthWeight: child.original?.beratLahir || 3.0,
                        tb: child.tb,
                        bb: child.bb,
                        status: child.status,
                        posyanduId: child.posyanduId || ""
                      });
                    }}
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
                    onClick={() => handleDeleteClick("child", child.id)}
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
            {trendData.map((data, idx) => {
              const maxAnakTrend = Math.max(...trendData.map(d => d.anak), 1);
              return (
                <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      height: `${(data.anak / maxAnakTrend) * 200}px`,
                      background: "linear-gradient(180deg, #16A34A 0%, #D1FAE5 100%)",
                      borderRadius: "8px 8px 0 0",
                      marginBottom: 8,
                    }}
                  />
                  <div style={{ fontSize: 10, color: "#6B7280", textAlign: "center" }}>
                    {data.month}
                  </div>
                </div>
              );
            })}
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
              <div style={{ fontSize: 14, fontWeight: 800, color: "#16A34A" }}>{compositionData.normal}%</div>
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
              <div style={{ fontSize: 14, fontWeight: 800, color: "#D97706" }}>{compositionData.risiko}%</div>
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
              <div style={{ fontSize: 14, fontWeight: 800, color: "#DC2626" }}>{compositionData.stunting}%</div>
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
        posyandus={posyandus}
      />
    </div>
  );
}
