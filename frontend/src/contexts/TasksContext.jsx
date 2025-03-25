import axios from "axios";
import { createContext, useEffect, useState , useContext} from "react";
import {useAuth} from './AuthContext.jsx'


const TaskContext = createContext();

export const TaskProvider = ({children})=>{

    const [tasks , setTasks] = useState([])
    const {user} = useAuth();

    const fetchTasks = async()=>{
        try {
            const {data} = await axios.get('/tasks')
            setTasks(data);
        } catch (error) {
            console.log("Error fetching tasks" , error)
        }
    }

    useEffect(()=>{
        if(user){
            fetchTasks()
        }
    },[user])

    return (
        <TaskContext.Provider value={{tasks , fetchTasks}}>
            {children}
        </TaskContext.Provider>
    )
}


export const useTasks = () => useContext(TaskContext)