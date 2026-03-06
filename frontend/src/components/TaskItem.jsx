const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const TaskItem = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.status === "Completed";

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 p-5 flex flex-col gap-3 ${
        isCompleted
          ? "border-green-200 opacity-80"
          : "border-gray-100 hover:shadow-md"
      }`}
    >
      {/* Header: title + status badge */}
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`text-base font-semibold leading-snug ${
            isCompleted ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {task.title}
        </h3>
        <span
          className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isCompleted
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {task.status}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p
          className={`text-sm leading-relaxed ${
            isCompleted ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {task.description}
        </p>
      )}

      {/* Footer: date + actions */}
      <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
        <span className="text-xs text-gray-400">
          📅 {formatDate(task.createdAt)}
        </span>

        <div className="flex items-center gap-2">
          {/* Toggle status */}
          <button
            onClick={() => onToggleStatus(task)}
            title={isCompleted ? "Mark as Pending" : "Mark as Completed"}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
              isCompleted
                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {isCompleted ? "↩ Undo" : "✓ Done"}
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(task)}
            title="Edit task"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
          >
            ✏️ Edit
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(task._id)}
            title="Delete task"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};
