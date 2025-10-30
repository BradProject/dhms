

import React, { useState, useEffect } from 'react'
import API from '../../services/api'
import { Link, useNavigate } from 'react-router-dom'
import './register.css'

export default function Register(){
  const [form,setForm] = useState({ name:'', email:'', password:'', role:'manager' })
  const [error,setError] = useState(null)
  const [passwordStrength,setPasswordStrength] = useState(0) // 0-100 scale
  const nav = useNavigate()

  // Evaluate password strength
  useEffect(() => {
    const { password } = form
    let score = 0
    if(password.length >= 8) score += 25
    if(/[A-Z]/.test(password)) score += 25
    if(/[0-9]/.test(password)) score += 25
    if(/[\W_]/.test(password)) score += 25
    setPasswordStrength(score)
  }, [form.password])

  const submit = async (e) => {
  e.preventDefault()

  // ✅ Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    setError("Please enter a valid email address.")
    return
  }

  // ✅ Password strength validation
  if (passwordStrength < 50){
    setError("Password is too weak! Include uppercase, number & symbol.")
    return
  }

  try {
    await API.post('https://dhms-79l7.onrender.com/api/users/register', form)
    //  await API.post('/users/register', form)
    // nav('/hubs')
    nav('https://dhms-79l7.onrender.com/api/hubs')
  } catch (err) {
    setError(err?.response?.data?.message || err.message)
  }
}

  const getStrengthColor = () => {
    if(passwordStrength < 50) return 'red'
    if(passwordStrength < 75) return 'orange'
    return 'green'
  }

  return (
    <div className="register-page">
      <div className="register-box">
        <h2>Create Account</h2>

        <form onSubmit={submit}>
          <input 
            placeholder="Full name" 
            value={form.name} 
            onChange={e=>setForm({...form, name:e.target.value})} 
          />
          <input 
            placeholder="Email" 
            value={form.email} 
            onChange={e=>setForm({...form, email:e.target.value})} 
          />
          <input 
            placeholder="Password" 
            type="password" 
            value={form.password} 
            onChange={e=>setForm({...form, password:e.target.value})} 
          />

          {/* Password Strength Bar */}
          <div className="password-strength">
            <div 
              className="strength-bar" 
              style={{ width: `${passwordStrength}%`, backgroundColor: getStrengthColor() }}
            />
          </div>
          <small>Password Strength: {passwordStrength}%</small>

          <select 
            value={form.role} 
            onChange={e=>setForm({...form, role:e.target.value})}
          >
            <option value="manager">Hub Manager</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>

          {error && <p className="error">{error}</p>}
          <button type="submit">Register</button>
        </form>

        <div className="register-actions">
          <button
            type="button"
            className="reset-password-btn"
            onClick={() => nav('/reset-password-direct')}
          >
            Reset Password
          </button>
          <button 
            type="button" 
            className="skip-btn" 
            onClick={()=>nav('/hubs')}
          >
            Skip & Go to Hubs
          </button>
         
          
        </div>
      </div>
    </div>
  )
}
