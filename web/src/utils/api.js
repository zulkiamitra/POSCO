const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Helper to handle response
const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && !response.url.includes("/auth/login")) {
      console.warn("Session expired or unauthorized. Logging out...");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login" && window.location.pathname !== "/admin-login") {
        window.location.href = "/login";
      }
    }
    throw new Error(data?.message || `HTTP error! status: ${response.status}`);
  }
  return data;
};

const normalizeCheckup = (c) => {
  if (!c) return c;
  
  // Normalize Date
  let dateVal = c.tanggal || "";
  if (!dateVal && c.date) {
    const indMonths = {
      januari: '01', februari: '02', maret: '03', april: '04', mei: '05', juni: '06',
      juli: '07', agustus: '08', september: '09', oktober: '10', november: '11', desember: '12'
    };
    const parts = c.date.toLowerCase().trim().split(/\s+/);
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = indMonths[parts[1]] || '01';
      const year = parts[2];
      dateVal = `${year}-${month}-${day}`;
    } else {
      const slashParts = c.date.split('/');
      if (slashParts.length === 3) {
        const day = slashParts[0].padStart(2, '0');
        const month = slashParts[1].padStart(2, '0');
        const year = slashParts[2];
        dateVal = `${year}-${month}-${day}`;
      }
    }
  }
  if (!dateVal) {
    dateVal = new Date().toISOString().split('T')[0];
  }

  let dateFormatted = c.date || "";
  if (!dateFormatted && dateVal) {
    try {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) {
        const months = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        dateFormatted = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      }
    } catch (_) {}
  }
  if (dateFormatted && /^\d{4}-\d{2}-\d{2}/.test(dateFormatted)) {
    try {
      const d = new Date(dateFormatted);
      if (!isNaN(d.getTime())) {
        const months = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        dateFormatted = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      }
    } catch (_) {}
  }

  // Helper to parse numbers
  const parseNum = (val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const cleaned = val.replace(/[^\d.,]/g, '').replace(',', '.');
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  // Helper to format string
  const formatStr = (val, unit) => {
    if (val === undefined || val === null || val === '-') return '-';
    if (typeof val === 'string' && val.endsWith(unit)) return val;
    return `${val} ${unit}`;
  };

  const bb = c.bb !== undefined ? parseNum(c.bb) : (c.weight ? parseNum(c.weight) : 0);
  const weight = c.weight || formatStr(bb, 'kg');

  const tb = c.tb !== undefined ? parseNum(c.tb) : (c.height ? parseNum(c.height) : 0);
  const height = c.height || formatStr(tb, 'cm');

  const lingkarLengan = c.lingkarLengan !== undefined ? parseNum(c.lingkarLengan) : (c.arm ? parseNum(c.arm) : 0);
  const arm = c.arm || formatStr(lingkarLengan, 'cm');

  const lingkarKepala = c.lingkarKepala !== undefined ? parseNum(c.lingkarKepala) : (c.headCircumference ? parseNum(c.headCircumference) : 0);
  const headCircumference = c.headCircumference || formatStr(lingkarKepala, 'cm');

  const statusGizi = c.statusGizi || c.status || 'Normal';
  const status = c.status || c.statusGizi || 'Normal';

  const note = c.note || c.catatan || '';
  const catatan = c.catatan || c.note || '';

  const location = c.location || c.tempat || 'Posyandu Melati - Kec. Padang Timur';
  const tempat = c.tempat || c.location || 'Posyandu Melati - Kec. Padang Timur';

  const services = c.services || c.layanan || [];
  const layanan = c.layanan || c.services || [];

  return {
    tanggal: dateVal,
    date: dateFormatted,
    bb,
    weight,
    tb,
    height,
    lingkarKepala,
    headCircumference,
    lingkarLengan,
    arm,
    statusGizi,
    status,
    note,
    catatan,
    location,
    tempat,
    services,
    layanan
  };
};

