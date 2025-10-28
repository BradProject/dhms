

// import React from 'react'
// import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
// import Dashboard from './pages/Dashboard'
// import Hubs from './features/hubs/Hubs'
// import Funding from './features/funding/Funding'
// import Reports from './features/reports/Reports'
// import Community from './features/community/Community'
// import Login from './features/users/Login'
// import Register from './features/users/Register'
// import { AuthProvider, useAuth } from './context/AuthContext'
// import "./navbar.css"; 
// import logo from "/assets/logo.png"; 

// function PrivateRoute({ children }) {
//   const { user } = useAuth()
//   return user ? children : <Navigate to="/login" replace />
// }

// // ✅ Modern Navigation
// function Navigation() {
//   return (
//     <nav className="navbar">
//       <div className="nav-left">
//         <img src="/assets/logo.png" alt="Digital Hubs Logo" className="logo" /> 
//         <span className="brand">Kenya Digital Hubs</span>
//       </div>
//       <div className="nav-links">
//         {[
//           { to: "/dashboard", label: "Dashboard" },
//           { to: "/hubs", label: "Hubs" },
//           { to: "/funding", label: "Funding" },
//           { to: "/reports", label: "Reports" },
//           { to: "/community", label: "Community" },
//           { to: "/", label: "Logout" }
//         ].map(({ to, label }) => (
//           <Link key={to} to={to} className="nav-link">
//             {label}
//           </Link>
//         ))}
//       </div>
//     </nav>
//   );
// }

// function Layout({ children }) {
//   const { user } = useAuth()
//   const location = useLocation()

//   const hideNavbar = 
//     location.pathname === "/" || 
//     location.pathname === "/login" || 
//     location.pathname === "/register"

//   return (
//     <>
//       {user && !hideNavbar && <Navigation />}
//       {children}
//     </>
//   )
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <Layout>
//         <Routes>
//           <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
//           <Route path="/hubs" element={<PrivateRoute><Hubs/></PrivateRoute>} />
//           <Route path="/funding" element={<PrivateRoute><Funding/></PrivateRoute>} />
//           <Route path="/reports" element={<PrivateRoute><Reports/></PrivateRoute>} />
//           <Route path="/community" element={<PrivateRoute><Community/></PrivateRoute>} />
//           <Route path="/" element={<Login/>} />
//           <Route path="/login" element={<Login/>} />
//           <Route path="/register" element={<Register/>} />
//         </Routes>
//       </Layout>
//     </AuthProvider>
//   )
// }


// // App.jsx
// import React, { useState } from 'react'
// import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
// import Dashboard from './pages/Dashboard'
// import Hubs from './features/hubs/Hubs'
// import Funding from './features/funding/Funding'
// import Reports from './features/reports/Reports'
// import Community from './features/community/Community'
// import Login from './features/users/Login'
// import Register from './features/users/Register'
// import { AuthProvider, useAuth } from './context/AuthContext'
// import "./navbar.css"; 
// import logo from "/assets/logo.png"; 

// function PrivateRoute({ children }) {
//   const { user } = useAuth()
//   return user ? children : <Navigate to="/login" replace />
// }

// // ✅ Modern Navigation with Hamburger Menu
// function Navigation() {
//   const [isOpen, setIsOpen] = useState(false)

//   const menuItems = [
//     { to: "/dashboard", label: "Dashboard" },
//     { to: "/hubs", label: "Hubs" },
//     { to: "/funding", label: "Funding" },
//     { to: "/reports", label: "Reports" },
//     { to: "/community", label: "Community" },
//     { to: "/", label: "Logout" }
//   ]

//   return (
//     <nav className="navbar">
//       {/* Left side */}
//       <div className="nav-left">
//         <img src={logo} alt="Digital Hubs Logo" className="logo" /> 
//         <span className="brand">Kenya Digital Hubs</span>
//       </div>

//       {/* Hamburger button (mobile only) */}
//       <button 
//         className="hamburger" 
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label="Toggle navigation"
//       >
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//       </button>

//       {/* Links */}
//       <div className={`nav-links ${isOpen ? 'active' : ''}`}>
//         {menuItems.map(({ to, label }) => (
//           <Link 
//             key={to} 
//             to={to} 
//             className="nav-link"
//             onClick={() => setIsOpen(false)} // close menu on click
//           >
//             {label}
//           </Link>
//         ))}
//       </div>
//     </nav>
//   )
// }

// function Layout({ children }) {
//   const { user } = useAuth()
//   const location = useLocation()

//   const hideNavbar = 
//     location.pathname === "/" || 
//     location.pathname === "/login" || 
//     location.pathname === "/register"

