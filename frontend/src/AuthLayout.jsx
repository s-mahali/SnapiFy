import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const AuthLayout = ({children}) => {
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store => store.auth);
    const navigate = useNavigate();
   
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    },[])
    
  return (
    <div>AuthLayout</div>
  )
}

export default AuthLayout