import React from 'react'
import TaskForm from './TaskForm'
import TaskList from './TaskList'

const TasksPage = () => {
  return (
    <div className="tasks-page">
      <h2>My Tasks</h2>
      <TaskForm/>
      <TaskList/>
    </div>
  )
}

export default TasksPage

