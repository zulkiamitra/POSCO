# 🚀 QUICK FIXES CHECKLIST - PHASE 1

## Critical Issues yang Harus Diperbaiki ASAP (1-2 Hari)

### ✅ Task 1: Clean Up Duplicate Files
```bash
❌ DELETE: src/pages/Authcontext.jsx (use AuthContext.jsx from context folder)
❌ DELETE: src/pages/Dasboard.jsx (TYPO, gunakan Dashboard.jsx)
❌ DELETE: src/pages/Dummydata.js (duplicate, gunakan dummyData.js dari data folder)
❌ DELETE: src/pages/AdminPages.jsx (unused)
❌ DELETE: src/pages/KaderPages.jsx (unused)
❌ DELETE: src/pages/Layout.jsx (unused)
```

### ✅ Task 2: Fix Form Validation - Register.jsx
```javascript
// ADD validation untuk:
1. Email format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
2. NIK: harus 16 digits
3. Phone: harus 10-13 digits, format +62 atau 08...
4. Password: min 8 char, should include uppercase, number, special char
5. Duplicate email check: check existing emails

EXAMPLE:
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateNIK = (nik) => /^\d{16}$/.test(nik);
const validatePhone = (phone) => /^(\+62|0)[0-9]{9,12}$/.test(phone);
```

### ✅ Task 3: Add Loading States & Toast Notifications

**Current Problem:**
- Modal save tapi tidak ada loading feedback
- Delete tapi tidak ada loading feedback
- User tidak tahu action berhasil atau gagal

**Solution:**
```javascript
// components/Toast.jsx - Create reusable toast
// Gunakan di AdminDashboard untuk:
- handleSaveClick() → show "Saved!" toast
- handleDeleteClick() → show "Deleted!" toast
- handleFormChange() → show validation messages

// components/LoadingSpinner.jsx
- Add di AdminDashboard modal save button
- Add di table data fetch simulation
```

### ✅ Task 4: Add Security - AuthContext.jsx

**CHANGE:**
```javascript
// ❌ CURRENT (INSECURE):
localStorage.setItem("user", JSON.stringify(userData));

// ✅ BETTER (SHORT TERM):
// 1. Jangan simpan password di localStorage
// 2. Store hanya: { id, name, role, wilayah }
// 3. Add session timeout (30 menit)

// Temporary auth (until backend ready):
const userData = {
  id: credentials.id,
  name: credentials.name,
  role: credentials.role,
  wilayah: credentials.wilayah,
  // ❌ REMOVE: email, password
};

// Add session timeout:
useEffect(() => {
  const timeout = setTimeout(() => {
    logout();
    console.warn("Session expired");
  }, 30 * 60 * 1000); // 30 minutes
  
  return () => clearTimeout(timeout);
}, []);
```

### ✅ Task 5: Fix Responsive Design

**Mobile Issues:**
```css
/* AdminDashboard sidebar */
@media (max-width: 768px) {
  sidebar { display: none; }
  main_content { width: 100%; }
}

/* Modal responsive */
@media (max-width: 640px) {
  modal { 
    width: 95vw;
    max-height: 90vh;
    overflow-y: auto;
  }
}

/* Table responsive */
@media (max-width: 768px) {
  table { display: block; }
  thead { display: none; }
  tr { display: block; margin-bottom: 1rem; }
  td { 
    display: block;
    text-align: right;
    padding: 0.5rem;
  }
  td:before { 
    content: attr(data-label);
    float: left;
    font-weight: bold;
  }
}
```

### ✅ Task 6: Fix AdminDashboard Modal Form

**Current Issue:** ModalForm tidak fully implemented
```jsx
// modal/ModalForm.jsx - lengkapi implementasi:
// 1. Render fields berdasarkan modalType:
//    - "user" → name, email, role, status, wilayah
//    - "posyandu" → name, kecamatan, kelurahan, status
//    - "child" → name, mother, age, weight, height, status

// 2. Add input validation
// 3. Add error messages
// 4. Add loading state pada submit button

// Example:
const fieldsByType = {
  user: [
    { name: "name", label: "Nama", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "role", label: "Role", type: "select", options: ["admin", "kader", "orangtua"] },
    // ...
  ],
  posyandu: [ /* fields */ ],
  child: [ /* fields */ ]
};
```

### ✅ Task 7: Add Empty States

```jsx
// Ketika data kosong, tampilkan:
children.length === 0 ? (
  <EmptyState 
    icon="📭"
    title="Tidak ada data anak"
    description="Belum ada data anak yang terdaftar"
  />
) : (
  // render table
)
```

### ✅ Task 8: Add Search Result Count

```jsx
// Tambahkan di AdminDashboard setelah filter:
<p style={{ color: "#6B7280", fontSize: 14 }}>
  Menampilkan {filteredChildren.length} dari {children.length} data
</p>

// Atau kalau kosong:
{filteredChildren.length === 0 && (
  <p style={{ color: "#DC2626" }}>Tidak ada hasil pencarian</p>
)}
```

---

## 🎯 PHASE 2: UX Improvements (2-3 Hari)

### ✅ Create Shared Components Library

