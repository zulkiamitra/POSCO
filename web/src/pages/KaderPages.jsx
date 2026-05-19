import { useState } from "react";
import { children, ibuHamil, jadwalSesi, rujukan } from "../../data/dummyData";
import { useAuth } from "../../context/AuthContext";

export function KaderDashboard() {
  const { user } = useAuth();
  const myChildren = children.slice(0, 3);

  return (
    <div>
      {/* Greeting */}
      <div style={{ background: "linear-gradient(135deg, #16A34A, #22C55E)", borderRadius: 20, padding: "24px 28px", marginBottom: 24, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", right: 30, bottom: -40, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ fontSize: 13, opacity: 0.85 }}>Selamat datang,</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>Halo, {user?.name}!</div>
        <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>{user?.posyandu} · {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
        <div style={{ display: "flex", gap: 24, marginTop: 20 }}>
          {[{ label: "Balita Terdaftar", value: 45 }, { label: "Ibu Hamil", value: 8 }, { label: "Pemeriksaan Bulan Ini", value: 32 }].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Sesi Bulan Ini", value: 2, icon: "📅", color: "#3B82F6" },
          { label: "Rujukan Aktif", value: rujukan.filter(r=>r.status!=="Selesai").length, icon: "🏥", color: "#F59E0B" },
          { label: "Ibu Hamil Risiko Tinggi", value: ibuHamil.filter(i=>i.risikoTinggi).length, icon: "⚠️", color: "#EF4444" },
          { label: "Imunisasi Jatuh Tempo", value: 3, icon: "💉", color: "#8B5CF6" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #E8EDF2" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
        {/* Daftar Balita Recent */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 22, border: "1px solid #E8EDF2" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Daftar Balita Terbaru</div>
            <span style={{ fontSize: 12, color: "#16A34A" }}>Lihat Semua →</span>
          </div>
          {myChildren.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {c.jenisKelamin === "P" ? "👧" : "👦"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{c.nama}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{c.namaIbu} · {c.beratBadan}kg · {c.tinggiBadan}cm</div>
              </div>
              <span style={{
                fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600,
                background: c.statusGizi === "Normal" ? "#F0FDF4" : c.statusStunting === "Stunting" ? "#FEF2F2" : "#FEF3C7",
                color: c.statusGizi === "Normal" ? "#16A34A" : c.statusStunting === "Stunting" ? "#EF4444" : "#D97706",
              }}>{c.statusGizi}</span>
              <button style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #16A34A", background: "#F0FDF4", color: "#16A34A", cursor: "pointer", fontSize: 11 }}>Input</button>
            </div>
          ))}
        </div>

        {/* Jadwal & Notifikasi */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 22, border: "1px solid #E8EDF2" }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Jadwal Mendatang</div>
            {jadwalSesi.filter(j => j.status === "Mendatang").slice(0, 2).map(j => (
              <div key={j.id} style={{ background: "#F0FDF4", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#16A34A" }}>{j.posyandu}</div>
                <div style={{ fontSize: 12, color: "#374151", marginTop: 2 }}>📅 {new Date(j.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long" })} · {j.waktu}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", borderRadius: 16, padding: 22, border: "1px solid #E8EDF2" }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Aksi Terbaru</div>
            {rujukan.slice(0, 2).map(r => (
              <div key={r.id} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: r.status === "Selesai" ? "#16A34A" : "#F59E0B", marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.namaAnak}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{r.alasan}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DataWarga() {
  const [tab, setTab] = useState("balita");
  const [showTambahAnak, setShowTambahAnak] = useState(false);
  const [showTambahIbu, setShowTambahIbu] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Data Warga</div>
          <div style={{ fontSize: 14, color: "#6B7280" }}>Kelola data balita dan ibu hamil di wilayah Anda</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setShowTambahIbu(true)} style={{ padding: "9px 16px", borderRadius: 8, border: "1.5px solid #16A34A", background: "#F0FDF4", color: "#16A34A", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s ease" }} onMouseOver={(e) => { e.target.style.background = "#E8F5E9"; }} onMouseOut={(e) => { e.target.style.background = "#F0FDF4"; }}>+ Tambah Ibu Hamil</button>
          <button onClick={() => setShowTambahAnak(true)} style={{ padding: "9px 16px", borderRadius: 8, background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.3s ease", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)" }} onMouseOver={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.35)"; }} onMouseOut={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.25)"; }}>+ Tambah Anak</button>
        </div>
      </div>

      {/* Tab */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#F3F4F6", padding: 4, borderRadius: 10, width: "fit-content" }}>
        {["balita", "ibu-hamil"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 20px", borderRadius: 8, border: "none",
            background: tab === t ? "#fff" : "transparent",
            color: tab === t ? "#111827" : "#6B7280",
            cursor: "pointer", fontSize: 14, fontWeight: tab === t ? 600 : 400,
            boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            fontFamily: "inherit",
          }}>{t === "balita" ? "👶 Data Balita" : "🤰 Ibu Hamil"}</button>
        ))}
      </div>

      {tab === "balita" ? (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF2", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["Nama Anak", "Tgl Lahir", "BB/TB", "Status Gizi", "Stunting", "Aksi"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E8EDF2" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {children.map(c => (
                <tr key={c.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{c.nama}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>Ibu: {c.namaIbu}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>
                    {new Date(c.tanggalLahir).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>{c.beratBadan}kg / {c.tinggiBadan}cm</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: c.statusGizi === "Normal" ? "#F0FDF4" : "#FEF3C7", color: c.statusGizi === "Normal" ? "#16A34A" : "#D97706" }}>{c.statusGizi}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: c.statusStunting === "Stunting" ? "#FEF2F2" : "#F0FDF4", color: c.statusStunting === "Stunting" ? "#EF4444" : "#16A34A" }}>{c.statusStunting}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #16A34A", background: "#F0FDF4", color: "#16A34A", cursor: "pointer", fontSize: 11 }}>Periksa</button>
                      <button style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 11 }}>Detail</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF2", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["Nama Ibu", "Usia", "Usia Kehamilan", "TD", "Taksir Persalinan", "Risiko", "Aksi"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E8EDF2" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ibuHamil.map(ibu => (
                <tr key={ibu.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 600, fontSize: 13 }}>{ibu.nama}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{ibu.usia} tahun</td>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>{ibu.usiaKehamilan} minggu</td>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>{ibu.tekananDarah}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>
                    {new Date(ibu.taksirPersalinan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: ibu.risikoTinggi ? "#FEF2F2" : "#F0FDF4", color: ibu.risikoTinggi ? "#EF4444" : "#16A34A" }}>
                      {ibu.risikoTinggi ? "Risiko Tinggi" : "Normal"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #16A34A", background: "#F0FDF4", color: "#16A34A", cursor: "pointer", fontSize: 11 }}>Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Tambah Anak */}
      {showTambahAnak && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: 520, padding: 32, maxHeight: "85vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Registrasi Anak Baru</div>
              <button onClick={() => setShowTambahAnak(false)} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["Nama Anak", "Nama lengkap"], ["NIK Anak", "16 digit NIK"], ["Tanggal Lahir", ""], ["Jenis Kelamin", ""], ["Berat Lahir (kg)", ""], ["Tinggi Lahir (cm)", ""], ["Nama Ibu", ""], ["NIK Ibu", "16 digit NIK"]].map(([l, p], i) => (
                <div key={l}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{l.toUpperCase()}</label>
                  {l === "Jenis Kelamin" ? (
                    <select style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit" }}>
                      <option>Laki-laki</option><option>Perempuan</option>
                    </select>
                  ) : (
                    <input type={l.includes("Lahir") && !l.includes("Berat") ? "date" : "text"} placeholder={p} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowTambahAnak(false)} style={{ flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s ease" }} onMouseOver={(e) => { e.target.style.background = "#F9FAFB"; }} onMouseOut={(e) => { e.target.style.background = "#fff"; }}>Batal</button>
              <button style={{ flex: 1, padding: "12px", borderRadius: 8, background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit", transition: "all 0.3s ease", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)" }} onMouseOver={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 20px rgba(22, 163, 74, 0.35)"; }} onMouseOut={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.25)"; }}>Simpan Data Anak</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Ibu Hamil */}
      {showTambahIbu && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: 480, padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Tambah Ibu Hamil Baru</div>
              <button onClick={() => setShowTambahIbu(false)} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            {[["Nama Ibu", "Nama lengkap"], ["NIK", "16 digit NIK"], ["Usia", "Usia ibu"], ["HPHT", ""], ["Tekanan Darah", "e.g. 120/80"], ["Berat Badan (kg)", ""]].map(([l, p]) => (
              <div key={l} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{l.toUpperCase()}</label>
                <input type={l === "HPHT" ? "date" : "text"} placeholder={p} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowTambahIbu(false)} style={{ flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Batal</button>
              <button style={{ flex: 1, padding: "12px", borderRadius: 8, background: "#16A34A", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Simpan Data Ibu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function InputPemeriksaan() {
  const [selected, setSelected] = useState(children[0]);
  const [step, setStep] = useState(1);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Input Pemeriksaan</div>
        <div style={{ fontSize: 14, color: "#6B7280" }}>Catat data pemeriksaan balita pada sesi posyandu</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20 }}>
        {/* Pilih Balita */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #E8EDF2" }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Pilih Balita</div>
          <input placeholder="🔍 Cari nama anak..." style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 14, marginBottom: 12, boxSizing: "border-box", fontFamily: "inherit" }} />
          {children.map(c => (
            <div key={c.id} onClick={() => setSelected(c)} style={{
              padding: "12px", borderRadius: 10, cursor: "pointer", marginBottom: 6,
              border: selected?.id === c.id ? "2px solid #16A34A" : "1.5px solid #E8EDF2",
              background: selected?.id === c.id ? "#F0FDF4" : "#fff",
            }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{c.nama}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>{c.namaIbu} · {c.beratBadan}kg</div>
            </div>
          ))}
        </div>

        {/* Form Pemeriksaan */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {selected && (
            <div style={{ background: "#F0FDF4", borderRadius: 16, padding: 20, border: "1px solid #BBF7D0" }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#16A34A" }}>Data Terakhir: {selected.nama}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 10 }}>
                {[["Berat Badan", `${selected.beratBadan} kg`], ["Tinggi Badan", `${selected.tinggiBadan} cm`], ["Status Gizi", selected.statusGizi]].map(([l, v]) => (
                  <div key={l} style={{ background: "#fff", borderRadius: 8, padding: "10px" }}>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{l}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#16A34A", marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: "#fff", borderRadius: 16, padding: 22, border: "1px solid #E8EDF2" }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Data Pemeriksaan Baru</div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>TANGGAL PEMERIKSAAN</label>
              <input type="date" defaultValue={new Date().toISOString().split("T")[0]} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["Berat Badan (kg)", "0.0"], ["Tinggi Badan (cm)", "0.0"], ["Lingkar Kepala (cm)", "0.0"], ["Lingkar Lengan (cm)", "0.0"]].map(([l, p]) => (
                <div key={l}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{l.toUpperCase()}</label>
                  <input type="number" placeholder={p} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>IMUNISASI YANG DIBERIKAN</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["BCG", "HB0", "Polio 1", "DPT 1", "DPT 2", "Campak", "MR"].map(i => (
                  <label key={i} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
                    <input type="checkbox" style={{ accentColor: "#16A34A" }} />
                    {i}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>CATATAN TAMBAHAN</label>
              <textarea rows={3} placeholder="Catatan kondisi anak, saran, dll..." style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
            </div>

            <div style={{ marginTop: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>DIAGNOSA OTOMATIS</label>
              <div style={{ background: "#F0FDF4", borderRadius: 8, padding: 12, border: "1px solid #BBF7D0" }}>
                <div style={{ fontSize: 13, color: "#16A34A", fontWeight: 600 }}>✓ Sistem akan menghitung status gizi secara otomatis</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Berdasarkan z-score WHO (BB/U, TB/U, BB/TB)</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
              {["Simpan & Lanjut", "Simpan & Rujuk"].map((btn, i) => (
                <button key={btn} style={{
                  padding: "12px", borderRadius: 10, fontWeight: 600, cursor: "pointer",
                  background: i === 0 ? "#16A34A" : "#fff",
                  color: i === 0 ? "#fff" : "#374151",
                  border: i === 0 ? "none" : "1px solid #E5E7EB",
                  fontSize: 14, fontFamily: "inherit",
                }}>{btn}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function JadwalSesi() {
  const [showBuat, setShowBuat] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Jadwal Sesi Layanan</div>
          <div style={{ fontSize: 14, color: "#6B7280" }}>Kelola jadwal posyandu dan pantau kehadiran</div>
        </div>
        <button onClick={() => setShowBuat(true)} style={{ padding: "10px 20px", borderRadius: 10, background: "#16A34A", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>+ Buat Sesi Baru</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Orang Hadir", value: jadwalSesi.reduce((s,j)=>s+j.jumlahHadir, 0), color: "#16A34A" },
          { label: "Jadwal Aktif", value: jadwalSesi.filter(j=>j.status==="Mendatang").length, color: "#3B82F6" },
          { label: "Mendatang", value: jadwalSesi.filter(j=>j.status==="Mendatang").length, color: "#F59E0B" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #E8EDF2", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20 }}>
        {/* Mini Calendar */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 22, border: "1px solid #E8EDF2" }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>April 2024</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center" }}>
            {["M","S","S","R","K","J","S"].map((d, i) => (
              <div key={i} style={{ fontSize: 11, color: "#9CA3AF", padding: "4px 0" }}>{d}</div>
            ))}
            {Array.from({length: 30}, (_,i) => i + 1).map(d => (
              <div key={d} style={{
                padding: "6px 4px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                background: [25, 26].includes(d) ? "#16A34A" : d === 28 ? "#F0FDF4" : "transparent",
                color: [25, 26].includes(d) ? "#fff" : d === 28 ? "#16A34A" : "#374151",
                fontWeight: [25, 26].includes(d) ? 700 : 400,
              }}>{d}</div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #E8EDF2", marginTop: 14, paddingTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Sesi Hari Ini</div>
            <div style={{ background: "#F0FDF4", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#16A34A" }}>Posyandu Melati</div>
              <div style={{ fontSize: 12, color: "#374151" }}>08:00 – 11:00 WIB</div>
            </div>
          </div>
        </div>

        {/* Daftar Jadwal */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {jadwalSesi.map(j => (
            <div key={j.id} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #E8EDF2" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{j.posyandu}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                    📅 {new Date(j.tanggal).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })} · {j.waktu}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>Kader: {j.kader}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: j.status === "Selesai" ? "#F0FDF4" : "#EFF6FF", color: j.status === "Selesai" ? "#16A34A" : "#3B82F6" }}>{j.status}</span>
                  {j.status === "Selesai" && <div style={{ fontSize: 12, color: "#6B7280" }}>{j.jumlahHadir} hadir</div>}
                </div>
              </div>
              {j.status === "Mendatang" && (
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button style={{ flex: 1, padding: "8px", borderRadius: 8, background: "#16A34A", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>Mulai Sesi</button>
                  <button style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Edit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showBuat && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: 460, padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Buat Sesi Layanan Baru</div>
              <button onClick={() => setShowBuat(false)} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            {[["Tanggal Sesi", "date"], ["Waktu Mulai", "time"], ["Waktu Selesai", "time"], ["Lokasi / Posyandu", "text"], ["Estimasi Peserta", "number"]].map(([l, t]) => (
              <div key={l} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{l.toUpperCase()}</label>
                <input type={t} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowBuat(false)} style={{ flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Batal</button>
              <button style={{ flex: 1, padding: "12px", borderRadius: 8, background: "#16A34A", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Buat Sesi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TindakLanjut() {
  const [showBuatRujukan, setShowBuatRujukan] = useState(false);
  const [showCatatKonseling, setShowCatatKonseling] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Tindak Lanjut & Rujukan</div>
        <div style={{ fontSize: 14, color: "#6B7280" }}>Kelola rujukan dan catatan konseling warga</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Rujukan", value: rujukan.length, color: "#EF4444", icon: "🏥" },
          { label: "Proses", value: rujukan.filter(r=>r.status==="Proses").length, color: "#F59E0B", icon: "⏳" },
          { label: "Selesai", value: rujukan.filter(r=>r.status==="Selesai").length, color: "#16A34A", icon: "✅" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #E8EDF2", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 24 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setShowBuatRujukan(true)} style={{ padding: "10px 20px", borderRadius: 10, background: "#16A34A", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>+ Buat Surat Rujukan</button>
        <button onClick={() => setShowCatatKonseling(true)} style={{ padding: "10px 20px", borderRadius: 10, border: "1.5px solid #16A34A", background: "#F0FDF4", color: "#16A34A", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>+ Catat Konseling</button>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF2", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E8EDF2", fontWeight: 600, fontSize: 15 }}>Riwayat Rujukan</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Nama Anak", "Alasan Rujukan", "Tujuan", "Tanggal", "Status", "Kader"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E8EDF2" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rujukan.map(r => (
              <tr key={r.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td style={{ padding: "14px 16px", fontWeight: 600, fontSize: 13 }}>{r.namaAnak}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{r.alasan}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{r.tujuan}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{new Date(r.tanggal).toLocaleDateString("id-ID")}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: r.status === "Selesai" ? "#F0FDF4" : r.status === "Proses" ? "#FEF3C7" : "#EFF6FF", color: r.status === "Selesai" ? "#16A34A" : r.status === "Proses" ? "#D97706" : "#3B82F6" }}>{r.status}</span>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{r.kader}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Buat Rujukan */}
      {showBuatRujukan && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: 460, padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Buat Surat Rujukan</div>
              <button onClick={() => setShowBuatRujukan(false)} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#DC2626" }}>⚠️ Kondisi memerlukan penanganan segera</div>
            </div>
            {[["Nama Anak", "Pilih anak yang dirujuk"], ["Alasan Rujukan", "Kondisi yang memerlukan rujukan"], ["Tujuan Rujukan", "Nama faskes tujuan"], ["Nama Dokter", "Opsional"], ["Tingkat Urgensi", ""]].map(([l, p]) => (
              <div key={l} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{l.toUpperCase()}</label>
                {l === "Tingkat Urgensi" ? (
                  <select style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit" }}>
                    <option>Biasa</option><option>Segera</option><option>Darurat</option>
                  </select>
                ) : (
                  <input placeholder={p} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                )}
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowBuatRujukan(false)} style={{ flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Batal</button>
              <button style={{ flex: 1, padding: "12px", borderRadius: 8, background: "#16A34A", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Kirim Rujukan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konseling */}
      {showCatatKonseling && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 20, width: 460, padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Catatan Konseling Baru</div>
              <button onClick={() => setShowCatatKonseling(false)} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            {[["Nama Warga", "Nama ibu/anak"], ["Tanggal Konseling", "date"], ["Topik Konseling", ""], ["Isi Konseling", ""]].map(([l, t]) => (
              <div key={l} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{l.toUpperCase()}</label>
                {l === "Topik Konseling" ? (
                  <select style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "inherit" }}>
                    <option>Gizi Anak</option><option>ASI Eksklusif</option><option>Tumbuh Kembang</option><option>Imunisasi</option>
                  </select>
                ) : l === "Isi Konseling" ? (
                  <textarea rows={4} placeholder="Catat isi konseling..." style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                ) : (
                  <input type={t} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                )}
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowCatatKonseling(false)} style={{ flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Batal</button>
              <button style={{ flex: 1, padding: "12px", borderRadius: 8, background: "#16A34A", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Simpan Catatan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}