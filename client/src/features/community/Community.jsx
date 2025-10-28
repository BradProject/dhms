

import React, { useEffect, useState } from 'react'
import API from '../../services/api'
import './community.css'   

export default function Community(){
  const [list,setList] = useState([])
  const [form,setForm] = useState({ hubId:'', message:'' })
  const [hubs,setHubs] = useState([])

  const load = async ()=>{
    const hubsRes = await API.get('/hubs')
    setHubs(hubsRes.data)
    const { data } = await API.get('/community')
    setList(data)
  }
  useEffect(()=>{ load() }, [])

  const save = async (e)=>{
    e.preventDefault()
    await API.post('/community', form)
    setForm({ hubId:'', message:'' })
    load()
  }

  return (
    <div className="community-container">
      <h2>Community Feedback</h2>
      <form onSubmit={save} className="community-form">
        <select 
          value={form.hubId} 
          onChange={e=>setForm({...form, hubId:e.target.value})}
        >
          <option value="">Select hub</option>
          {hubs.map(h => <option value={h._id} key={h._id}>{h.name}</option>)}
        </select>
        <input 
          placeholder="Message" 
          value={form.message} 
          onChange={e=>setForm({...form, message:e.target.value})}
        />
        <button type="submit">Post</button>
      </form>

      <ul className="community-list">
        {list.map(x => (
          <li key={x._id}>
            <b>{x.hub?.name}:</b> {x.message}
          </li>
        ))}
      </ul>
    </div>
  )
}