// Mappers for Child (Balita)
export const mapChildToFrontend = (dbChild, posyandus = []) => {
  if (!dbChild) return null;
  const pName = posyandus.find(p => p.id === dbChild.posyanduId)?.name || dbChild.posyanduId || "";
  
  const rawHistory = dbChild.checkupHistory || [];
  const normalizedHistory = rawHistory.map(normalizeCheckup);

  return {
    id: dbChild.id,
    nama: dbChild.name,
    namaIbu: dbChild.motherName || "",
    tanggalLahir: dbChild.birthDate ? dbChild.birthDate.split("T")[0] : "",
    jenisKelamin: dbChild.gender || "L",
    beratLahir: dbChild.birthWeight || 0,
    tinggiBadan: dbChild.height || 0,
    beratBadan: dbChild.weight || 0,
    statusGizi: dbChild.nutritionStatus || "Normal",
    statusStunting: dbChild.stuntingStatus || "Tidak Stunting",
    posyandu: pName,
    posyanduId: dbChild.posyanduId || "",
    orangtuaId: dbChild.orangtuaId || "",
    imunisasi: dbChild.immunization || { bcg: false, hb0: false, polio: false, dpt1: false, dpt2: false, campak: false },
    riwayatPemeriksaan: normalizedHistory,
  };
};

export const mapChildToBackend = (feChild, posyandus = []) => {
  if (!feChild) return null;
  const pId = feChild.posyanduId || posyandus.find(p => p.name === feChild.posyandu || p.nama === feChild.posyandu)?.id || null;

  const rawHistory = feChild.riwayatPemeriksaan || [];
  const normalizedHistory = rawHistory.map(normalizeCheckup);

  return {
    name: feChild.nama,
    motherName: feChild.namaIbu,
    birthDate: feChild.tanggalLahir ? new Date(feChild.tanggalLahir).toISOString() : null,
    gender: feChild.jenisKelamin,
    birthWeight: parseFloat(feChild.beratLahir) || 0,
    height: parseFloat(feChild.tinggiBadan) || 0,
    weight: parseFloat(feChild.beratBadan) || 0,
    nutritionStatus: feChild.statusGizi,
    stuntingStatus: feChild.statusStunting,
    posyanduId: pId,
    orangtuaId: feChild.orangtuaId || null,
    immunization: feChild.imunisasi,
    checkupHistory: normalizedHistory,
  };
};

// Mappers for Pregnancy (Ibu Hamil)
export const mapPregnancyToFrontend = (dbPreg, posyandus = []) => {
  if (!dbPreg) return null;
  const pName = posyandus.find(p => p.id === dbPreg.posyanduId)?.name || dbPreg.posyanduId || "";

  return {
    id: dbPreg.id,
    nama: dbPreg.name,
    usia: dbPreg.age || 0,
    usiaKehamilan: dbPreg.gestationalAge || 0,
    hpht: dbPreg.hpht ? dbPreg.hpht.split("T")[0] : "",
    taksirPersalinan: dbPreg.dueDate ? dbPreg.dueDate.split("T")[0] : "",
    tekananDarah: dbPreg.bloodPressure || "",
    beratBadan: dbPreg.weight || 0,
    posyandu: pName,
    posyanduId: dbPreg.posyanduId || "",
    risikoTinggi: dbPreg.highRisk || false,
  };
};

export const mapPregnancyToBackend = (fePreg, posyandus = []) => {
  if (!fePreg) return null;
  const pId = fePreg.posyanduId || posyandus.find(p => p.name === fePreg.posyandu || p.nama === fePreg.posyandu)?.id || null;

  return {
    name: fePreg.nama,
    age: parseInt(fePreg.usia) || 0,
    gestationalAge: parseInt(fePreg.usiaKehamilan) || 0,
    hpht: fePreg.hpht ? new Date(fePreg.hpht).toISOString() : null,
    dueDate: fePreg.taksirPersalinan ? new Date(fePreg.taksirPersalinan).toISOString() : null,
    bloodPressure: fePreg.tekananDarah,
    weight: parseFloat(fePreg.beratBadan) || 0,
    highRisk: !!fePreg.risikoTinggi,
    posyanduId: pId,
  };
};

