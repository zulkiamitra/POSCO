import { useState } from "react";
import { posyandus, users, statsAdmin } from "../../data/dummyData";

export function WilayahPosyandu() {
  const [showTambah, setShowTambah] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Wilayah & Posyandu</div>
          <div style={{ fontSize: 14, color: "#6B7280" }}>Kelola data posyandu per wilayah Kota Padang</div>
        </div>
        <button onClick={() => setShowTambah(true)} style={{
          padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
          color: "#fff", border: "none", cursor: "pointer",
          fontSize: 14, fontWeight: 600, fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 6, transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)"
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.35)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.25)";
        }}
        >+ Tambah Posyandu</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Posyandu", value: statsAdmin.totalPosyandu, icon: "🏥" },
          { label: "Total Wilayah", value: statsAdmin.totalWilayah, icon: "🗺️" },
          { label: "Total Kader", value: statsAdmin.totalKader, icon: "👥" },
          { label: "Posyandu Aktif", value: posyandus.filter(p=>p.aktif).length, icon: "✅" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #E8EDF2" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF2", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E8EDF2", fontWeight: 600, fontSize: 15 }}>Daftar Posyandu</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Nama Posyandu", "Kecamatan", "Kelurahan", "Kader", "Total Balita", "Status", "Aksi"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E8EDF2" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posyandus.map(p => (
              <tr key={p.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td style={{ padding: "14px 16px", fontWeight: 600, fontSize: 13 }}>{p.nama}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{p.kecamatan}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{p.kelurahan}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{p.kader}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600 }}>{p.totalBalita}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    fontSize: 11, padding: "4px 10px", borderRadius: 20, fontWeight: 600,
                    background: p.aktif ? "#F0FDF4" : "#FEF2F2",
                    color: p.aktif ? "#16A34A" : "#EF4444"
                  }}>{p.aktif ? "Aktif" : "Nonaktif"}</span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 12 }}>Edit</button>
                    <button style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #EF4444", background: "#FEF2F2", color: "#EF4444", cursor: "pointer", fontSize: 12 }}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showTambah && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: 480, padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Tambah Unit Posyandu</div>
              <button onClick={() => setShowTambah(false)} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            {[["Nama Posyandu", "Contoh: Posyandu Melati"], ["Kecamatan", "Pilih kecamatan"], ["Kelurahan", "Nama kelurahan"], ["Nama Kader", "Nama kader penanggung jawab"], ["RT/RW", "RT/RW lokasi"]].map(([l, p]) => (
              <div key={l} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{l.toUpperCase()}</label>
                <input placeholder={p} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowTambah(false)} style={{ flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s ease" }} onMouseOver={(e) => { e.target.style.background = "#F9FAFB"; }} onMouseOut={(e) => { e.target.style.background = "#fff"; }}>Batal</button>
              <button style={{ flex: 1, padding: "12px", borderRadius: 8, background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit", transition: "all 0.3s ease", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)" }} onMouseOver={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.35)"; }} onMouseOut={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.25)"; }}>Simpan Posyandu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ManajemenUser() {
  const [showTambah, setShowTambah] = useState(false);
  const roleColors = { admin: "#8B5CF6", kader: "#16A34A", orangtua: "#3B82F6" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Manajemen User</div>
          <div style={{ fontSize: 14, color: "#6B7280" }}>Kelola akun pengguna sistem POSCO Kota Padang</div>
        </div>
        <button onClick={() => setShowTambah(true)} style={{ padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit", transition: "all 0.3s ease", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)" }} onMouseOver={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.35)"; }} onMouseOut={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.25)"; }}>+ Tambah User</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total User", value: users.length, color: "#16A34A" },
          { label: "Admin", value: users.filter(u=>u.role==="admin").length, color: "#8B5CF6" },
          { label: "Kader", value: users.filter(u=>u.role==="kader").length, color: "#16A34A" },
          { label: "Orang Tua", value: users.filter(u=>u.role==="orangtua").length, color: "#3B82F6" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #E8EDF2" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF2", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Pengguna", "Email", "Peran", "Wilayah", "Status", "Aksi"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E8EDF2" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: (roleColors[u.role] || "#16A34A") + "20", display: "flex", alignItems: "center", justifyContent: "center", color: roleColors[u.role], fontWeight: 700, fontSize: 13 }}>{u.name.charAt(0)}</div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{u.email}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: (roleColors[u.role] || "#16A34A") + "15", color: roleColors[u.role] || "#16A34A" }}>
                    {u.role === "admin" ? "Admin" : u.role === "kader" ? "Kader" : "Orang Tua"}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{u.wilayah}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: u.status === "active" ? "#F0FDF4" : "#FEF2F2", color: u.status === "active" ? "#16A34A" : "#EF4444" }}>
                    {u.status === "active" ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 12 }}>Edit</button>
                    <button style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #EF4444", background: "#FEF2F2", color: "#EF4444", cursor: "pointer", fontSize: 12 }}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showTambah && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: 480, padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Tambah Akun Baru</div>
              <button onClick={() => setShowTambah(false)} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>PERAN</label>
              <select style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", fontFamily: "inherit" }}>
                <option>Kader</option><option>Admin</option><option>Orang Tua</option>
              </select>
            </div>
            {[["Nama Lengkap", "Nama pengguna"], ["Email", "email@posco.id"], ["Kata Sandi", "Min. 8 karakter"], ["Wilayah", "Kecamatan/Kelurahan"]].map(([l, p]) => (
              <div key={l} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{l.toUpperCase()}</label>
                <input placeholder={p} type={l === "Kata Sandi" ? "password" : "text"} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowTambah(false)} style={{ flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s ease" }} onMouseOver={(e) => { e.target.style.background = "#F9FAFB"; }} onMouseOut={(e) => { e.target.style.background = "#fff"; }}>Batal</button>
              <button style={{ flex: 1, padding: "12px", borderRadius: 8, background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit", transition: "all 0.3s ease", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)" }} onMouseOver={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.35)"; }} onMouseOut={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.25)"; }}>Buat Akun</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.jumlah));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120, padding: "0 8px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{d.jumlah}</div>
          <div style={{ width: "100%", background: "#16A34A", borderRadius: "4px 4px 0 0", height: (d.jumlah / max) * 80 + "px" }} />
          <div style={{ fontSize: 10, color: "#9CA3AF", textAlign: "center" }}>{d.nama.split(" ")[0]}</div>
        </div>
      ))}
    </div>
  );
}

