import { memo } from "react";

const ModalForm = memo(({
  showModal,
  onClose,
  modalType,
  editingId,
  formData,
  onFormChange,
  onSave,
  posyandus = []
}) => {
  if (!showModal) return null;

  const inputStyle = {
    padding: "10px 12px",
    border: "1.5px solid #E5E7EB",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    color: "#111827",
    fontFamily: "inherit",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    width: "100%"
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: "#374151",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  const buttonBaseStyle = {
    flex: 1,
    padding: "12px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    border: "none",
    transition: "all 0.2s ease"
  };

  const batalStyle = {
    ...buttonBaseStyle,
    background: "#fff",
    color: "#374151",
    border: "1.5px solid #D1D5DB",
  };

  const simpanStyle = {
    ...buttonBaseStyle,
    background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)"
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 16,
          maxWidth: 500,
          width: "90%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          maxHeight: "85vh",
          overflowY: "auto"
        }}
      >
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: "#111827" }}>
          {editingId ? "✏️ Edit Data" : "➕ Tambah Data"}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {modalType === "user" && (
            <>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Nama Lengkap <span style={{ color: "#EF4444" }}>*</span></label>
                <input
                  type="text"
                  placeholder="Contoh: Siti Rahayu"
                  value={formData.name || ""}
                  onChange={(e) => onFormChange("name", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Email <span style={{ color: "#EF4444" }}>*</span></label>
                <input
                  type="email"
                  placeholder="Contoh: sitikader@posco.id"
                  value={formData.email || ""}
                  onChange={(e) => onFormChange("email", e.target.value)}
                  style={inputStyle}
                />
              </div>
              {!editingId && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={labelStyle}>Password <span style={{ color: "#EF4444" }}>*</span></label>
                  <input
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={formData.password || ""}
                    onChange={(e) => onFormChange("password", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Role Pengguna <span style={{ color: "#EF4444" }}>*</span></label>
                <select
                  value={formData.role || ""}
                  onChange={(e) => onFormChange("role", e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="">Pilih Role</option>
                  <option value="admin">Admin</option>
                  <option value="kader">Kader</option>
                  <option value="orangtua">Orang Tua</option>
                  <option value="verifikator">Verifikator</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>NIK (Nomor Induk Kependudukan)</label>
                <input
                  type="text"
                  placeholder="16 digit nomor NIK"
                  value={formData.nik || ""}
                  onChange={(e) => onFormChange("nik", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Nomor Telepon</label>
                <input
                  type="text"
                  placeholder="Contoh: 08123456789"
                  value={formData.phone || ""}
                  onChange={(e) => onFormChange("phone", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Wilayah Tugas / Domisili</label>
                <input
                  type="text"
                  placeholder="Contoh: Padang Utara"
                  value={formData.wilayah || ""}
                  onChange={(e) => onFormChange("wilayah", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Posyandu Binaan (Khusus Kader/Ortu)</label>
                <select
                  value={formData.posyanduId || ""}
                  onChange={(e) => onFormChange("posyanduId", e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="">Pilih Posyandu (Opsional)</option>
                  {posyandus.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {modalType === "posyandu" && (
            <>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Nama Posyandu <span style={{ color: "#EF4444" }}>*</span></label>
                <input
                  type="text"
                  placeholder="Contoh: Posyandu Melati"
                  value={formData.name || ""}
                  onChange={(e) => onFormChange("name", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Kecamatan <span style={{ color: "#EF4444" }}>*</span></label>
                <input
                  type="text"
                  placeholder="Contoh: Koto Tangah"
                  value={formData.kecamatan || ""}
                  onChange={(e) => onFormChange("kecamatan", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Kelurahan <span style={{ color: "#EF4444" }}>*</span></label>
                <input
                  type="text"
                  placeholder="Contoh: Batang Kabung Ganting"
                  value={formData.kelurahan || ""}
                  onChange={(e) => onFormChange("kelurahan", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Nama Kader Penanggung Jawab</label>
                <input
                  type="text"
                  placeholder="Contoh: Siti Rahayu"
                  value={formData.kaderName || ""}
                  onChange={(e) => onFormChange("kaderName", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Status Layanan</label>
                <select
                  value={formData.status || "Aktif"}
                  onChange={(e) => onFormChange("status", e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
            </>
          )}

          {modalType === "child" && (
            <>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Nama Anak <span style={{ color: "#EF4444" }}>*</span></label>
                <input
                  type="text"
                  placeholder="Contoh: Muhammad Bayu"
                  value={formData.name || ""}
                  onChange={(e) => onFormChange("name", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Nama Ibu Kandung <span style={{ color: "#EF4444" }}>*</span></label>
                <input
                  type="text"
                  placeholder="Contoh: Ernawati"
                  value={formData.mother || ""}
                  onChange={(e) => onFormChange("mother", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Jenis Kelamin <span style={{ color: "#EF4444" }}>*</span></label>
                <select
                  value={formData.gender || "L"}
                  onChange={(e) => onFormChange("gender", e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Tanggal Lahir <span style={{ color: "#EF4444" }}>*</span></label>
                <input
                  type="date"
                  value={formData.birthDate ? formData.birthDate.split("T")[0] : ""}
                  onChange={(e) => onFormChange("birthDate", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Berat Lahir (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 3.2"
                  value={formData.birthWeight || ""}
                  onChange={(e) => onFormChange("birthWeight", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Tinggi Badan Saat Ini (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 85"
                  value={formData.tb || ""}
                  onChange={(e) => onFormChange("tb", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Berat Badan Saat Ini (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 12"
                  value={formData.bb || ""}
                  onChange={(e) => onFormChange("bb", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Status Gizi</label>
                <select
                  value={formData.status || "Normal"}
                  onChange={(e) => onFormChange("status", e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="Normal">Normal</option>
                  <option value="Risiko">Risiko</option>
                  <option value="Stunting">Stunting</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Posyandu Wilayah <span style={{ color: "#EF4444" }}>*</span></label>
                <select
                  value={formData.posyanduId || ""}
                  onChange={(e) => onFormChange("posyanduId", e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="">Pilih Posyandu</option>
                  {posyandus.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <button onClick={onClose} style={batalStyle}>
            Batal
          </button>
          <button onClick={onSave} style={simpanStyle}>
            Simpan Data
          </button>
        </div>
      </div>
    </div>
  );
});

ModalForm.displayName = "ModalForm";

export default ModalForm;
