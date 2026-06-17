# 📁 RECOMMENDED FILE STRUCTURE & REFACTORING ROADMAP

## Current Structure vs Recommended Structure

### CURRENT (Messy) 🔴
```
src/
├── pages/                          ← Mixed concerns
│   ├── Authcontext.jsx (❌ DELETE)
│   ├── AdminDashboard.jsx (500+ lines)
│   ├── AdminLogin.jsx
│   ├── AdminPages.jsx (❌ DELETE)
│   ├── Dashboard.jsx (300+ lines)
│   ├── Dasboard.jsx (❌ DELETE - TYPO)
│   ├── Dummydata.js (❌ DELETE)
│   ├── ForgotPassword.jsx
│   ├── Home.jsx (500+ lines)
│   ├── KaderDashboard.jsx
│   ├── KaderPages.jsx (❌ DELETE)
│   ├── Layout.jsx (❌ DELETE)
│   ├── Login.jsx
│   ├── ModalForm.jsx
│   ├── MonitoringAnak.jsx (❌ DELETE)
│   ├── OrangtuaDashboard.jsx
│   └── Register.jsx
├── context/
│   └── AuthContext.jsx
├── components/
│   └── ProtectedRoute.jsx
├── data/
│   └── dummyData.js
├── assets/
├── App.jsx
├── App.css
├── index.css
├── main.jsx
└── styles.css
```

**Problems:**
- ❌ 17 page files, but only 10 are used
- ❌ No clear separation of concerns
- ❌ Components mixed with pages
- ❌ Inline styles scattered everywhere
- ❌ No reusable component library
- ❌ Hard to scale

---

### RECOMMENDED (Clean & Scalable) ✅

```
src/
├── components/                      ← Reusable components only
│   ├── shared/                      ← UI primitives
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Badge.jsx
│   │   ├── Alert.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── EmptyState.jsx
│   │   └── Pagination.jsx
│   ├── layout/                      ← Layout components
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.jsx
│   ├── forms/                       ← Form components
│   │   ├── UserForm.jsx
│   │   ├── ChildForm.jsx
│   │   ├── PosyanduForm.jsx
│   │   └── FormField.jsx
│   ├── tables/                      ← Table components
│   │   ├── BaseTable.jsx
│   │   ├── UsersTable.jsx
│   │   ├── ChildrenTable.jsx
│   │   └── PosyanduTable.jsx
│   ├── auth/                        ← Auth components
│   │   ├── ProtectedRoute.jsx
│   │   ├── AuthGuard.jsx
│   │   └── RoleGuard.jsx
│   └── common/                      ← Other components
│       ├── Navbar.jsx
│       ├── Toast.jsx
│       └── Notification.jsx
├── pages/                           ← Page/container components only
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── styles/
│   │       ├── Login.module.css
│   │       ├── Register.module.css
│   │       └── ForgotPassword.module.css
│   ├── admin/
│   │   ├── AdminDashboard.jsx (container - 100-150 lines)
│   │   ├── UserManagement.jsx
│   │   ├── PosyanduManagement.jsx
│   │   ├── Analytics.jsx
│   │   ├── ActivityLog.jsx
│   │   └── styles/
│   │       ├── AdminDashboard.module.css
│   │       ├── UserManagement.module.css
│   │       └── etc...
│   ├── kader/
│   │   ├── KaderDashboard.jsx (container)
│   │   ├── ChildManagement.jsx
│   │   ├── SessionSchedule.jsx
│   │   ├── FollowUp.jsx
│   │   ├── Reports.jsx
│   │   └── styles/
│   │       └── Kader*.module.css
│   ├── orangtua/
│   │   ├── OrangtuaDashboard.jsx (container)
│   │   ├── ChildHealth.jsx
│   │   ├── Appointments.jsx
│   │   ├── GrowthChart.jsx
│   │   └── styles/
│   │       └── Orangtua*.module.css
│   ├── Home.jsx
│   └── NotFound.jsx
├── context/                         ← Global state
│   ├── AuthContext.jsx
│   ├── DataContext.jsx
│   ├── NotificationContext.jsx
│   └── ThemeContext.jsx (future)
├── hooks/                           ← Custom hooks
│   ├── useAuth.js
│   ├── useNotification.js
│   ├── useData.js
│   └── usePagination.js
├── utils/                           ← Utilities & helpers
│   ├── constants.js                 ← Colors, spacing, etc
│   ├── validation.js                ← Form validators
│   ├── formatters.js                ← Date, currency formatting
│   ├── api.js                       ← API calls (ready for backend)
│   └── storage.js                   ← localStorage helpers
├── styles/                          ← Global styles
│   ├── variables.css                ← CSS custom properties
│   ├── globals.css                  ← Global styles
│   ├── reset.css                    ← CSS reset
│   └── animations.css               ← Keyframes
├── data/                            ← Mock data only
│   └── mockData.js
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── App.jsx                          ← Main app component
├── main.jsx                         ← Entry point
└── index.css
```