//   return (
//     <>
//       {user && !hideNavbar && <Navigation />}
//       {children}
//     </>
//   )
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <Layout>
//         <Routes>
//           <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
//           <Route path="/hubs" element={<PrivateRoute><Hubs/></PrivateRoute>} />
//           <Route path="/funding" element={<PrivateRoute><Funding/></PrivateRoute>} />
//           <Route path="/reports" element={<PrivateRoute><Reports/></PrivateRoute>} />
//           <Route path="/community" element={<PrivateRoute><Community/></PrivateRoute>} />
//           <Route path="/" element={<Login/>} />
//           <Route path="/login" element={<Login/>} />
//           <Route path="/register" element={<Register/>} />
//         </Routes>
//       </Layout>
//     </AuthProvider>
//   )
// }







// // App.jsx
// import React, { useState } from 'react'
// import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
// import Dashboard from './pages/Dashboard'
// import Hubs from './features/hubs/Hubs'
// import Funding from './features/funding/Funding'
// import Reports from './features/reports/Reports'
// import Community from './features/community/Community'
// import Login from './features/users/Login'
// import Register from './features/users/Register'
// // import Tracker from './features/tracker/Tracker'  
// import { AuthProvider, useAuth } from './context/AuthContext'
// import "./navbar.css"; 
// import logo from "/assets/logo.png"; 

// function PrivateRoute({ children }) {
//   const { user } = useAuth()
//   return user ? children : <Navigate to="/login" replace />
// }


// function Navigation() {
//   const [isOpen, setIsOpen] = useState(false)

//   const menuItems = [
//     { to: "/dashboard", label: "Dashboard" },
//     { to: "/hubs", label: "Hubs" },
//     { to: "/funding", label: "Funding" },
//     { to: "/reports", label: "Reports" },
//     { to: "/community", label: "Community" },
//     // { to: "/tracker", label: "Tracker" },  
//     { to: "/", label: "Logout" }
//   ]

//   return (
//     <nav className="navbar">
//       {/* Left side */}
//       <div className="nav-left">
//         <img src={logo} alt="Digital Hubs Logo" className="logo" /> 
//         <span className="brand">Kenya Digital Hubs</span>
//       </div>

//       {/* Hamburger button (mobile only) */}
//       <button 
//         className="hamburger" 
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label="Toggle navigation"
//       >
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//       </button>

//       {/* Links */}
//       <div className={`nav-links ${isOpen ? 'active' : ''}`}>
//         {menuItems.map(({ to, label }) => (
//           <Link 
//             key={to} 
//             to={to} 
//             className="nav-link"
//             onClick={() => setIsOpen(false)} // close menu on click
//           >
//             {label}
//           </Link>
//         ))}
//       </div>
//     </nav>
//   )
// }

// function Layout({ children }) {
//   const { user } = useAuth()
//   const location = useLocation()

//   const hideNavbar = 
//     location.pathname === "/" || 
//     location.pathname === "/login" || 
//     location.pathname === "/register"

//   return (
//     <>
//       {user && !hideNavbar && <Navigation />}
//       {children}
//     </>
//   )
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <Layout>
//         <Routes>
//           <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
//           <Route path="/hubs" element={<PrivateRoute><Hubs/></PrivateRoute>} />
//           <Route path="/funding" element={<PrivateRoute><Funding/></PrivateRoute>} />
//           <Route path="/reports" element={<PrivateRoute><Reports/></PrivateRoute>} />
//           <Route path="/community" element={<PrivateRoute><Community/></PrivateRoute>} />
//           {/* <Route path="/tracker" element={<PrivateRoute><Tracker/></PrivateRoute>} />  */}
//           <Route path="/" element={<Login/>} />
//           <Route path="/login" element={<Login/>} />
//           <Route path="/register" element={<Register/>} />
          
//         </Routes>
//       </Layout>
//     </AuthProvider>
//   )
// }


// // App.jsx
// import React, { useState } from 'react'
// import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
// import Dashboard from './pages/Dashboard'
// import Hubs from './features/hubs/Hubs'
// import Funding from './features/funding/Funding'
// import Reports from './features/reports/Reports'
// import Community from './features/community/Community'
// import Login from './features/users/Login'
// import Register from './features/users/Register'
// // import Tracker from './features/tracker/Tracker'  
// import { AuthProvider, useAuth } from './context/AuthContext'
// import "./navbar.css"; 
// import logo from "/assets/logo.png"; 

// function PrivateRoute({ children }) {
//   const { user } = useAuth()
//   return user ? children : <Navigate to="/login" replace />
// }

// function Navigation() {
//   const [isOpen, setIsOpen] = useState(false)
//   const { user, logout } = useAuth()
//   const location = useLocation()

//   // Base menu
//   const menuItems = [
//     { to: "/dashboard", label: "Dashboard" },
//     { to: "/hubs", label: "Hubs" },
//     { to: "/funding", label: "Funding" },
//     { to: "/reports", label: "Reports" },
//     { to: "/community", label: "Community" },
//     { to: "/", label: "Logout", onClick: logout }
//   ]

