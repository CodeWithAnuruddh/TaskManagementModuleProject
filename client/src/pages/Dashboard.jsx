import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const Dashboard = () => {
  console.log("into the dsahboard");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
  });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const username = Cookies.get("name"); 

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/task/getall",
          {
            withCredentials: true,
          }
        );
        console.log(res);
        setTasks(res.data.tasks);
      } catch (err) {
        toast.error("Failed to fetch tasks");
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        const res = await axios.put(
          `http://localhost:5000/api/v1/task/update/${editId}`,
          formData,
          {
            withCredentials: true,
          }
        );
        setTasks((prev) =>
          prev.map((task) => (task._id === editId ? res.data : task))
        );
        toast.success("Task updated!");
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/v1/task/post",
          formData,
          {
            withCredentials: true,
          }
        );
        setTasks((prev) => [...prev, res.data]);
        toast.success("Task added!");
      }

      setFormData({ title: "", description: "", status: "Pending" });
      setEditId(null);
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/task/delete/${id}`, {
        withCredentials: true,
      });

      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      <div className="bg-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-semibold">Welcome, {username} 👋</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            toast.info("Logged out");
            navigate("/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="p-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          Task Manager Dashboard
        </h2>

        <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto mb-10">
          <h3 className="text-xl font-semibold mb-4">
            {editId ? "Edit Task" : "Add New Task"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Task Title"
              className="w-full border rounded px-3 py-2"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Task Description"
              className="w-full border rounded px-3 py-2"
              required
            ></textarea>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editId ? "Update Task" : "Add Task"}
            </button>
          </form>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          {["all", "Pending", "Completed"].map((type) => (
            <button
              key={type}
              className={`px-4 py-1 rounded border ${
                filter === type
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>
        
        <div className="grid gap-4 max-w-3xl mx-auto">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-start"
            >
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.description}</p>
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    task.status === "Completed"
                      ? "bg-green-200 text-green-700"
                      : "bg-yellow-200 text-yellow-700"
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setEditId(task._id);
                    setFormData({
                      title: task.title,
                      description: task.description,
                      status: task.status,
                    });
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
