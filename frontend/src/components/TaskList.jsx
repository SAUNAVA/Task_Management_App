import { useState } from 'react';
import axios from 'axios';
import { useTasks } from '../contexts/TasksContext.jsx';

const TaskList = () => {
  const { tasks, fetchTasks } = useTasks();
  const [editingId, setEditingId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task._id} className="task-card">
          <div className="task-header">
            <h3>{task.title}</h3>
            <button 
              onClick={() => handleDelete(task._id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
          <p>{task.description}</p>
          <div className="task-meta">
            <div className="status-container">
              {editingId === task._id ? (
                <select
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                  onBlur={() => handleStatusChange(task._id, updatedStatus)}
                  autoFocus
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              ) : (
                <span
                  className="status-label"
                  onClick={() => {
                    setEditingId(task._id);
                    setUpdatedStatus(task.status);
                  }}
                >
                  Status: {task.status}
                </span>
              )}
            </div>
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;