//   // If on dashboard page → only show dashboard
//   const visibleMenu = location.pathname === "/dashboard"
//     ? menuItems.filter(item => item.to === "/dashboard")
//     : menuItems

//   return (
//     <nav className="navbar">
//       {/* Left side */}
//       <div className="nav-left">
//         <img src={logo} alt="Digital Hubs Logo" className="logo" /> 
//         <span className="brand">Kenya Digital Hubs</span>
//       </div>

//       {/* Hamburger button (mobile only) */}
//       <button 
//         className="hamburger" 
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label="Toggle navigation"
//       >
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//       </button>

//       {/* Links */}
//       <div className={`nav-links ${isOpen ? 'active' : ''}`}>
//         {visibleMenu.map(({ to, label, onClick }) => (
//           <Link 
//             key={to} 
//             to={to} 
//             className="nav-link"
//             onClick={() => {
//               if (onClick) onClick()
//               setIsOpen(false)
//             }}
//           >
//             {label}
//           </Link>
//         ))}

//         {/* 👑 Admin Login Button (always visible) */}
//         <Link 
//           to="/login" 
//           className="nav-link admin-btn"
//           onClick={() => setIsOpen(false)}
//         >
//           Admin Login
//         </Link>
//       </div>
//     </nav>
//   )
// }

// function Layout({ children }) {
//   const { user } = useAuth()
//   const location = useLocation()

//   const hideNavbar = 
//     location.pathname === "/login" || 
//     location.pathname === "/register"

//   return (
//     <>
//       {user && !hideNavbar && <Navigation />}
//       {children}
//     </>
//   )
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <Layout>
//         <Routes>
//           {/* Default route now redirects to Dashboard */}
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />

//           <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
//           <Route path="/hubs" element={<PrivateRoute><Hubs/></PrivateRoute>} />
//           <Route path="/funding" element={<PrivateRoute><Funding/></PrivateRoute>} />
//           <Route path="/reports" element={<PrivateRoute><Reports/></PrivateRoute>} />
//           <Route path="/community" element={<PrivateRoute><Community/></PrivateRoute>} />
//           {/* <Route path="/tracker" element={<PrivateRoute><Tracker/></PrivateRoute>} />  */}

//           <Route path="/login" element={<Login/>} />
//           <Route path="/register" element={<Register/>} />
//         </Routes>
//       </Layout>
//     </AuthProvider>
//   )
// }



// // App.jsx
// import React, { useState } from 'react'
// import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
// import Dashboard from './pages/Dashboard'
// import Hubs from './features/hubs/Hubs'
// import Funding from './features/funding/Funding'
// import Reports from './features/reports/Reports'
// import Community from './features/community/Community'
// import Login from './features/users/Login'
// import Register from './features/users/Register'
// // import Tracker from './features/tracker/Tracker'  
// import { AuthProvider, useAuth } from './context/AuthContext'
// import "./navbar.css"; 
// import logo from "/assets/logo.png"; 

// function PrivateRoute({ children }) {
//   const { user } = useAuth()
//   return user ? children : <Navigate to="/login" replace />
// }

// function Navigation() {
//   const [isOpen, setIsOpen] = useState(false)
//   const { user, logout } = useAuth()
//   const location = useLocation()

//   // Full menu
//   const fullMenu = [
//     { to: "/dashboard", label: "Dashboard" },
//     { to: "/hubs", label: "Hubs" },
//     { to: "/funding", label: "Funding" },
//     { to: "/reports", label: "Reports" },
//     { to: "/community", label: "Community" },
//     { to: "/", label: "Logout", onClick: logout }
//   ]

//   let visibleMenu = []

//   if (location.pathname === "/dashboard") {
//     // On Dashboard → only Dashboard + Admin Login
//     visibleMenu = fullMenu.filter(item => item.to === "/dashboard")
//   } else {
//     // On all other pages → everything except Dashboard + Admin Login
//     visibleMenu = fullMenu.filter(item => item.to !== "/dashboard")
//   }

//   return (
//     <nav className="navbar">
//       {/* Left side */}
//       <div className="nav-left">
//         <img src={logo} alt="Digital Hubs Logo" className="logo" /> 
//         <span className="brand">Kenya Digital Hubs</span>
//       </div>

//       {/* Hamburger button (mobile only) */}
//       <button 
//         className="hamburger" 
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label="Toggle navigation"
//       >
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//       </button>

//       {/* Links */}
//       <div className={`nav-links ${isOpen ? 'active' : ''}`}>
//         {visibleMenu.map(({ to, label, onClick }) => (
//           <Link 
//             key={to} 
//             to={to} 
//             className="nav-link"
//             onClick={() => {
//               if (onClick) onClick()
//               setIsOpen(false)
//             }}
//           >
//             {label}
//           </Link>
//         ))}

