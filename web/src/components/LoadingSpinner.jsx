export default function LoadingSpinner({ message = "Loading...", fullScreen = false }) {
  if (fullScreen) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999
      }}>
        <div style={{
          background: "#fff",
          borderRadius: 12,
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px"
        }}>
          <div style={{
            width: 48,
            height: 48,
            border: "4px solid #E8EDF2",
            borderTop: "4px solid #16A34A",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{
            color: "#111827",
            fontWeight: 600,
            margin: 0,
            fontFamily: "'Inter', sans-serif"
          }}>
            {message}
          </p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      padding: "32px",
      gap: "16px"
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: "4px solid #E8EDF2",
        borderTop: "4px solid #16A34A",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
      {message && (
        <p style={{
          color: "#6B7280",
          fontWeight: 500,
          margin: 0,
          fontSize: 14,
          fontFamily: "'Inter', sans-serif"
        }}>
          {message}
        </p>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
