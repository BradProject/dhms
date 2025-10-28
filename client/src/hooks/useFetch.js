import { useEffect, useState } from 'react'
import API from '../services/api'

export default function useFetch(path){
  const [data,setData] = useState(null)
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState(null)

  useEffect(()=>{
    let live = true
    API.get(path).then(res=>{
      if(live){ setData(res.data); setLoading(false) }
    }).catch(e=>{
      if(live){ setError(e?.response?.data || e.message); setLoading(false) }
    })
    return ()=>{ live=false }
  },[path])

  return { data, loading, error }
}
