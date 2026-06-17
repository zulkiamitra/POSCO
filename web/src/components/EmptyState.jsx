export default function EmptyState({
  icon = "📭",
  title = "Tidak ada data",
  description = "Data yang Anda cari tidak ditemukan",
  action = null,
  compact = false
}) {
  const containerStyle = compact ? "16px" : "40px";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: containerStyle,
      textAlign: "center",
      minHeight: compact ? "200px" : "300px",
      background: "#F9FAFB",
      borderRadius: 12,
      border: "1.5px dashed #E5E7EB"
    }}>
      <div style={{
        fontSize: compact ? 48 : 64,
        marginBottom: "16px",
        animation: "float 3s ease-in-out infinite"
      }}>
        {icon}
      </div>
      
      <h3 style={{
        fontSize: compact ? 16 : 18,
        fontWeight: 700,
        color: "#111827",
        margin: "0 0 8px",
        fontFamily: "'Inter', sans-serif"
      }}>
        {title}
      </h3>
      
      <p style={{
        fontSize: compact ? 13 : 14,
        color: "#6B7280",
        margin: "0 0 20px",
        maxWidth: 400,
        fontFamily: "'Inter', sans-serif"
      }}>
        {description}
      </p>

      {action && (
        <div style={{ marginTop: "16px" }}>
          {action}
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
