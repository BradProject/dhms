



import React, { useState } from 'react'
import { Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Hubs from './features/hubs/Hubs'
import Logs from './features/hubs/Logs'
import Funding from './features/funding/Funding'
import Reports from './features/reports/Reports'
import Community from './features/community/Community'
import Login from './features/users/Login'
import Register from './features/users/Register'
import { AuthProvider, useAuth } from './context/AuthContext'
import "./navbar.css"
import logo from "/assets/kenya.jpg"
import HubExplorerPage from "./pages/HubExplorerForm"
import AdminFeedback from "./pages/AdminFeedback"
import AdminNews from "./pages/AdminNews" 
import ResetPasswordDirect from "./pages/ResetPasswordDirect";

 


// ==========================
// ROUTE PROTECTION
// ==========================
function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/dashboard" replace />
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  return user?.role === "admin" ? children : <Navigate to="/dashboard" replace />
}

// ==========================
// NAVIGATION COMPONENT
// ==========================
function Navigation({ onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  let menu = []

  if (user?.role === "admin" || user?.role === "analyst") {
    menu = [
      { to: "/hubs", label: "HUBS" },
      { to: "/logs", label: "LOGS" },
      { to: "/funding", label: "FUNDING" },
      { to: "/reports", label: "REPORTS" },
       { to: "/admin/news", label: "ADD NEWS" },  
      { to: "/admin/feedback", label: "FEEDBACK" }, 
      { to: "/register", label: "REGISTER USERS" },
      {
        to: "/",
        label: "LOGOUT",
        onClick: () => {
          logout()
          navigate("/dashboard", { replace: true })
        }
      }
    ]
  } else if (user?.role === "manager") {
    menu = [
      { to: "/hubs", label: "Hubs" },
      {
        to: "/",
        label: "Logout",
        onClick: () => {
          logout()
          navigate("/dashboard", { replace: true })
        }
      }
    ]
  }

  const visibleMenu = location.pathname !== "/dashboard" ? menu : []

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="Kenya Logo" className="logo" />
        <div className="logo-text">
          <span className="gov-title">Republic of Kenya</span>
          <span className="ministry">
            The Ministry of Information, Communications and the Digital Economy (MICDE)
          </span>
        </div>
      </div>

      <button
        className="hamburger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        <span className={`bar ${isOpen ? 'open' : ''}`}></span>
        <span className={`bar ${isOpen ? 'open' : ''}`}></span>
        <span className={`bar ${isOpen ? 'open' : ''}`}></span>
      </button>

      <div className={`nav-links ${isOpen ? 'active' : ''}`}>
        {visibleMenu.map(({ to, label, onClick }) => (
          <Link
            key={to}
            to={to}
            className="nav-link"
            onClick={() => {
              if (onClick) onClick()
              setIsOpen(false)
            }}
          >
            {label}
          </Link>
        ))}

        {location.pathname === "/dashboard" && (
          <button
            className="nav-link admin-btn"
            onClick={() => {
              onLoginClick(true)
              setIsOpen(false)
            }}
          >
            Admin Login
          </button>
        )}
      </div>
    </nav>
  )
}

// ==========================
// LAYOUT & MODAL
// ==========================
function Layout({ children }) {
  const location = useLocation()
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register"
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      {!hideNavbar && <Navigation onLoginClick={setShowLogin} />}
      {children}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}

function LoginModal({ onClose }) {
  const navigate = useNavigate()
  const handleClose = () => {
    onClose()
    navigate("/dashboard", { replace: true })
  }

  return (
    <div className="login-modal-overlay" onClick={handleClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="login-modal-close"
          onClick={handleClose}
          aria-label="Close login"
        >
          &times;
        </button>
        <Login onClose={onClose} />
      </div>
    </div>
  )
}

// ==========================
// MAIN APP COMPONENT
// ==========================
export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hubs" element={<PrivateRoute><Hubs /></PrivateRoute>} />
          <Route path="/logs" element={<PrivateRoute><Logs /></PrivateRoute>} />
          <Route path="/funding" element={<PrivateRoute><Funding /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
          <Route path="/hub-explorer" element={<PrivateRoute><HubExplorerPage /></PrivateRoute>} />
      <Route path="/reset-password-direct" element={<ResetPasswordDirect />} />
        
          <Route
            path="/admin/feedback"
            element={
              <AdminRoute>
                <AdminFeedback />
              </AdminRoute>
            }
          />
          {/* 🆕 Admin News Route */}
          <Route
            path="/admin/news"
            element={
              <AdminRoute>
                <AdminNews />
              </AdminRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AdminRoute>
                <Register />
              </AdminRoute>
            }
          />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}
