import React, { useEffect } from 'react'
import { FaSpinner } from 'react-icons/fa'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

const ProtectedRoutes = ({children}) => {
    const {user} = useSelector(store => store.auth)
    
    const navigate = useNavigate();
    useEffect(() => {
        if(!user) {
            navigate('/login')
        }
    },[user, navigate])
 
    if(!user) {
        return <>
            <h1>Redirecting to login page... </h1>
            <FaSpinner className="animate-spin" />
        </>
    }

  return (
    <>{children}</>
  )
}

export default ProtectedRoutes