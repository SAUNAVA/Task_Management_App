import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersResponse, tasksResponse] = await Promise.all([
          axios.get('/admin/users', { withCredentials: true }),
          axios.get('/admin/tasks', { withCredentials: true })
        ]);
        
        setUsers(usersResponse.data);
        setTasks(tasksResponse.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 403) {
          navigate('/');
          alert('Admin access required');
        }
        setError('Failed to load admin data');
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleAdminToggle = async (userId, isAdmin) => {
    try {
      const updatedUser = await axios.patch(
        `/admin/users/${userId}`,
        { isAdmin },
        { withCredentials: true }
      );
      
      setUsers(users.map(user => 
        user._id === userId ? updatedUser.data : user
      ));
    } catch (err) {
      console.error('Admin status update failed:', err);
      alert('Failed to update admin status');
    }
  };

  if (loading) return <div>Loading admin dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <section className="users-section">
        <h2>Users Management ({users.length})</h2>
        <div className="user-list">
          {users.map(user => (
            <div key={user._id} className="user-card">
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="admin-control">
                <label>
                  Admin Privileges:
                  <input
                    type="checkbox"
                    checked={user.isAdmin}
                    onChange={(e) => handleAdminToggle(user._id, e.target.checked)}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="tasks-section">
        <h2>All Tasks ({tasks.length})</h2>
        <div className="task-list">
          {tasks.map(task => (
            <div key={task._id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="task-meta">
                <span className="status">{task.status}</span>
                <span className="due-date">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
                <span className="owner">
                  Owner: {task.user?.name || 'Deleted User'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;