**Advantages:**
- ✅ Clear separation of concerns
- ✅ Easy to locate files
- ✅ High reusability
- ✅ Easy to test
- ✅ Easy to scale
- ✅ Shared styling
- ✅ Custom hooks for logic

---

## Step-by-Step Refactoring Plan

### **PHASE 1: Clean Up (2-3 hours)**

#### Step 1: Delete Unused Files
```bash
# These files are NOT used - DELETE:
rm src/pages/Authcontext.jsx
rm src/pages/Dasboard.jsx          # TYPO
rm src/pages/Dummydata.js          # DUPLICATE
rm src/pages/AdminPages.jsx
rm src/pages/KaderPages.jsx
rm src/pages/Layout.jsx
rm src/pages/MonitoringAnak.jsx

# Keep only:
✅ src/pages/Login.jsx
✅ src/pages/AdminLogin.jsx
✅ src/pages/Register.jsx
✅ src/pages/ForgotPassword.jsx
✅ src/pages/Home.jsx
✅ src/pages/Dashboard.jsx
✅ src/pages/AdminDashboard.jsx
✅ src/pages/KaderDashboard.jsx
✅ src/pages/OrangtuaDashboard.jsx
✅ src/pages/ModalForm.jsx (temp, will convert to component)
```

#### Step 2: Create Directory Structure
```bash
mkdir -p src/components/shared
mkdir -p src/components/layout
mkdir -p src/components/forms
mkdir -p src/components/tables
mkdir -p src/components/auth
mkdir -p src/components/common
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/styles
mkdir -p src/pages/auth
mkdir -p src/pages/admin
mkdir -p src/pages/kader
mkdir -p src/pages/orangtua
```

#### Step 3: Create Constants File
```javascript
// src/utils/constants.js
export const COLORS = {
  primary: "#16A34A",
  primary_dark: "#15803D",
  primary_light: "#F0FDF4",
  secondary: "#F3F4F6",
  error: "#DC2626",
  warning: "#D97706",
  success: "#10B981",
  info: "#3B82F6",
  text_primary: "#111827",
  text_secondary: "#6B7280",
  border: "#E5E7EB",
  bg_light: "#F9FAFB",
};

export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "40px",
};

export const RADIUS = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  full: "9999px",
};

export const SHADOWS = {
  xs: "0 1px 2px rgba(0,0,0,0.05)",
  sm: "0 1px 3px rgba(0,0,0,0.1)",
  md: "0 4px 12px rgba(0,0,0,0.08)",
  lg: "0 10px 25px rgba(0,0,0,0.1)",
  xl: "0 20px 50px rgba(0,0,0,0.15)",
};
```

#### Step 4: Create CSS Variables
```css
/* src/styles/variables.css */
:root {
  --primary: #16A34A;
  --primary-dark: #15803D;
  --primary-light: #F0FDF4;
  --error: #DC2626;
  --warning: #D97706;
  --success: #10B981;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --border: #E5E7EB;
  --bg-light: #F9FAFB;
  
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  
  --font-sans: 'Inter', sans-serif;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
}
```

---

### **PHASE 2: Extract Shared Components (4-5 hours)**

#### Create Reusable Components

**1. Button Component**
```jsx
// src/components/shared/Button.jsx
import styles from "./Button.module.css";

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  children,
  className,
  ...props
}) {
  const buttonClass = `
    ${styles.button}
    ${styles[variant]}
    ${styles[size]}
    ${disabled || loading ? styles.disabled : ""}
    ${className || ""}
  `;

  return (
    <button
      className={buttonClass}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
```

**2. Input Component**
```jsx
// src/components/shared/Input.jsx
import styles from "./Input.module.css";

export function Input({
  label,
  error,
  type = "text",
  required = false,
  ...props
}) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        className={`${styles.input} ${error ? styles.error : ""}`}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
```

