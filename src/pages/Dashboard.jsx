import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

const socket = io("http://localhost:5000"); // Connect to backend WebSocket server

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState("all");

  // Load all tasks from API
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      toast.error("Failed to fetch tasks");
    }
  };

  // Handle create or update
  const handleSubmit = async () => {
    if (!newTask.trim()) return;

    try {
      if (editTask) {
        await api.put(`/tasks/${editTask._id}`, { title: newTask });
        toast.success("Task updated");
        socket.emit("taskUpdated");
        setEditTask(null);
      } else {
        await api.post("/tasks", { title: newTask });
        toast.success("Task created");
        socket.emit("taskUpdated");
      }
      setNewTask("");
      // ❌ Do not manually fetchTasks here
    } catch {
      toast.error("Failed to submit task");
    }
  };

  // Handle task edit
  const handleEdit = (task) => {
    setNewTask(task.title);
    setEditTask(task);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      socket.emit("taskUpdated");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  // Handle status toggle
  const handleStatusChange = async (task) => {
    const nextStatus = {
      pending: "in-progress",
      "in-progress": "completed",
      completed: "pending"
    }[task.status];

    try {
      await api.put(`/tasks/${task._id}`, { status: nextStatus });
      toast.success("Status updated");
      socket.emit("taskUpdated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Filter based on status
  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  // Fetch on mount + listen to socket updates
  useEffect(() => {
    fetchTasks();
    socket.on("taskUpdated", fetchTasks);
    return () => socket.off("taskUpdated", fetchTasks);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <h2>Task Dashboard</h2>

        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder={editTask ? "Edit task..." : "Enter task"}
        />
        <button onClick={handleSubmit}>{editTask ? "Update" : "Add"}</button>

        <div>
          <select onChange={e => setFilter(e.target.value)} value={filter}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <ul>
          {filteredTasks.map(task => (
            <li key={task._id}>
              <span onClick={() => handleStatusChange(task)} className="task-title">
                <strong>{task.title}</strong> - {task.status}
              </span>
              <button onClick={() => handleEdit(task)}>✏️</button>
              <button onClick={() => handleDelete(task._id)}>🗑️</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
