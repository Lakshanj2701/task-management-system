import { useState, useEffect } from "react";
import axios from "axios";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";

const API = "http://localhost:3000/api/tasks";

export const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("All"); // 'All' | 'Pending' | 'Completed'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get(API);
        setTasks(data);
      } catch {
        setError("Failed to load tasks. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // ── Create ───────────────────────────────────────────────────────────────
  const handleCreate = async (formData) => {
    // Optimistic: add placeholder
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      ...formData,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [optimistic, ...prev]);

    try {
      const { data } = await axios.post(API, formData);
      // Replace placeholder with real document
      setTasks((prev) => prev.map((t) => (t._id === tempId ? data : t)));
    } catch {
      // Rollback
      setTasks((prev) => prev.filter((t) => t._id !== tempId));
      setError("Failed to create task.");
    }
  };

  // ── Update ───────────────────────────────────────────────────────────────
  const handleUpdate = async (formData) => {
    const prev = tasks.find((t) => t._id === editingTask._id);
    // Optimistic
    setTasks((list) =>
      list.map((t) => (t._id === editingTask._id ? { ...t, ...formData } : t)),
    );
    setEditingTask(null);

    try {
      const { data } = await axios.put(`${API}/${prev._id}`, formData);
      setTasks((list) => list.map((t) => (t._id === data._id ? data : t)));
    } catch {
      // Rollback
      setTasks((list) => list.map((t) => (t._id === prev._id ? prev : t)));
      setError("Failed to update task.");
    }
  };

  // ── Toggle Status ────────────────────────────────────────────────────────
  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    // Optimistic
    setTasks((list) =>
      list.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t)),
    );

    try {
      const { data } = await axios.put(`${API}/${task._id}`, {
        status: newStatus,
      });
      setTasks((list) => list.map((t) => (t._id === data._id ? data : t)));
    } catch {
      // Rollback
      setTasks((list) =>
        list.map((t) =>
          t._id === task._id ? { ...t, status: task.status } : t,
        ),
      );
      setError("Failed to update task status.");
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const snapshot = tasks.find((t) => t._id === id);
    // Optimistic
    setTasks((list) => list.filter((t) => t._id !== id));

    try {
      await axios.delete(`${API}/${id}`);
    } catch {
      // Rollback
      setTasks((list) => [snapshot, ...list]);
      setError("Failed to delete task.");
    }
  };

  // ── Derived ──────────────────────────────────────────────────────────────
  const filtered =
    filter === "All" ? tasks : tasks.filter((t) => t.status === filter);

  const counts = {
    All: tasks.length,
    Pending: tasks.filter((t) => t.status === "Pending").length,
    Completed: tasks.filter((t) => t.status === "Completed").length,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Error banner */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="font-bold ml-4">
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form */}
        <div className="lg:col-span-1">
          <TaskForm
            onSubmit={editingTask ? handleUpdate : handleCreate}
            editingTask={editingTask}
            onCancelEdit={() => setEditingTask(null)}
          />

          {/* Stats card */}
          <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 grid grid-cols-3 gap-2 text-center">
            {["All", "Pending", "Completed"].map((s) => (
              <div key={s}>
                <p className="text-2xl font-bold text-gray-800">{counts[s]}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: task list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Filter tabs */}
          <div className="flex gap-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
            {["All", "Pending", "Completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition ${
                  filter === f
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {f}
                <span
                  className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    filter === f
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>

          {/* Task list */}
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              Loading tasks...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <span className="text-4xl mb-2">📋</span>
              <p className="text-sm">
                {filter === "All"
                  ? "No tasks yet. Add one!"
                  : `No ${filter} tasks.`}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onEdit={setEditingTask}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