**3. Card Component**
```jsx
// src/components/shared/Card.jsx
import styles from "./Card.module.css";

export function Card({ children, className, ...props }) {
  return (
    <div className={`${styles.card} ${className || ""}`} {...props}>
      {children}
    </div>
  );
}
```

**4. LoadingSpinner**
```jsx
// src/components/shared/LoadingSpinner.jsx
import styles from "./LoadingSpinner.module.css";

export function LoadingSpinner({ size = "md", message }) {
  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
```

**5. EmptyState**
```jsx
// src/components/shared/EmptyState.jsx
import styles from "./EmptyState.module.css";

export function EmptyState({ icon = "📭", title, description, action }) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
```

**6. Notification/Toast System**
```jsx
// src/context/NotificationContext.jsx
import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        success: (msg, duration) => addNotification(msg, "success", duration),
        error: (msg, duration) => addNotification(msg, "error", duration),
        warning: (msg, duration) => addNotification(msg, "warning", duration),
        info: (msg, duration) => addNotification(msg, "info", duration),
        remove: removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
```

---

### **PHASE 3: Extract Inline Styles (3-4 hours)**

Convert all inline styles to CSS Modules:

```bash
# For each page, create corresponding CSS module:
src/pages/auth/Login.jsx              → src/pages/auth/styles/Login.module.css
src/pages/admin/AdminDashboard.jsx    → src/pages/admin/styles/AdminDashboard.module.css
src/pages/kader/KaderDashboard.jsx    → src/pages/kader/styles/KaderDashboard.module.css
```

**Example: Login.module.css**
```css
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--primary-light);
  font-family: var(--font-sans);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid var(--border);
}

@media (max-width: 768px) {
  .container {
    /* Mobile specific */
  }
}
```

---

### **PHASE 4: Split Large Components (3-4 hours)**

**Example: Split AdminDashboard**

```
Before:
src/pages/admin/AdminDashboard.jsx (500+ lines) ❌

After:
src/pages/admin/AdminDashboard.jsx (100 lines - container only)
├── src/pages/admin/UserManagement.jsx (120 lines)
├── src/pages/admin/PosyanduManagement.jsx (100 lines)
├── src/pages/admin/Analytics.jsx (80 lines)
└── src/pages/admin/ActivityLog.jsx (60 lines)
```

**AdminDashboard.jsx (Container)**
```jsx
import { useState } from "react";
import { Sidebar, Header } from "@components/layout";
import UserManagement from "./UserManagement";
import PosyanduManagement from "./PosyanduManagement";
import Analytics from "./Analytics";
import styles from "./styles/AdminDashboard.module.css";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const pages = {
    dashboard: <Analytics />,
    users: <UserManagement />,
    posyandu: <PosyanduManagement />,
  };

  return (
    <div className={styles.container}>
      <Sidebar activePage={activePage} onSelect={setActivePage} />
      <div className={styles.content}>
        <Header />
        {pages[activePage]}
      </div>
    </div>
  );
}
```

---

### **PHASE 5: Create Data Management Layer (2-3 hours)**

**Centralize all data logic:**

```jsx
// src/context/DataContext.jsx
import { createContext, useContext, useReducer, useEffect } from "react";

const DataContext = createContext();

const initialState = {
  users: [],
  children: [],
  posyandus: [],
  loading: false,
  error: null,
};

function dataReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, [action.payload.key]: action.payload.data, loading: false };
    case "ADD_ITEM":
      return {
        ...state,
        [action.payload.key]: [...state[action.payload.key], action.payload.item],
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        [action.payload.key]: state[action.payload.key].map((item) =>
          item.id === action.payload.item.id ? action.payload.item : item
        ),
      };
    case "DELETE_ITEM":
      return {
        ...state,
        [action.payload.key]: state[action.payload.key].filter(
          (item) => item.id !== action.payload.id
        ),
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Load initial data
  useEffect(() => {
    dispatch({ type: "FETCH_START" });
    // In real app, fetch from API
    const mockData = {
      users: [],
      children: [],
      posyandus: [],
    };
    dispatch({
      type: "FETCH_SUCCESS",
      payload: { key: "users", data: mockData.users },
    });
  }, []);

  const value = {
    state,
    addUser: (user) =>
      dispatch({ type: "ADD_ITEM", payload: { key: "users", item: user } }),
    updateUser: (user) =>
      dispatch({ type: "UPDATE_ITEM", payload: { key: "users", item: user } }),
    deleteUser: (id) =>
      dispatch({ type: "DELETE_ITEM", payload: { key: "users", id } }),
    // ... similar for children, posyandus
  };

  return (
    <DataContext.Provider value={value}>{children}</DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
```

