import React, { memo } from "react";

const ModalForm = memo(({
  showModal,
  onClose,
  modalType,
  editingId,
  formData,
  onFormChange,
  onSave,
}) => {
  if (!showModal) return null;

  const inputStyle = {
    padding: "12px 12px",
    border: "1.5px solid #E5E7EB",
    borderRadius: 6,
    fontSize: 14,
    outline: "none",
    color: "#111827",
    fontFamily: "inherit",
    backgroundColor: "#fff",
  };

  const buttonBaseStyle = {
    flex: 1,
    padding: "12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    border: "none",
  };

  const batalStyle = {
    ...buttonBaseStyle,
    background: "#F9FAFB",
    color: "#111827",
    border: "1.5px solid #D1D5DB",
  };

  const simpanStyle = {
    ...buttonBaseStyle,
    background: "#16A34A",
    color: "#fff",
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
          borderRadius: 12,
          maxWidth: 500,
          width: "90%",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: "#111827" }}>
          {editingId ? "Edit Data" : "Tambah Data"}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {modalType === "user" && (
            <>
              <input
                type="text"
                placeholder="Nama"
                value={formData.name || ""}
                onChange={(e) => onFormChange("name", e.target.value)}
                style={inputStyle}
              />
              <select
                value={formData.role || ""}
                onChange={(e) => onFormChange("role", e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option>Pilih Role</option>
                <option value="admin">Admin</option>
                <option value="kader">Kader</option>
                <option value="orangtua">Orang Tua</option>
              </select>
              <input
                type="text"
                placeholder="Wilayah"
                value={formData.wilayah || ""}
                onChange={(e) => onFormChange("wilayah", e.target.value)}
                style={inputStyle}
              />
            </>
          )}

          {modalType === "posyandu" && (
            <>
              <input
                type="text"
                placeholder="Nama Posyandu"
                value={formData.name || ""}
                onChange={(e) => onFormChange("name", e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Kecamatan"
                value={formData.kecamatan || ""}
                onChange={(e) => onFormChange("kecamatan", e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Kelurahan"
                value={formData.kelurahan || ""}
                onChange={(e) => onFormChange("kelurahan", e.target.value)}
                style={inputStyle}
              />
            </>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button onClick={onClose} style={batalStyle}>
            Batal
          </button>
          <button onClick={onSave} style={simpanStyle}>
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
});

ModalForm.displayName = "ModalForm";

export default ModalForm;
