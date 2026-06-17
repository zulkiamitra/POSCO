import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, type }]);

    if (duration) {
      const timeout = setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
      return () => clearTimeout(timeout);
    }

    return () => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    };
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = {
    notifications,
    addNotification,
    remove: removeNotification,
    success: (msg, duration) => addNotification(msg, "success", duration),
    error: (msg, duration) => addNotification(msg, "error", duration),
    warning: (msg, duration) => addNotification(msg, "warning", duration),
    info: (msg, duration) => addNotification(msg, "info", duration),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}

// Toast Container Component
function ToastContainer({ notifications, onRemove }) {
  return (
    <div style={{
      position: "fixed",
      top: 20,
      right: 20,
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      maxWidth: 400,
      pointerEvents: "none"
    }}>
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

function Toast({ notification, onRemove }) {
  const getStyles = () => {
    const baseStyle = {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 16px",
      borderRadius: 8,
      fontFamily: "'Inter', sans-serif",
      fontSize: 14,
      fontWeight: 500,
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      animation: "slideIn 0.3s ease-out",
      pointerEvents: "auto",
      cursor: "pointer"
    };

    const typeStyles = {
      success: {
        ...baseStyle,
        background: "#D1FAE5",
        color: "#065F46",
        border: "1px solid #A7F3D0"
      },
      error: {
        ...baseStyle,
        background: "#FEE2E2",
        color: "#991B1B",
        border: "1px solid #FCA5A5"
      },
      warning: {
        ...baseStyle,
        background: "#FEF3C7",
        color: "#92400E",
        border: "1px solid #FCD34D"
      },
      info: {
        ...baseStyle,
        background: "#DBEAFE",
        color: "#1E40AF",
        border: "1px solid #93C5FD"
      }
    };

    return typeStyles[notification.type] || typeStyles.info;
  };

  const getIcon = () => {
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ"
    };
    return icons[notification.type] || "•";
  };

  return (
    <>
      <div
        style={getStyles()}
        onClick={() => onRemove(notification.id)}
      >
        <span style={{ fontSize: 18, fontWeight: 700 }}>
          {getIcon()}
        </span>
        <span style={{ flex: 1 }}>
          {notification.message}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(notification.id);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
            opacity: 0.5,
            hover: { opacity: 1 },
            fontFamily: "inherit",
            color: "inherit",
            padding: 0
          }}
        >
          ×
        </button>
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