//         {/* 👑 Admin Login only visible on Dashboard */}
//         {location.pathname === "/dashboard" && (
//           <Link 
//             to="/login" 
//             className="nav-link admin-btn"
//             onClick={() => setIsOpen(false)}
//           >
//             Admin Login
//           </Link>
//         )}
//       </div>
//     </nav>
//   )
// }

// function Layout({ children }) {
//   const { user } = useAuth()
//   const location = useLocation()

//   const hideNavbar = 
//     location.pathname === "/login" || 
//     location.pathname === "/register"

//   return (
//     <>
//       {user && !hideNavbar && <Navigation />}
//       {children}
//     </>
//   )
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <Layout>
//         <Routes>
//           {/* Default route now redirects to Dashboard */}
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />

//           <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
//           <Route path="/hubs" element={<PrivateRoute><Hubs/></PrivateRoute>} />
//           <Route path="/funding" element={<PrivateRoute><Funding/></PrivateRoute>} />
//           <Route path="/reports" element={<PrivateRoute><Reports/></PrivateRoute>} />
//           <Route path="/community" element={<PrivateRoute><Community/></PrivateRoute>} />
//           {/* <Route path="/tracker" element={<PrivateRoute><Tracker/></PrivateRoute>} />  */}

//           <Route path="/login" element={<Login/>} />
//           <Route path="/register" element={<Register/>} />
//         </Routes>
//       </Layout>
//     </AuthProvider>
//   )
// }


// App.jsx
// import React, { useState } from 'react'
// import { Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom'
// import Dashboard from './pages/Dashboard'
// import Hubs from './features/hubs/Hubs'
// import Funding from './features/funding/Funding'
// import Reports from './features/reports/Reports'
// import Community from './features/community/Community'
// import Login from './features/users/Login'
// import Register from './features/users/Register'
// // import Tracker from './features/tracker/Tracker'  
// import { AuthProvider, useAuth } from './context/AuthContext'
// import "./navbar.css"; 
// import logo from "/assets/kenya.jpg"; 

// // 🔹 Private route wrapper
// function PrivateRoute({ children }) {
//   const { user } = useAuth()
//   return user ? children : <Navigate to="/login" replace />
// }

// function Navigation() {
//   const [isOpen, setIsOpen] = useState(false)
//   const { logout } = useAuth()
//   const location = useLocation()
//   const navigate = useNavigate()

//   const menu = [
//     { to: "/hubs", label: "Hubs" },
//     { to: "/funding", label: "Funding" },
//     { to: "/reports", label: "Reports" },
//     { to: "/community", label: "Community" },
//     { 
//       to: "/", 
//       label: "Logout", 
//       onClick: () => {
//         logout()
//         navigate("/dashboard", { replace: true })
//       }
//     }
//   ]

//   let visibleMenu = []
//   if (location.pathname !== "/dashboard") {
//     visibleMenu = menu
//   }

//   return (
//     <nav className="navbar">
//       <div className="nav-left">
//         <img src={logo} alt="Kenya Logo" className="logo" />
//         <div className="logo-text">
//           <span className="gov-title">Republic of Kenya</span>
//           <span className="ministry">
//             The Ministry of Information, Communications and the Digital Economy (MICDE)
//           </span>
//         </div>
//       </div>

//       {/* Hamburger */}
//       <button 
//         className="hamburger" 
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label="Toggle navigation"
//       >
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//       </button>

//       <div className={`nav-links ${isOpen ? 'active' : ''}`}>
//         {visibleMenu.map(({ to, label, onClick }) => (
//           <Link 
//             key={to} 
//             to={to} 
//             className="nav-link"
//             onClick={() => {
//               if (onClick) onClick()
//               setIsOpen(false)
//             }}
//           >
//             {label}
//           </Link>
//         ))}

//         {/* Admin Login only on Dashboard */}
//         {location.pathname === "/dashboard" && (
//           <Link 
//             to="/login" 
//             className="nav-link admin-btn"
//             onClick={() => setIsOpen(false)}
//           >
//             Admin Login
//           </Link>
//         )}
//       </div>
//     </nav>
//   )
// }

// function Layout({ children }) {
//   const location = useLocation()
//   const hideNavbar = 
//     location.pathname === "/login" || 
//     location.pathname === "/register"

//   return (
//     <>
//       {!hideNavbar && <Navigation />}
//       {children}
//     </>
//   )
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />

//           {/* 🔓 Public Dashboard */}
//           <Route path="/dashboard" element={<Dashboard />} />

