import { createContext , useContext , useState , useEffect } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();


export const AuthProvider = ({children}) =>{

    const[user , setUser] = useState(null)
    const[loading, setLoading] = useState(true)
   

    // AuthContext.jsx
useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get('/auth/check', {
          withCredentials: true // Explicitly enable credentials
        });
        
        if (data) {
          setUser({
            email: data.email,
            username: data.username,
            role: data.role
          });
          
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    // Add 500ms delay to ensure cookie is available
    const timeout = setTimeout(checkAuth, 500);
    return () => clearTimeout(timeout);
  }, []);

    const login = async(email,password)=>{
        try {
            const {data} = await axios.post('/auth/login' ,{email,password})
            setUser(data)
            return data
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed')
            throw error
        }
    }

    const logout = async()=>{
        try {
            await axios.post('/auth/logout')
            setUser(null)
            
        } catch (error) {
            toast.error("logout failed")
        }
    }

    return(

        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            
        }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