// Mappers for Sessions
export const mapSessionToFrontend = (dbSess, posyandus = []) => {
  if (!dbSess) return null;
  const pName = dbSess.posyandu?.name || posyandus.find(p => p.id === dbSess.posyanduId)?.name || dbSess.posyanduId || "";

  return {
    id: dbSess.id,
    tanggal: dbSess.date ? dbSess.date.split("T")[0] : "",
    waktu: dbSess.timeRange || "",
    posyandu: pName,
    posyanduId: dbSess.posyanduId || "",
    jumlahHadir: dbSess.attendanceCount || 0,
    status: dbSess.status || "Mendatang",
    kader: dbSess.kaderName || "",
    nama: dbSess.name || "",
    deskripsi: dbSess.description || "",
  };
};

export const mapSessionToBackend = (feSess, posyandus = []) => {
  if (!feSess) return null;
  const pId = feSess.posyanduId || posyandus.find(p => p.name === feSess.posyandu || p.nama === feSess.posyandu)?.id || null;

  return {
    date: feSess.tanggal ? new Date(feSess.tanggal).toISOString() : new Date().toISOString(),
    timeRange: feSess.waktu,
    attendanceCount: parseInt(feSess.jumlahHadir) || 0,
    status: feSess.status,
    kaderName: feSess.kader || "",
    posyanduId: pId,
    posyanduName: feSess.posyandu || "",
    name: feSess.nama || "",
    description: feSess.deskripsi || "",
  };
};

// Mappers for Referrals
export const mapReferralToFrontend = (dbRef) => {
  if (!dbRef) return null;
  return {
    id: dbRef.id,
    namaAnak: dbRef.childName,
    alasan: dbRef.reason || "",
    tujuan: dbRef.destination || "",
    tanggal: dbRef.date ? dbRef.date.split("T")[0] : "",
    status: dbRef.status || "Terkirim",
    kader: dbRef.kaderName || "",
  };
};

export const mapReferralToBackend = (feRef) => {
  if (!feRef) return null;
  return {
    childName: feRef.namaAnak,
    reason: feRef.alasan,
    destination: feRef.tujuan,
    date: feRef.tanggal ? new Date(feRef.tanggal).toISOString() : new Date().toISOString(),
    status: feRef.status,
    kaderName: feRef.kader || "",
  };
};

// Mappers for Users
export const mapUserToFrontend = (dbUser) => {
  if (!dbUser) return null;
  return {
    id: dbUser.id,
    name: dbUser.name || "",
    email: dbUser.email,
    role: dbUser.role || "orangtua",
    wilayah: dbUser.wilayah || "",
    posyanduId: dbUser.posyanduId || "",
    status: dbUser.role === "kader_pending" ? "Pending Verifikasi" : "Aktif",
  };
};

export const mapUserToBackend = (feUser) => {
  if (!feUser) return null;
  return {
    name: feUser.name,
    email: feUser.email,
    role: feUser.role,
    wilayah: feUser.wilayah,
    posyanduId: feUser.posyanduId || null,
    password: feUser.password || undefined,
  };
};