```
src/components/
├── shared/
│   ├── Button.jsx        // Reusable button semua variant
│   ├── Card.jsx          // Card wrapper
│   ├── Modal.jsx         // Modal wrapper
│   ├── Table.jsx         // Table component dengan sorting
│   ├── EmptyState.jsx    // Empty state component
│   ├── LoadingSpinner.jsx // Loading animation
│   ├── Toast.jsx         // Toast notification
│   └── Badge.jsx         // Status badge
├── layout/
│   ├── Sidebar.jsx       // Extract dari AdminDashboard
│   ├── Header.jsx        // Extract dari Dashboard
│   └── Footer.jsx        // Kalau perlu
└── (existing components)
```

### ✅ Extract Inline Styles to CSS Modules

```
src/styles/
├── AdminDashboard.module.css
├── KaderDashboard.module.css
├── OrangtuaDashboard.module.css
├── shared.module.css     // Shared styles
└── variables.css         // Color, spacing variables

// variables.css:
:root {
  --primary: #16A34A;
  --primary-dark: #15803D;
  --error: #DC2626;
  --text-primary: #111827;
  --spacing-md: 16px;
  /* ... */
}
```

### ✅ Add Sorting & Filtering to Tables

```jsx
// Table component enhancement:
// 1. Sortable columns (click header to sort)
// 2. Filter dropdown
// 3. Search input
// 4. Pagination
// 5. Result count

<Table 
  data={children}
  columns={[
    { key: "name", label: "Nama", sortable: true },
    { key: "status", label: "Status", sortable: false }
  ]}
  onSort={handleSort}
  onFilter={handleFilter}
/>
```

### ✅ Implement Pagination

```jsx
// Use pagination pada AdminDashboard:
const itemsPerPage = 10;
const totalPages = Math.ceil(filteredChildren.length / itemsPerPage);
const startIdx = (currentPage - 1) * itemsPerPage;
const displayedChildren = filteredChildren.slice(startIdx, startIdx + itemsPerPage);

// Render pagination buttons: < 1 2 3 > 
```

### ✅ Add Accessibility (A11y)

```jsx
// Things to add:
1. <label> untuk setiap input dengan htmlFor
2. aria-label pada icon buttons
3. aria-live untuk loading/success messages
4. tabindex untuk keyboard navigation
5. focus states untuk keyboard users
6. alt text untuk semua images
7. Semantic HTML: <button> bukan <div onClick>

Example:
<button 
  onClick={handleSave}
  aria-label="Simpan perubahan"
  title="Simpan"
>
  Save
</button>
```

---

## 🔐 SECURITY Fixes (Sebelum Production)

### ✅ Implement Proper Authentication

```javascript
// AuthContext.jsx - Persiapkan untuk JWT:
const login = async (role, email, password) => {
  // Backend call:
  // POST /api/auth/login { role, email, password }
  // Response: { token, user: { id, name, role, wilayah } }
  
  const response = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ role, email, password })
  });
  
  const { token, user } = await response.json();
  
  // Store token (httpOnly cookie preferred, tapi frontend bisa:
  localStorage.setItem("authToken", token);
  setUser(user);
};

// Add token to requests:
fetch(url, {
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
  }
});
```

### ✅ Remove Hardcoded Credentials

```javascript
// ❌ DELETE dari dummyData.js:
// email: "admin@posco.id", password: "admin123"

// Ganti dengan demo-only credentials yang jelas:
// admin@demo.local / demo123
// kader@demo.local / demo123
// Add warning banner: "DEMO MODE - This is test data"
```

### ✅ Add Password Requirements

```javascript
// validation/passwordValidator.js
export const validatePassword = (password) => {
  const has = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
    minLength: password.length >= 12
  };
  
  return {
    isValid: Object.values(has).every(v => v),
    requirements: has
  };
};

// UI feedback:
Password must contain:
✅/❌ Uppercase letter
✅/❌ Number
✅/❌ Special character (!@#$%^&*)
✅/❌ At least 12 characters
```

---

## 📋 Implementation Checklist

```
PRIORITY 1 (TODAY - 2 hours):
[ ] Remove duplicate files
[ ] Fix form validation (email, NIK, phone)
[ ] Add loading spinner + toast component
[ ] Add session timeout (30 min)
[ ] Fix 3 critical responsive issues

PRIORITY 2 (THIS WEEK - 2-3 days):
[ ] Create shared components library
[ ] Extract inline styles to CSS
[ ] Add empty state UI
[ ] Add search result count
[ ] Add accessibility basics (labels, alt text)

PRIORITY 3 (NEXT WEEK):
[ ] Implement sorting & filtering
[ ] Add pagination
[ ] Add bulk actions
[ ] Add notification system
[ ] Security improvements

BEFORE PRODUCTION:
[ ] Complete security audit
[ ] Add testing suite (Jest + React Testing Library)
[ ] Performance optimization
[ ] Full accessibility audit
[ ] User testing
```

---

**Estimated Timeline:**
- Priority 1: ~2 hours
- Priority 2: ~2-3 days
- Priority 3: ~3-5 days
- Before Production: ~5-7 days

**Total: ~2-3 weeks to production-ready**

---

*Last Updated: May 21, 2026*
*Next Review: After Phase 1 completion*
