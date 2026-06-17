# 📚 POSCO Web App - Developer Quick Reference Guide

## 🔔 Notification System

### Basic Usage

```javascript
import { useNotification } from "../context/NotificationContext";

export default function MyComponent() {
  const { success, error, warning, info } = useNotification();

  const handleSave = () => {
    try {
      // Do something...
      success("✓ Data saved successfully!");
    } catch (err) {
      error("⚠️ Failed to save data");
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### Notification Types

| Type | Usage | Style |
|------|-------|-------|
| `success()` | Operation succeeded | Green background |
| `error()` | Operation failed | Red background |
| `warning()` | Warning/caution | Orange background |
| `info()` | Information only | Blue background |

### Examples

```javascript
// Success notification
success("✓ User registered successfully");

// Error with context
error("⚠️ Email already registered");

// Warning for confirmations
warning("👋 You will be logged out in 5 minutes");

// Info messages
info("ℹ️ This is a read-only field");
```

---

## 📦 Empty State Component

### Basic Usage

```javascript
import EmptyState from "../components/EmptyState";

export default function MyList() {
  const [items, setItems] = useState([]);

  if (items.length === 0) {
    return (
      <EmptyState
        icon="📊"
        title="No Data Available"
        description="Try adjusting your search or filters"
        actionLabel="Reset Filters"
        onAction={() => resetFilters()}
      />
    );
  }

  return <div>{/* render items */}</div>;
}
```

### Props

```javascript
EmptyState.propTypes = {
  icon: PropTypes.string,              // Emoji or icon
  title: PropTypes.string.isRequired,   // Main heading
  description: PropTypes.string,        // Sub-heading
  actionLabel: PropTypes.string,        // Button text
  onAction: PropTypes.func,             // Button click handler
  compact: PropTypes.bool               // Reduced padding
};
```

### Examples

```javascript
// Minimal empty state
<EmptyState
  icon="📋"
  title="No tasks"
/>

// Full-featured with action
<EmptyState
  icon="🔍"
  title="No results found"
  description="Try different keywords or filters"
  actionLabel="Clear Search"
  onAction={() => setSearchQuery("")}
/>

// Compact mode for embedded lists
<EmptyState
  icon="👤"
  title="No children added"
  compact={true}
/>
```

---

## ⏳ Loading Spinner Component

### Basic Usage

```javascript
import LoadingSpinner from "../components/LoadingSpinner";

export default function MyComponent() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <LoadingSpinner />}
      {/* rest of component */}
    </>
  );
}
```

### Props

```javascript
LoadingSpinner.propTypes = {
  inline: PropTypes.bool,     // Full-screen (false) or inline (true)
  message: PropTypes.string   // Optional message text
};
```

### Examples

```javascript
// Full-screen loading overlay
<LoadingSpinner />

// Inline loading with message
<LoadingSpinner inline message="Processing..." />

// Conditional rendering
{isLoading ? (
  <LoadingSpinner inline message="Loading data..." />
) : (
  <DataTable data={data} />
)}
```

---

## 🔐 Authentication & Session Management

### Session Features

```javascript
// Automatic timeout after 30 minutes of inactivity
// Resets on: mousedown, keydown, scroll, touchstart

// To logout programmatically:
import { useAuth } from "../context/AuthContext";

