import axios from 'axios'
import { useState } from 'react';
import { useTasks } from '../contexts/TasksContext';


const TaskForm = () =>{
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const {fetchTasks} = useTasks();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            await axios.post('/tasks',{
                title,
                description,
                dueDate : dueDate || null
            })
            fetchTasks();
            setTitle('')
            setDescription('')
            setDueDate('')
        } catch (error) {
            console.error("Error creating task" , error)
        }
    }

    return(
        <form onSubmit={handleSubmit} className="task-form">
            <input
             type="text"
             placeholder = "Task title"
             value = {title}
             onChange={(e)=>setTitle(e.target.value)}
             required
             />

             <textarea
                placeholder = "Describe it"
                value = {description}
                onChange={(e)=>setDescription(e.target.value)}
             />
             <input
             type="date"
             placeholder = "Due Date"
             value = {dueDate}
             onChange={(e)=>setDueDate(e.target.value)}
             required
             />

             <button type='submit'>Add Task</button>
        </form>
    )
}

export default TaskForm;