import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Login from "./pages/Login"
import AdminLogin from "./pages/AdminLogin"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import Dashboard from "./pages/Dashboard"
import OrangtuaDashboard from "./pages/OrangtuaDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import KaderDashboard from "./pages/KaderDashboard"
import VerifikatorDashboard from "./pages/VerifikatorDashboard"

function App() {
  const { user } = useAuth();

  const getRedirectPath = (role) => {
    switch (role) {
      case "admin": return "/admin";
      case "kader": return "/kader";
      case "orangtua": return "/orangtua";
      case "verifikator": return "/verifikator";
      default: return "/dashboard";
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to={getRedirectPath(user.role)} replace /> : <Login />} 
        />
        <Route 
          path="/admin-login" 
          element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/"} replace /> : <AdminLogin />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to={getRedirectPath(user.role)} replace /> : <Register />} 
        />
        <Route 
          path="/forgot-password" 
          element={user ? <Navigate to={getRedirectPath(user.role)} replace /> : <ForgotPassword />} 
        />

        {/* Home redirects based on user role */}
        <Route 
          path="/" 
          element={user ? <Navigate to={getRedirectPath(user.role)} replace /> : <Home />} 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/kader" 
          element={
            <ProtectedRoute requiredRoles={["kader"]}>
              <KaderDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/orangtua" 
          element={
            <ProtectedRoute requiredRoles={["orangtua"]}>
              <OrangtuaDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/verifikator" 
          element={
            <ProtectedRoute requiredRoles={["verifikator"]}>
              <VerifikatorDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App