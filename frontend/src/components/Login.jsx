import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const Login = () => {

  const[email,setEmail] = useState('')
  const[password,setPassword] = useState('')
  const[loading , setLoading] = useState(false)
  const {login} = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e)=>{

    e.preventDefault()
    setLoading(true)

    try {
      const userData = await login(email,password)

      if(userData){
        toast.success(`Welcome back, ${userData.username}!`, {
          position: "top-center",
          autoClose: 2000,
        });

        if(userData.role === 'admin'){
          setTimeout(()=> navigate('/admin/dashboard'),2000)
        }else{
          setTimeout(()=> navigate('/tasks'),2000)
        }
      }
    } catch (error) {
      toast.error(error.message || 'Login failed', {
        position: "top-center",
        autoClose: 3000,
      });
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            autoComplete='email'
           />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            autoComplete='password'
           />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loging you in' : 'Login'}
        </button>
      </form>
      <div className="auth-footer">
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  )
}

export default Login