export default function MyComponent() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Session ends, user state cleared
    navigate("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### Getting User Info

```javascript
const { user, login, logout } = useAuth();

if (!user) {
  return <Redirect to="/login" />;
}

// Access user properties
console.log(user.name);    // User's name
console.log(user.role);    // "admin", "kader", "orangtua"
console.log(user.email);   // Email (from local state)
// Password NOT stored in localStorage (secure!)
```

---

## ✅ Form Validation Examples

### Register Form Validation

```javascript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(formData.email)) {
  error("⚠️ Email format invalid");
}

// NIK (Indonesia ID) - 16 digits
const nikRegex = /^\d{16}$/;
if (!nikRegex.test(formData.nik)) {
  error("⚠️ NIK must be 16 digits");
}

// Phone number
const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
if (!phoneRegex.test(formData.phone)) {
  error("⚠️ Phone format: +62xxx or 08xxx");
}

// Password strength
const password = formData.password;
if (password.length < 8) {
  error("⚠️ Password minimum 8 characters");
}
if (!/[A-Z]/.test(password)) {
  error("⚠️ Password needs uppercase letter");
}
if (!/[0-9]/.test(password)) {
  error("⚠️ Password needs a number");
}
```

---

## 📱 Responsive Design

### Using Responsive Utilities

```css
/* Hide on mobile, show on desktop */
@media (max-width: 768px) {
  [data-sidebar] {
    display: none;
  }
}

/* Responsive font sizes */
@media (max-width: 480px) {
  h1 {
    font-size: 1.5rem;
  }
  
  body {
    font-size: 14px;
  }
}

/* Touch-friendly buttons on mobile */
@media (max-width: 768px) {
  button {
    min-height: 44px;
    min-width: 44px;
  }
}
```

### Data Attributes for Styling

```javascript
// Apply responsive styling using data attributes
<div data-sidebar={isMobile ? "hidden" : "visible"}>
  {/* Sidebar content */}
</div>

<table data-table={isMobile ? "scroll" : "normal"}>
  {/* Table content */}
</table>

<div data-modal={isMobile ? "fullscreen" : "centered"}>
  {/* Modal content */}
</div>
```

### Breakpoints Reference

```css
/* Available breakpoints in responsive.css */
480px   /* xs - Extra small phones */
640px   /* sm - Small devices */
768px   /* md - Medium devices (tablets) */
1024px  /* lg - Large devices (desktop) */
```

---

## 🎨 Common UI Patterns

### CRUD with Notifications

```javascript
const handleCreate = async (data) => {
  try {
    setLoading(true);
    const result = await api.create(data);
    setItems([...items, result]);
    success("✓ Item created successfully");
  } catch (err) {
    error("⚠️ Failed to create item");
  } finally {
    setLoading(false);
  }
};

const handleUpdate = async (id, data) => {
  try {
    setLoading(true);
    const result = await api.update(id, data);
    setItems(items.map(i => i.id === id ? result : i));
    success("✓ Item updated successfully");
  } catch (err) {
    error("⚠️ Failed to update item");
  } finally {
    setLoading(false);
  }
};

const handleDelete = async (id) => {
  if (!window.confirm("Delete this item?")) return;
  
  try {
    setLoading(true);
    await api.delete(id);
    setItems(items.filter(i => i.id !== id));
    success("✓ Item deleted successfully");
  } catch (err) {
    error("⚠️ Failed to delete item");
  } finally {
    setLoading(false);
  }
};
```

### Search with Empty State

```javascript
export default function DataList() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { warning } = useNotification();

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredItems.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No results found"
          description={searchQuery ? "Try different keywords" : "No data available"}
          actionLabel={searchQuery ? "Clear Search" : undefined}
          onAction={() => setSearchQuery("")}
        />
      ) : (
        <div>
          <p>{filteredItems.length} results</p>
          {/* render items */}
        </div>
      )}
    </div>
  );
}
```

---

## 🔍 Common Issues & Solutions

### Toast Not Showing?
**Problem:** Notification toast doesn't appear
**Solution:** Make sure NotificationProvider wraps your component tree in `main.jsx`

```javascript
// ✅ Correct (in main.jsx)
ReactDOM.render(
  <AuthProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </AuthProvider>,
  document.getElementById('root')
);
```

### Empty State Always Shows?
**Problem:** Empty state shows even with data
**Solution:** Check your filter/search logic
```javascript
// ❌ Wrong
if (!items) return <EmptyState />;

// ✅ Correct
if (items.length === 0) return <EmptyState />;
```

### Session Timeout Not Working?
**Problem:** Session doesn't timeout after inactivity
**Solution:** Check that user is logged in and component mounted
```javascript
// Add logging to debug
useEffect(() => {
  if (!user) {
    console.log("Not logged in, timeout not active");
    return;
  }
  console.log("Session timeout active");
}, [user]);
```

### Mobile Not Responsive?
**Problem:** App doesn't respond to viewport changes
**Solution:** Ensure responsive.css is imported
```javascript
// In src/index.css
@import "./styles/responsive.css";
```

---

## 📊 Performance Tips

### 1. Memoize Expensive Operations
```javascript
import { useMemo } from "react";

const MyComponent = () => {
  const filteredItems = useMemo(() => {
    return items.filter(/* expensive operation */);
  }, [items]);
};
```

### 2. Debounce Search
```javascript
import { useState, useEffect } from "react";

const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const handleSearch = debounce((query) => {
  setSearchQuery(query);
}, 300);
```

### 3. Lazy Load Lists
```javascript
const [displayItems, setDisplayItems] = useState([]);
const itemsPerPage = 20;

const handleLoadMore = () => {
  setDisplayItems(prev => [
    ...prev,
    ...items.slice(prev.length, prev.length + itemsPerPage)
  ]);
};
```

---

## 🧪 Testing Checklist

When adding new features, verify:
- [ ] Notification shows on success
- [ ] Notification shows on error
- [ ] Empty state displays when needed
- [ ] Loading spinner appears during async
- [ ] Mobile layout is responsive
- [ ] Form validation works
- [ ] No console errors
- [ ] Session timeout works
- [ ] Navigation works after actions
- [ ] Data persists correctly

---

## 📖 File Reference

| File | Purpose | When to Use |
|------|---------|------------|
| `AuthContext.jsx` | User auth + session | Protected pages |
| `NotificationContext.jsx` | Toast messages | User feedback |
| `LoadingSpinner.jsx` | Loading indicator | Async operations |
| `EmptyState.jsx` | No data UI | Empty lists |
| `responsive.css` | Mobile styles | All pages |

---

## 🎯 Quick Start Template

```javascript
import React, { useState } from "react";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

export default function MyNewPage() {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleSave = async (newItem) => {
    try {
      setLoading(true);
      // API call here
      setData([...data, newItem]);
      success("✓ Saved successfully");
    } catch (err) {
      error("⚠️ Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner inline message="Loading..." />;
  }

  if (data.length === 0) {
    return <EmptyState icon="📝" title="No data yet" />;
  }

  return (
    <div>
      {/* Your component here */}
    </div>
  );
}
```

---

**Last Updated:** 2024  
**Framework:** React 19.2.5 + Vite 8  
**For Issues:** Check IMPLEMENTATION_COMPLETE_REPORT.md  