export function Analitik() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Analisis Gizi & Stunting</div>
        <div style={{ fontSize: 14, color: "#6B7280" }}>Data analitik pemantauan kesehatan Kota Padang</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Persentase Stunting", value: `${statsAdmin.persentaseStunting}%`, sub: "dari total balita", color: "#EF4444" },
          { label: "Gizi Kurang", value: "10.2%", sub: "dari total balita", color: "#F59E0B" },
          { label: "Cakupan Imunisasi", value: "78.3%", sub: "lengkap dasar", color: "#16A34A" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #E8EDF2" }}>
            <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 22, border: "1px solid #E8EDF2" }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Stunting per Kecamatan</div>
          <BarChart data={statsAdmin.stuntingPerKecamatan} />
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 22, border: "1px solid #E8EDF2" }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Distribusi Status Gizi</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {statsAdmin.distribusiGizi.map(d => (
              <div key={d.status}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: "#374151" }}>{d.status}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{d.persen}%</span>
                </div>
                <div style={{ height: 8, background: "#F3F4F6", borderRadius: 4 }}>
                  <div style={{
                    height: "100%", borderRadius: 4, width: `${d.persen}%`,
                    background: d.status === "Normal" ? "#16A34A" : d.status === "Gizi Kurang" ? "#F59E0B" : d.status === "Gizi Lebih" ? "#3B82F6" : "#EF4444"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 22, border: "1px solid #E8EDF2", gridColumn: "span 2" }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Daftar Warga Penerima Intervensi</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["Nama Anak", "Posyandu", "Intervensi", "Status", "Keterangan"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E8EDF2" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { nama: "Nayla Fitri", posyandu: "Posyandu Kenanga", intervensi: "PMT + Konseling", status: "Aktif", ket: "Bulan ke-3" },
                { nama: "Ahmad Zaki", posyandu: "Posyandu Melati", intervensi: "Rujukan Gizi", status: "Selesai", ket: "Normal kembali" },
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, fontSize: 13 }}>{r.nama}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: "#374151" }}>{r.posyandu}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13 }}>{r.intervensi}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: r.status === "Aktif" ? "#F0FDF4" : "#EFF6FF", color: r.status === "Aktif" ? "#16A34A" : "#3B82F6" }}>{r.status}</span>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: "#6B7280" }}>{r.ket}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}