import React, { createContext, useContext, useEffect, useState } from 'react'
import API from '../services/api'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }){
  const [user,setUser] = useState(null)

  useEffect(()=>{
    const token = localStorage.getItem('token')
    const profile = localStorage.getItem('profile')
    if(token && profile){
      setUser(JSON.parse(profile))
    }
  },[])

  const login = async (email, password) => {
    // const { data } = await API.post('/users/login', { email, password })
    const { data } = await API.post('https://dhms-79l7.onrender.com/api/users/login', { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('profile', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const register = async (payload) => {
    const { data } = await API.post('/users/register', payload)
    return data
  }

  const logout = ()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('profile')
    setUser(null)
  }

  return <AuthCtx.Provider value={{ user, login, logout, register }}>{children}</AuthCtx.Provider>
}