//           {/* 🔒 Protected */}
//           <Route path="/hubs" element={<PrivateRoute><Hubs/></PrivateRoute>} />
//           <Route path="/funding" element={<PrivateRoute><Funding/></PrivateRoute>} />
//           <Route path="/reports" element={<PrivateRoute><Reports/></PrivateRoute>} />
//           <Route path="/community" element={<PrivateRoute><Community/></PrivateRoute>} />

//           {/* Auth */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//         </Routes>
//       </Layout>
//     </AuthProvider>
//   )
// }



// import React, { useState } from 'react'
// import { Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom'
// import Dashboard from './pages/Dashboard'
// import Hubs from './features/hubs/Hubs'
// import Funding from './features/funding/Funding'
// import Reports from './features/reports/Reports'
// import Community from './features/community/Community'
// import Login from './features/users/Login'
// import Register from './features/users/Register'
// import { AuthProvider, useAuth } from './context/AuthContext'
// import "./navbar.css"; 
// import logo from "/assets/kenya.jpg"; 

// function PrivateRoute({ children }) {
//   const { user } = useAuth()
//   return user ? children : <Navigate to="/dashboard" replace />
// }

// function Navigation({ onLoginClick }) {
//   const [isOpen, setIsOpen] = useState(false)
//   const { logout } = useAuth()
//   const location = useLocation()
//   const navigate = useNavigate()

//   const menu = [
//     { to: "/hubs", label: "Hubs" },
//     { to: "/funding", label: "Funding" },
//     { to: "/reports", label: "Reports" },
//     { to: "/community", label: "Community" },
//     { 
//       to: "/", 
//       label: "Logout", 
//       onClick: () => {
//         logout()
//         navigate("/dashboard", { replace: true })
//       }
//     }
//   ]

//   let visibleMenu = []
//   if (location.pathname !== "/dashboard") {
//     visibleMenu = menu
//   }

//   return (
//     <nav className="navbar">
//       <div className="nav-left">
//         <img src={logo} alt="Kenya Logo" className="logo" />
//         <div className="logo-text">
//           <span className="gov-title">Republic of Kenya</span>
//           <span className="ministry">
//             The Ministry of Information, Communications and the Digital Economy (MICDE)
//           </span>
//         </div>
//       </div>

//       <button 
//         className="hamburger" 
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label="Toggle navigation"
//       >
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//       </button>

//       <div className={`nav-links ${isOpen ? 'active' : ''}`}>
//         {visibleMenu.map(({ to, label, onClick }) => (
//           <Link 
//             key={to} 
//             to={to} 
//             className="nav-link"
//             onClick={() => {
//               if (onClick) onClick()
//               setIsOpen(false)
//             }}
//           >
//             {label}
//           </Link>
//         ))}

//         {location.pathname === "/dashboard" && (
//           <button 
//             className="nav-link admin-btn"
//             onClick={() => {
//               onLoginClick(true)
//               setIsOpen(false)
//             }}
//           >
//             Admin Login
//           </button>
//         )}
//       </div>
//     </nav>
//   )
// }

// function Layout({ children }) {
//   const location = useLocation()
//   const hideNavbar = location.pathname === "/login" || location.pathname === "/register"

//   // Manage modal login state
//   const [showLogin, setShowLogin] = useState(false)

//   return (
//     <>
//       {!hideNavbar && <Navigation onLoginClick={setShowLogin} />}
//       {children}
//       {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
//     </>
//   )
// }

// // Wrap Login in a modal
// function LoginModal({ onClose }) {
//   return (
//     <div className="login-modal-overlay" onClick={onClose}>
//       <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
//         <Login />
//       </div>
//     </div>
//   )
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/hubs" element={<PrivateRoute><Hubs/></PrivateRoute>} />
//           <Route path="/funding" element={<PrivateRoute><Funding/></PrivateRoute>} />
//           <Route path="/reports" element={<PrivateRoute><Reports/></PrivateRoute>} />
//           <Route path="/community" element={<PrivateRoute><Community/></PrivateRoute>} />
//           <Route path="/register" element={<Register />} />
//         </Routes>
//       </Layout>
//     </AuthProvider>
//   )
// }


// import React, { useState } from 'react'
// import { Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom'
// import Dashboard from './pages/Dashboard'
// import Hubs from './features/hubs/Hubs'
// import Funding from './features/funding/Funding'
// import Reports from './features/reports/Reports'
// import Community from './features/community/Community'
// import Login from './features/users/Login'
// import Register from './features/users/Register'
// import { AuthProvider, useAuth } from './context/AuthContext'
// import "./navbar.css"; 
// import logo from "/assets/kenya.jpg"; 
// import HubExplorerPage from "./pages/HubExplorerForm"


// function PrivateRoute({ children }) {
//   const { user } = useAuth()
//   return user ? children : <Navigate to="/dashboard" replace />
// }

