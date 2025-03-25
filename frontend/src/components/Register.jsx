import React, { useState } from 'react'
import axios from 'axios' 
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'  
const Register = () => {

    const [formData , setFormData] = useState({
        username:'',
        email:'',
        password:''
    })
    
    const [loading,setLoading]= useState(false)
    
    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault()
        
        setLoading(true)

        try {
            const regRes = await axios.post("/auth/register" , formData)
            if(regRes.data){
                
                toast.success('🎉 Registration successful! Redirecting...', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                setTimeout(()=>navigate('/Login'),2000)
            }

        } catch (err) {
            toast.error(err.response?.data?.error || '🚨 Registration failed', {
                position: "top-center",
                autoClose: 3000,
              });
            
        }finally{
            setLoading(false)
        }
    }
    return (
        <div className="auth-from">
            <h2>Register</h2>
            
            <form onSubmit={handleSubmit}>
                <input 
                type="text"
                placeholder='Username'
                value={formData.username}
                onChange={(e)=>setFormData({...formData,username:e.target.value})}
                required
                />
                <br />
                <input 
                type="email"
                placeholder='email'
                value={formData.email}
                onChange={(e)=>setFormData({...formData,email:e.target.value})}
                required
                />
                <br />
                <input 
                type="password"
                placeholder='password'
                value={formData.password}
                onChange={(e)=>setFormData({...formData,password:e.target.value})}
                required
                />
                <br />
                <button type="submit" disabled={loading}>
                    {loading? 'Registering...' : 'Register' }
                </button>
            </form>
        </div>
    )
}

export default Register
