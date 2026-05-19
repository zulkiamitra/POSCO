import { useState } from "react";
import { children } from "../../data/dummyData";

const statusColors = {
  "Normal": { bg: "#F0FDF4", text: "#16A34A" },
  "Gizi Kurang": { bg: "#FEF3C7", text: "#D97706" },
  "Gizi Lebih": { bg: "#EFF6FF", text: "#2563EB" },
  "Stunting": { bg: "#FEF2F2", text: "#EF4444" },
  "Tidak Stunting": { bg: "#F0FDF4", text: "#16A34A" },
};

export default function MonitoringAnak() {
  const [search, setSearch] = useState("");
  const [filterGizi, setFilterGizi] = useState("Semua");
  const [selectedChild, setSelectedChild] = useState(null);

  const filtered = children.filter(c =>
    c.nama.toLowerCase().includes(search.toLowerCase()) &&
    (filterGizi === "Semua" || c.statusGizi === filterGizi || c.statusStunting === filterGizi)
  );

  const stats = {
    total: children.length,
    stunting: children.filter(c => c.statusStunting === "Stunting").length,
    giziKurang: children.filter(c => c.statusGizi === "Gizi Kurang").length,
    giziLebih: children.filter(c => c.statusGizi === "Gizi Lebih").length,
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Monitoring Data Anak</div>
        <div style={{ fontSize: 14, color: "#6B7280" }}>Pantau pertumbuhan dan status gizi seluruh balita</div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Balita", value: stats.total, color: "#16A34A", icon: "👶" },
          { label: "Stunting", value: stats.stunting, color: "#EF4444", icon: "⚠️" },
          { label: "Gizi Kurang", value: stats.giziKurang, color: "#F59E0B", icon: "📉" },
          { label: "Gizi Lebih", value: stats.giziLebih, color: "#3B82F6", icon: "📈" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: 14, padding: "16px 20px",
            border: "1px solid #E8EDF2", display: "flex", alignItems: "center", gap: 14
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: s.color + "15", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 20
            }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        background: "#fff", borderRadius: 16, padding: "16px 20px",
        border: "1px solid #E8EDF2", marginBottom: 16,
        display: "flex", gap: 12, alignItems: "center"
      }}>
        <div style={{ position: "relative", flex: 1 }}>
          <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 16 }}>🔍</div>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama anak atau orang tua..."
            style={{
              width: "100%", padding: "10px 10px 10px 36px", borderRadius: 8,
              border: "1px solid #E5E7EB", fontSize: 14, outline: "none",
              boxSizing: "border-box", fontFamily: "inherit",
            }}
          />
        </div>
        {["Semua", "Normal", "Gizi Kurang", "Gizi Lebih", "Stunting"].map(f => (
          <button key={f} onClick={() => setFilterGizi(f)} style={{
            padding: "8px 16px", borderRadius: 8,
            border: filterGizi === f ? "1.5px solid #16A34A" : "1px solid #E5E7EB",
            background: filterGizi === f ? "#F0FDF4" : "#fff",
            color: filterGizi === f ? "#16A34A" : "#6B7280",
            cursor: "pointer", fontSize: 13, fontWeight: filterGizi === f ? 600 : 400,
            fontFamily: "inherit", whiteSpace: "nowrap",
          }}>{f}</button>
        ))}
        <button style={{
          padding: "9px 16px", borderRadius: 8, border: "1px solid #E5E7EB",
          background: "#fff", cursor: "pointer", fontSize: 13, color: "#374151",
          display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
        }}>
          📥 Export
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF2", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Nama Anak", "Tgl Lahir", "Posyandu", "BB (kg)", "TB (cm)", "Status Gizi", "Stunting", "Aksi"].map(h => (
                <th key={h} style={{
                  padding: "12px 16px", textAlign: "left",
                  fontSize: 12, fontWeight: 600, color: "#6B7280",
                  borderBottom: "1px solid #E8EDF2"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: c.jenisKelamin === "P" ? "#FDF2F8" : "#EFF6FF",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14
                    }}>{c.jenisKelamin === "P" ? "👧" : "👦"}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{c.nama}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{c.namaIbu}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>
                  {new Date(c.tanggalLahir).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{c.posyandu}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151", fontWeight: 600 }}>{c.beratBadan}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151", fontWeight: 600 }}>{c.tinggiBadan}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    fontSize: 11, padding: "4px 10px", borderRadius: 20,
                    background: statusColors[c.statusGizi]?.bg || "#F9FAFB",
                    color: statusColors[c.statusGizi]?.text || "#374151",
                    fontWeight: 600
                  }}>{c.statusGizi}</span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    fontSize: 11, padding: "4px 10px", borderRadius: 20,
                    background: statusColors[c.statusStunting]?.bg || "#F9FAFB",
                    color: statusColors[c.statusStunting]?.text || "#374151",
                    fontWeight: 600
                  }}>{c.statusStunting}</span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <button onClick={() => setSelectedChild(c)} style={{
                    padding: "6px 12px", borderRadius: 6, border: "1px solid #16A34A",
                    background: "#F0FDF4", color: "#16A34A", cursor: "pointer",
                    fontSize: 12, fontWeight: 600, fontFamily: "inherit",
                  }}>Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid #E8EDF2", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, color: "#6B7280" }}>Menampilkan {filtered.length} dari {children.length} data</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[1, 2, 3].map(p => (
              <button key={p} style={{
                width: 32, height: 32, borderRadius: 6,
                border: p === 1 ? "1.5px solid #16A34A" : "1px solid #E5E7EB",
                background: p === 1 ? "#F0FDF4" : "#fff",
                color: p === 1 ? "#16A34A" : "#6B7280",
                cursor: "pointer", fontSize: 13, fontFamily: "inherit",
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedChild && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
        }} onClick={() => setSelectedChild(null)}>
          <div style={{
            background: "#fff", borderRadius: 20, width: "90%", maxWidth: 560,
            padding: 32, maxHeight: "85vh", overflow: "auto"
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: selectedChild.jenisKelamin === "P" ? "#FDF2F8" : "#EFF6FF",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28
                }}>{selectedChild.jenisKelamin === "P" ? "👧" : "👦"}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>{selectedChild.nama}</div>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>Ibu: {selectedChild.namaIbu}</div>
                  <span style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 20,
                    background: statusColors[selectedChild.statusStunting]?.bg,
                    color: statusColors[selectedChild.statusStunting]?.text,
                    fontWeight: 600, display: "inline-block", marginTop: 4
                  }}>{selectedChild.statusStunting}</span>
                </div>
              </div>
              <button onClick={() => setSelectedChild(null)} style={{ border: "none", background: "none", fontSize: 22, cursor: "pointer", color: "#9CA3AF" }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Berat Badan", value: `${selectedChild.beratBadan} kg` },
                { label: "Tinggi Badan", value: `${selectedChild.tinggiBadan} cm` },
                { label: "Status Gizi", value: selectedChild.statusGizi },
              ].map(m => (
                <div key={m.label} style={{ background: "#F9FAFB", borderRadius: 10, padding: "12px" }}>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>{m.label}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#111827", marginTop: 4 }}>{m.value}</div>
                </div>
              ))}
            </div>

            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Status Imunisasi</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {Object.entries(selectedChild.imunisasi).map(([k, v]) => (
                <span key={k} style={{
                  padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                  background: v ? "#F0FDF4" : "#FEF2F2",
                  color: v ? "#16A34A" : "#EF4444"
                }}>{k.toUpperCase()} {v ? "✓" : "✗"}</span>
              ))}
            </div>

            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Riwayat Pemeriksaan</div>
            {selectedChild.riwayatPemeriksaan.map((r, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, padding: "10px 0",
                borderBottom: "1px solid #F3F4F6", alignItems: "center"
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#16A34A", flexShrink: 0, marginTop: 2
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{new Date(r.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>BB: {r.bb}kg · TB: {r.tb}cm · LK: {r.lingkarKepala}cm</div>
                </div>
                <span style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 20,
                  background: statusColors[r.statusGizi]?.bg,
                  color: statusColors[r.statusGizi]?.text, fontWeight: 600
                }}>{r.statusGizi}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}