// // 🔒 Add AdminRoute just below PrivateRoute
// function AdminRoute({ children }) {
//   const { user } = useAuth()
//   return user?.role === "admin" ? children : <Navigate to="/dashboard" replace />
// }

// function Navigation({ onLoginClick }) {
//   const [isOpen, setIsOpen] = useState(false)
//   const { user, logout } = useAuth()   // <-- include user here
//   const location = useLocation()
//   const navigate = useNavigate()

//   const menu = [
//     { to: "/hubs", label: "Hubs" },
//     // { to: "/hub-explorer", label: "Hub Explorer" }, 
//     { to: "/funding", label: "Funding" },
//     { to: "/reports", label: "Reports" },
//     // { to: "/community", label: "Community" },
    
//     // Only Admins see this
//     ...(user?.role === "admin"
//       ? [{ to: "/register", label: "Register Users" }]
//       : []),
//     { 
//       to: "/", 
//       label: "Logout", 
//       onClick: () => {
//         logout()
//         navigate("/dashboard", { replace: true })
//       }
//     }
//   ]

//   let visibleMenu = []
//   if (location.pathname !== "/dashboard") {
//     visibleMenu = menu
//   }


//   return (
//     <nav className="navbar">
//       <div className="nav-left">
//         <img src={logo} alt="Kenya Logo" className="logo" />
//         <div className="logo-text">
//           <span className="gov-title">Republic of Kenya</span>
//           <span className="ministry">
//             The Ministry of Information, Communications and the Digital Economy (MICDE)
//           </span>
//         </div>
//       </div>

//       <button 
//         className="hamburger" 
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label="Toggle navigation"
//       >
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//       </button>

//       <div className={`nav-links ${isOpen ? 'active' : ''}`}>
//         {visibleMenu.map(({ to, label, onClick }) => (
//           <Link 
//             key={to} 
//             to={to} 
//             className="nav-link"
//             onClick={() => {
//               if (onClick) onClick()
//               setIsOpen(false)
//             }}
//           >
//             {label}
//           </Link>
//         ))}

//         {location.pathname === "/dashboard" && (
//           <button 
//             className="nav-link admin-btn"
//             onClick={() => {
//               onLoginClick(true)
//               setIsOpen(false)
//             }}
//           >
//             Admin Login
//           </button>
//         )}
//       </div>
//     </nav>
//   )
// }

// function Layout({ children }) {
//   const location = useLocation()
//   const hideNavbar = location.pathname === "/login" || location.pathname === "/register"

//   // Manage modal login state
//   const [showLogin, setShowLogin] = useState(false)

//   return (
//     <>
//       {!hideNavbar && <Navigation onLoginClick={setShowLogin} />}
//       {children}
//       {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
//     </>
//   )
// }

// // Wrap Login in a modal with close button
// function LoginModal({ onClose }) {
//   const navigate = useNavigate()

//   const handleClose = () => {
//     onClose()
//     navigate("/dashboard", { replace: true })
//   }

//   return (
//     <div className="login-modal-overlay" onClick={handleClose}>
//       <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
//         <button 
//           className="login-modal-close" 
//           onClick={handleClose} 
//           aria-label="Close login"
//         >
//           &times;
//         </button>
//         <Login onClose={onClose} />
//       </div>
//     </div>
//   )
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/hubs" element={<PrivateRoute><Hubs/></PrivateRoute>} />
//           <Route path="/funding" element={<PrivateRoute><Funding/></PrivateRoute>} />
//           <Route path="/reports" element={<PrivateRoute><Reports/></PrivateRoute>} />
//           <Route path="/community" element={<PrivateRoute><Community/></PrivateRoute>} />
//           <Route path="/hub-explorer"  element={<PrivateRoute><HubExplorerPage/></PrivateRoute>} />

//            <Route 
//             path="/register" 
//             element={
//               <AdminRoute>
//                 <Register />
//               </AdminRoute>
//             } 
//           />
//         </Routes>
//       </Layout>
//     </AuthProvider>
//   )
// }


// import React, { useState } from 'react'
// import { Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom'
// import Dashboard from './pages/Dashboard'
// import Hubs from './features/hubs/Hubs'
// import Funding from './features/funding/Funding'
// import Reports from './features/reports/Reports'
// import Community from './features/community/Community'
// import Login from './features/users/Login'
// import Register from './features/users/Register'
// import { AuthProvider, useAuth } from './context/AuthContext'
// import "./navbar.css"
// import logo from "/assets/kenya.jpg"
// import HubExplorerPage from "./pages/HubExplorerForm"


// // ==========================
// // ROUTE PROTECTION
// // ==========================

// function PrivateRoute({ children }) {
//   const { user } = useAuth()
//   return user ? children : <Navigate to="/dashboard" replace />
// }

// function AdminRoute({ children }) {
//   const { user } = useAuth()
//   return user?.role === "admin" ? children : <Navigate to="/dashboard" replace />
// }

