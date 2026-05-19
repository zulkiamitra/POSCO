import { useState } from "react";
import { statsAdmin, children, posyandus, users, jadwalSesi } from "../../data/dummyData";

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "20px 22px",
      border: "1px solid #E8EDF2", display: "flex", flexDirection: "column", gap: 4
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{label}</div>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: color + "15",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18
        }}>{icon}</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: color }}>{sub}</div>}
    </div>
  );
}

function MiniChart({ data, color = "#16A34A" }) {
  const max = Math.max(...data.map(d => d.nilai));
  const min = Math.min(...data.map(d => d.nilai));
  const range = max - min || 1;
  const h = 60, w = 100;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.nilai - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 60 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((d.nilai - min) / range) * h;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
}

export default function AdminDashboard({ onNavigate }) {
  const stuntingRecentKids = children.filter(c => c.statusStunting === "Stunting");
  const pendaftaranBaru = [
    { nama: "Dewi Permata", peran: "Orang Tua", tanggal: "Hari ini, 08:32", status: "Pending" },
    { nama: "Hidayat Putra", peran: "Kader", tanggal: "Hari ini, 07:15", status: "Aktif" },
    { nama: "Rina Mahendra", peran: "Orang Tua", tanggal: "Kemarin, 14:20", status: "Aktif" },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Ringkasan Sistem</div>
        <div style={{ fontSize: 14, color: "#6B7280" }}>Pemantauan data kesehatan Kota Padang – April 2024</div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Balita Terdaftar" value={statsAdmin.totalBalita} icon="👶" color="#16A34A" sub={`+12 bulan ini`} />
        <StatCard label="Kasus Stunting" value={statsAdmin.totalStunting} icon="⚠️" color="#F59E0B" sub={`${statsAdmin.persentaseStunting}% dari total`} />
        <StatCard label="Ibu Hamil Aktif" value={statsAdmin.totalIbuHamil} icon="🤰" color="#3B82F6" sub="3 berisiko tinggi" />
        <StatCard label="Kader Aktif" value={statsAdmin.totalKader} icon="👥" color="#8B5CF6" sub={`${statsAdmin.totalPosyandu} posyandu`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Trend Stunting Chart */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 22, border: "1px solid #E8EDF2" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>Tren Gizi & Status Stunting</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>6 bulan terakhir</div>
            </div>
            <select style={{ fontSize: 12, border: "1px solid #E5E7EB", borderRadius: 6, padding: "4px 8px", color: "#374151" }}>
              <option>6 Bulan</option>
              <option>1 Tahun</option>
            </select>
          </div>
          <MiniChart data={statsAdmin.trendStunting} />
          <div style={{ display: "flex", gap: 4, marginTop: 8, justifyContent: "space-between" }}>
            {statsAdmin.trendStunting.map(d => (
              <div key={d.bulan} style={{ fontSize: 11, color: "#9CA3AF", flex: 1, textAlign: "center" }}>{d.bulan}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
            {statsAdmin.distribusiGizi.map(d => (
              <div key={d.status} style={{
                background: "#F9FAFB", borderRadius: 8, padding: "8px 12px",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div style={{ fontSize: 12, color: "#374151" }}>{d.status}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{d.persen}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pendaftaran Baru */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 22, border: "1px solid #E8EDF2" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>Pendaftaran Baru</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Permintaan akun terbaru</div>
            </div>
            <button onClick={() => onNavigate("manajemen")} style={{
              fontSize: 12, color: "#16A34A", background: "#F0FDF4", border: "none",
              borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontWeight: 500
            }}>Lihat Semua</button>
          </div>
          {pendaftaranBaru.map((p, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
              borderBottom: i < pendaftaranBaru.length - 1 ? "1px solid #F3F4F6" : "none"
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "#F0FDF4", display: "flex", alignItems: "center",
                justifyContent: "center", color: "#16A34A", fontWeight: 700, fontSize: 14
              }}>{p.nama.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{p.nama}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{p.peran} · {p.tanggal}</div>
              </div>
              <span style={{
                fontSize: 11, padding: "3px 10px", borderRadius: 20,
                background: p.status === "Aktif" ? "#F0FDF4" : "#FEF3C7",
                color: p.status === "Aktif" ? "#16A34A" : "#D97706", fontWeight: 600
              }}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Peringatan Notifikasi & Stunting */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Peringatan Kasus Stunting */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 22, border: "1px solid #E8EDF2" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>Kasus Perlu Perhatian</div>
            <button onClick={() => onNavigate("monitoring")} style={{
              fontSize: 12, color: "#EF4444", background: "#FEF2F2", border: "none",
              borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontWeight: 500
            }}>Lihat Semua</button>
          </div>
          {stuntingRecentKids.map(c => (
            <div key={c.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
              borderBottom: "1px solid #F3F4F6"
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "#FEF2F2", display: "flex", alignItems: "center",
                justifyContent: "center", color: "#EF4444", fontWeight: 700, fontSize: 12
              }}>{c.nama.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{c.nama}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{c.posyandu}</div>
              </div>
              <span style={{
                fontSize: 11, padding: "3px 10px", borderRadius: 20,
                background: "#FEF2F2", color: "#EF4444", fontWeight: 600
              }}>{c.statusStunting}</span>
            </div>
          ))}
          {children.filter(c => c.statusGizi !== "Normal" && c.statusStunting !== "Stunting").slice(0, 2).map(c => (
            <div key={c.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
              borderBottom: "1px solid #F3F4F6"
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "#FEF3C7", display: "flex", alignItems: "center",
                justifyContent: "center", color: "#D97706", fontWeight: 700, fontSize: 12
              }}>{c.nama.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{c.nama}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{c.posyandu}</div>
              </div>
              <span style={{
                fontSize: 11, padding: "3px 10px", borderRadius: 20,
                background: "#FEF3C7", color: "#D97706", fontWeight: 600
              }}>{c.statusGizi}</span>
            </div>
          ))}
        </div>

        {/* Posyandu Status */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 22, border: "1px solid #E8EDF2" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>Status Posyandu</div>
            <button onClick={() => onNavigate("wilayah")} style={{
              fontSize: 12, color: "#16A34A", background: "#F0FDF4", border: "none",
              borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontWeight: 500
            }}>Lihat Semua</button>
          </div>
          {posyandus.map(p => (
            <div key={p.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
              borderBottom: "1px solid #F3F4F6"
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{p.nama}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{p.kecamatan} · {p.totalBalita} balita</div>
              </div>
              <span style={{
                fontSize: 11, padding: "3px 10px", borderRadius: 20,
                background: p.aktif ? "#F0FDF4" : "#FEF2F2",
                color: p.aktif ? "#16A34A" : "#EF4444", fontWeight: 600
              }}>{p.aktif ? "Aktif" : "Tidak Aktif"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}