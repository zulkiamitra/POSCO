import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import { AuthProvider } from "./context/AuthContext"
import { NotificationProvider } from "./context/NotificationContext"
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

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === "admin" ? "/admin" : user.role === "kader" ? "/kader" : user.role === "orangtua" ? "/orangtua" : "/dashboard"} replace /> : <Login />} 
        />
        <Route 
          path="/admin.login" 
          element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/"} replace /> : <AdminLogin />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to={user.role === "admin" ? "/admin" : user.role === "kader" ? "/kader" : user.role === "orangtua" ? "/orangtua" : "/dashboard"} replace /> : <Register />} 
        />
        <Route 
          path="/forgot-password" 
          element={user ? <Navigate to={user.role === "admin" ? "/admin" : user.role === "kader" ? "/kader" : user.role === "orangtua" ? "/orangtua" : "/dashboard"} replace /> : <ForgotPassword />} 
        />

        {/* Home redirects based on user role */}
        <Route 
          path="/" 
          element={user ? <Navigate to={user.role === "admin" ? "/admin" : user.role === "kader" ? "/kader" : user.role === "orangtua" ? "/orangtua" : "/dashboard"} replace /> : <Home />} 
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

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App