---

## Migration Checklist

### ✅ Step 1: Cleanup (2-3 hours)
- [ ] Delete 7 unused files
- [ ] Create new directory structure
- [ ] Create constants.js and variables.css

### ✅ Step 2: Components (4-5 hours)
- [ ] Create Button component
- [ ] Create Input component
- [ ] Create Card component
- [ ] Create LoadingSpinner
- [ ] Create EmptyState
- [ ] Create Toast system
- [ ] Create Table component
- [ ] Create Modal wrapper

### ✅ Step 3: Styles (3-4 hours)
- [ ] Convert Login styles to CSS module
- [ ] Convert AdminDashboard styles
- [ ] Convert KaderDashboard styles
- [ ] Convert OrangtuaDashboard styles
- [ ] Create global styles

### ✅ Step 4: Component Split (3-4 hours)
- [ ] Split AdminDashboard → 4 components
- [ ] Split KaderDashboard → 3 components
- [ ] Split OrangtuaDashboard → 3 components
- [ ] Split Dashboard → 2 components

### ✅ Step 5: Data Management (2-3 hours)
- [ ] Create DataContext with useReducer
- [ ] Create custom hooks (useAuth, useData, etc)
- [ ] Create validation utilities
- [ ] Create formatter utilities

### ✅ Step 6: Testing (1-2 hours)
- [ ] Test all components render correctly
- [ ] Test navigation still works
- [ ] Test responsive design
- [ ] Test on mobile device

### ✅ Step 7: Optimization (1 hour)
- [ ] Add React.memo to heavy components
- [ ] Code splitting for pages
- [ ] Lazy load components

---

## Before & After Code Comparison

### BEFORE (Inline Styles) ❌
```jsx
// AdminDashboard.jsx - 500+ lines, all in one file
export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [children, setChildren] = useState([]);
  // ... 15+ states
  
  return (
    <div style={{
      width: "100vw",
      minHeight: "100vh",
      background: "var(--bg-overlay)",
      fontFamily: "var(--font-sans)",
      display: "flex",
    }}>
      <div style={{
        width: 280,
        background: "linear-gradient(...)",
        // ... 100+ inline styles
      }}>
        {/* Sidebar 200+ lines */}
      </div>
      <div style={{ flex: 1 }}>
        {/* Table 200+ lines */}
        {/* Modal 100+ lines */}
      </div>
    </div>
  );
}
```

### AFTER (Modular) ✅
```jsx
// AdminDashboard.jsx - 100 lines, clear structure
import { useState } from "react";
import { Sidebar } from "@components/layout";
import { Header } from "@components/layout";
import UserManagement from "./UserManagement";
import Analytics from "./Analytics";
import styles from "./styles/AdminDashboard.module.css";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const pages = {
    dashboard: <Analytics />,
    users: <UserManagement />,
  };

  return (
    <div className={styles.container}>
      <Sidebar activePage={activePage} onSelect={setActivePage} />
      <main className={styles.main}>
        <Header />
        <div className={styles.content}>{pages[activePage]}</div>
      </main>
    </div>
  );
}
```

---

## Time & Complexity Estimate

| Phase | Tasks | Hours | Complexity |
|-------|-------|-------|-----------|
| Phase 1 | Cleanup + structure | 2-3 | Easy |
| Phase 2 | Shared components | 4-5 | Medium |
| Phase 3 | Extract styles | 3-4 | Easy |
| Phase 4 | Split components | 3-4 | Medium |
| Phase 5 | Data management | 2-3 | Hard |
| Phase 6 | Testing | 1-2 | Medium |
| **Total** | | **16-21 hours** | **Medium** |

**Timeline:** 3-4 days (4 hours/day) or 2 days (8 hours/day)

---

**Next:** After structure is set up, move to:
1. Form validation improvements
2. Mobile responsiveness fixes
3. Loading states & notifications
4. Accessibility enhancements

---

*Last Updated: May 21, 2026*
*Prepared for POSCO Web Project*
