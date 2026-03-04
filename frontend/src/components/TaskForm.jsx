import { useState, useEffect } from "react";

export const TaskForm = ({ onSubmit, editingTask, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || "",
        status: editingTask.status,
      });
    } else {
      setFormData({ title: "", description: "", status: "Pending" });
    }
    setError("");
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "title") setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(formData);
      if (!editingTask) {
        setFormData({ title: "", description: "", status: "Pending" });
      }
    } finally {
      setLoading(false);
    }
  };

  const isEditing = Boolean(editingTask);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {isEditing ? "✏️ Edit Task" : "➕ New Task"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
              error
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-200 focus:ring-blue-300 focus:border-blue-400"
            }`}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add details (optional)"
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition resize-none"
          />
        </div>

        {/* Status (only in edit mode) */}
        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition"
          >
            {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Task"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