// // ==========================
// // NAVIGATION COMPONENT
// // ==========================

// function Navigation({ onLoginClick }) {
//   const [isOpen, setIsOpen] = useState(false)
//   const { user, logout } = useAuth()
//   const location = useLocation()
//   const navigate = useNavigate()

//   // 🧭 Role-based menu logic
//   let menu = []

//   if (user?.role === "admin" || user?.role === "analyst") {
//     // ✅ Admin and Analyst
//     menu = [
//       { to: "/hubs", label: "Hubs" },
//       { to: "/funding", label: "Funding" },
//       { to: "/reports", label: "Reports" },
//       { to: "/register", label: "Register Users" },
//       {
//         to: "/",
//         label: "Logout",
//         onClick: () => {
//           logout()
//           navigate("/dashboard", { replace: true })
//         }
//       }
//     ]
//   } 
//   else if (user?.role === "manager") {
//     // ✅ Manager
//     menu = [
//       { to: "/hubs", label: "Hubs" },
//       {
//         to: "/",
//         label: "Logout",
//         onClick: () => {
//           logout()
//           navigate("/dashboard", { replace: true })
//         }
//       }
//     ]
//   }

//   // Hide menu on dashboard
//   const visibleMenu = location.pathname !== "/dashboard" ? menu : []

//   return (
//     <nav className="navbar">
//       <div className="nav-left">
//         <img src={logo} alt="Kenya Logo" className="logo" />
//         <div className="logo-text">
//           <span className="gov-title">Republic of Kenya</span>
//           <span className="ministry">
//             The Ministry of Information, Communications and the Digital Economy (MICDE)
//           </span>
//         </div>
//       </div>

//       <button
//         className="hamburger"
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label="Toggle navigation"
//       >
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//       </button>

//       <div className={`nav-links ${isOpen ? 'active' : ''}`}>
//         {visibleMenu.map(({ to, label, onClick }) => (
//           <Link
//             key={to}
//             to={to}
//             className="nav-link"
//             onClick={() => {
//               if (onClick) onClick()
//               setIsOpen(false)
//             }}
//           >
//             {label}
//           </Link>
//         ))}

//         {/* Show login button on dashboard */}
//         {location.pathname === "/dashboard" && (
//           <button
//             className="nav-link admin-btn"
//             onClick={() => {
//               onLoginClick(true)
//               setIsOpen(false)
//             }}
//           >
//             Admin Login
//           </button>
//         )}
//       </div>
//     </nav>
//   )
// }

// // ==========================
// // LAYOUT & MODAL
// // ==========================

// function Layout({ children }) {
//   const location = useLocation()
//   const hideNavbar = location.pathname === "/login" || location.pathname === "/register"
//   const [showLogin, setShowLogin] = useState(false)

//   return (
//     <>
//       {!hideNavbar && <Navigation onLoginClick={setShowLogin} />}
//       {children}
//       {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
//     </>
//   )
// }

// function LoginModal({ onClose }) {
//   const navigate = useNavigate()

//   const handleClose = () => {
//     onClose()
//     navigate("/dashboard", { replace: true })
//   }

//   return (
//     <div className="login-modal-overlay" onClick={handleClose}>
//       <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
//         <button
//           className="login-modal-close"
//           onClick={handleClose}
//           aria-label="Close login"
//         >
//           &times;
//         </button>
//         <Login onClose={onClose} />
//       </div>
//     </div>
//   )
// }

// // ==========================
// // MAIN APP COMPONENT
// // ==========================

// export default function App() {
//   return (
//     <AuthProvider>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/hubs" element={<PrivateRoute><Hubs /></PrivateRoute>} />
//           <Route path="/funding" element={<PrivateRoute><Funding /></PrivateRoute>} />
//           <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
//           <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
//           <Route path="/hub-explorer" element={<PrivateRoute><HubExplorerPage /></PrivateRoute>} />
//           <Route
//             path="/register"
//             element={
//               <AdminRoute>
//                 <Register />
//               </AdminRoute>
//             }
//           />
//         </Routes>
//       </Layout>
//     </AuthProvider>
//   )
// }



// import React, { useState } from 'react'
// import { Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom'
// import Dashboard from './pages/Dashboard'
// import Hubs from './features/hubs/Hubs'
// import Logs from './features/hubs/Logs' // ✅ added Logs
// import Funding from './features/funding/Funding'
// import Reports from './features/reports/Reports'
// import Community from './features/community/Community'
// import Login from './features/users/Login'
// import Register from './features/users/Register'
// import { AuthProvider, useAuth } from './context/AuthContext'
// import "./navbar.css"
// import logo from "/assets/kenya.jpg"
// import HubExplorerPage from "./pages/HubExplorerForm"
// import AdminFeedback from "./pages/AdminFeedback";

