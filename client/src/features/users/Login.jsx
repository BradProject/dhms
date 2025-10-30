


import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './login.css' 

export default function Login({ onClose }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const nav = useNavigate()
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    if(attempts >= 5){
      setError("Too many login attempts. Please try again later.")
      return
    }

    try {
      await login(email, password)
      if (onClose) onClose() 
      nav('/hubs')
    } catch (err) {
      setAttempts(prev => prev + 1)
      setError(err?.response?.data?.message || err.message)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please login to continue</p>

        <form onSubmit={submit} className="login-form">
          <input 
            className="login-input" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <input 
            className="login-input" 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />

          {error && <p className="login-error">{error}</p>}
          {attempts > 0 && <p className="login-warning">Attempts left: {5 - attempts}</p>}

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  )
}