// API Functions
export const api = {
  // Posyandus
  getPosyandus: async () => {
    const res = await fetch(`${API_URL}/posyandus`, { headers: getHeaders() });
    const data = await handleResponse(res);
    return data.data || [];
  },
  createPosyandu: async (posData) => {
    const res = await fetch(`${API_URL}/posyandus`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(posData),
    });
    return handleResponse(res);
  },
  updatePosyandu: async (id, posData) => {
    const res = await fetch(`${API_URL}/posyandus/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(posData),
    });
    return handleResponse(res);
  },
  deletePosyandu: async (id) => {
    const res = await fetch(`${API_URL}/posyandus/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Children
  getChildren: async (params = {}, posyandus = []) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/children?${query}`, { headers: getHeaders() });
    const data = await handleResponse(res);
    const dbList = data.data || [];
    return dbList.map(c => mapChildToFrontend(c, posyandus));
  },
  getChild: async (id, posyandus = []) => {
    const res = await fetch(`${API_URL}/children/${id}`, { headers: getHeaders() });
    const data = await handleResponse(res);
    return mapChildToFrontend(data.child, posyandus);
  },
  createChild: async (childData, posyandus = []) => {
    const dbChild = mapChildToBackend(childData, posyandus);
    const res = await fetch(`${API_URL}/children`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(dbChild),
    });
    const data = await handleResponse(res);
    return mapChildToFrontend(data.child, posyandus);
  },
  updateChild: async (id, childData, posyandus = []) => {
    const dbChild = mapChildToBackend(childData, posyandus);
    const res = await fetch(`${API_URL}/children/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(dbChild),
    });
    const data = await handleResponse(res);
    return mapChildToFrontend(data.child, posyandus);
  },
  deleteChild: async (id) => {
    const res = await fetch(`${API_URL}/children/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Pregnancies
  getPregnancies: async (params = {}, posyandus = []) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/pregnancies?${query}`, { headers: getHeaders() });
    const data = await handleResponse(res);
    const dbList = data.data || [];
    return dbList.map(p => mapPregnancyToFrontend(p, posyandus));
  },
  createPregnancy: async (pregData, posyandus = []) => {
    const dbPreg = mapPregnancyToBackend(pregData, posyandus);
    const res = await fetch(`${API_URL}/pregnancies`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(dbPreg),
    });
    const data = await handleResponse(res);
    return mapPregnancyToFrontend(data.pregnancy, posyandus);
  },
  updatePregnancy: async (id, pregData, posyandus = []) => {
    const dbPreg = mapPregnancyToBackend(pregData, posyandus);
    const res = await fetch(`${API_URL}/pregnancies/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(dbPreg),
    });
    const data = await handleResponse(res);
    return mapPregnancyToFrontend(data.pregnancy, posyandus);
  },
  deletePregnancy: async (id) => {
    const res = await fetch(`${API_URL}/pregnancies/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Sessions
  getSessions: async (params = {}, posyandus = []) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/sessions?${query}`, { headers: getHeaders() });
    const data = await handleResponse(res);
    const dbList = data.data || [];
    return dbList.map(s => mapSessionToFrontend(s, posyandus));
  },
  createSession: async (sessData, posyandus = []) => {
    const dbSess = mapSessionToBackend(sessData, posyandus);
    const res = await fetch(`${API_URL}/sessions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(dbSess),
    });
    const data = await handleResponse(res);
    return mapSessionToFrontend(data.session, posyandus);
  },
  updateSession: async (id, sessData, posyandus = []) => {
    const dbSess = mapSessionToBackend(sessData, posyandus);
    const res = await fetch(`${API_URL}/sessions/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(dbSess),
    });
    const data = await handleResponse(res);
    return mapSessionToFrontend(data.session, posyandus);
  },
  deleteSession: async (id) => {
    const res = await fetch(`${API_URL}/sessions/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Referrals
  getReferrals: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/referrals?${query}`, { headers: getHeaders() });
    const data = await handleResponse(res);
    const dbList = data.data || [];
    return dbList.map(r => mapReferralToFrontend(r));
  },
  createReferral: async (refData) => {
    const dbRef = mapReferralToBackend(refData);
    const res = await fetch(`${API_URL}/referrals`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(dbRef),
    });
    const data = await handleResponse(res);
    return mapReferralToFrontend(data.referral);
  },
  updateReferral: async (id, refData) => {
    const dbRef = mapReferralToBackend(refData);
    const res = await fetch(`${API_URL}/referrals/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(dbRef),
    });
    const data = await handleResponse(res);
    return mapReferralToFrontend(data.referral);
  },
  deleteReferral: async (id) => {
    const res = await fetch(`${API_URL}/referrals/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Users
  getUsers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/users?${query}`, { headers: getHeaders() });
    const data = await handleResponse(res);
    const dbList = data.data || [];
    return dbList.map(u => mapUserToFrontend(u));
  },
  createUser: async (userData) => {
    const dbUser = mapUserToBackend(userData);
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(dbUser),
    });
    const data = await handleResponse(res);
    return mapUserToFrontend(data.user);
  },
  updateUser: async (id, userData) => {
    const dbUser = mapUserToBackend(userData);
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(dbUser),
    });
    const data = await handleResponse(res);
    return mapUserToFrontend(data.user);
  },
  deleteUser: async (id) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