// // ==========================
// // ROUTE PROTECTION
// // ==========================
// function PrivateRoute({ children }) {
//   const { user } = useAuth()
//   return user ? children : <Navigate to="/dashboard" replace />
// }

// function AdminRoute({ children }) {
//   const { user } = useAuth()
//   return user?.role === "admin" ? children : <Navigate to="/dashboard" replace />
// }

// // ==========================
// // NAVIGATION COMPONENT
// // ==========================
// function Navigation({ onLoginClick }) {
//   const [isOpen, setIsOpen] = useState(false)
//   const { user, logout } = useAuth()
//   const location = useLocation()
//   const navigate = useNavigate()

//   // 🧭 Role-based menu logic
//   let menu = []

//   if (user?.role === "admin" || user?.role === "analyst") {
//     // ✅ Admin and Analyst
//     menu = [
//       { to: "/hubs", label: "Hubs" },
//       { to: "/logs", label: "Logs" }, // ✅ added Logs link
//       { to: "/funding", label: "Funding" },
//       { to: "/reports", label: "Reports" },
//       { to: "/register", label: "Register Users" },
//       {
//         to: "/",
//         label: "Logout",
//         onClick: () => {
//           logout()
//           navigate("/dashboard", { replace: true })
//         }
//       }
//     ]
//   } 
//   else if (user?.role === "manager") {
//     // ✅ Manager
//     menu = [
//       { to: "/hubs", label: "Hubs" },
//       {
//         to: "/",
//         label: "Logout",
//         onClick: () => {
//           logout()
//           navigate("/dashboard", { replace: true })
//         }
//       }
//     ]
//   }

//   const visibleMenu = location.pathname !== "/dashboard" ? menu : []

//   return (
//     <nav className="navbar">
//       <div className="nav-left">
//         <img src={logo} alt="Kenya Logo" className="logo" />
//         <div className="logo-text">
//           <span className="gov-title">Republic of Kenya</span>
//           <span className="ministry">
//             The Ministry of Information, Communications and the Digital Economy (MICDE)
//           </span>
//         </div>
//       </div>

//       <button
//         className="hamburger"
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label="Toggle navigation"
//       >
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//         <span className={`bar ${isOpen ? 'open' : ''}`}></span>
//       </button>

//       <div className={`nav-links ${isOpen ? 'active' : ''}`}>
//         {visibleMenu.map(({ to, label, onClick }) => (
//           <Link
//             key={to}
//             to={to}
//             className="nav-link"
//             onClick={() => {
//               if (onClick) onClick()
//               setIsOpen(false)
//             }}
//           >
//             {label}
//           </Link>
//         ))}

//         {location.pathname === "/dashboard" && (
//           <button
//             className="nav-link admin-btn"
//             onClick={() => {
//               onLoginClick(true)
//               setIsOpen(false)
//             }}
//           >
//             Admin Login
//           </button>
//         )}
//       </div>
//     </nav>
//   )
// }

// // ==========================
// // LAYOUT & MODAL
// // ==========================
// function Layout({ children }) {
//   const location = useLocation()
//   const hideNavbar = location.pathname === "/login" || location.pathname === "/register"
//   const [showLogin, setShowLogin] = useState(false)

//   return (
//     <>
//       {!hideNavbar && <Navigation onLoginClick={setShowLogin} />}
//       {children}
//       {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
//     </>
//   )
// }

// function LoginModal({ onClose }) {
//   const navigate = useNavigate()
//   const handleClose = () => {
//     onClose()
//     navigate("/dashboard", { replace: true })
//   }

//   return (
//     <div className="login-modal-overlay" onClick={handleClose}>
//       <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
//         <button
//           className="login-modal-close"
//           onClick={handleClose}
//           aria-label="Close login"
//         >
//           &times;
//         </button>
//         <Login onClose={onClose} />
//       </div>
//     </div>
//   )
// }

// // ==========================
// // MAIN APP COMPONENT
// // ==========================
// export default function App() {
//   return (
//     <AuthProvider>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/hubs" element={<PrivateRoute><Hubs /></PrivateRoute>} />
//           <Route path="/logs" element={<PrivateRoute><Logs /></PrivateRoute>} /> {/* ✅ Logs route */}
//           <Route path="/funding" element={<PrivateRoute><Funding /></PrivateRoute>} />
//           <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
//           <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
//           <Route path="/hub-explorer" element={<PrivateRoute><HubExplorerPage /></PrivateRoute>} />
//           <Route path="/admin/feedback" element={<AdminFeedback />} />
//           <Route
//             path="/register"
//             element={
//               <AdminRoute>
//                 <Register />
//               </AdminRoute>
//             }
//           />
//         </Routes>
//       </Layout>
//     </AuthProvider>
//   )
// }



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
