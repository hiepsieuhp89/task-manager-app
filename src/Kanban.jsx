import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { FaTrash } from "react-icons/fa";
import { wrapLinksInText } from "./App";

const Kanban = ({ tasks, setTasks, updateTask, deleteTask }) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState("");

  const columns = {
    todo: tasks.filter((task) => !task.completed && !task.isProcessing),
    inProgress: tasks.filter((task) => !task.completed && task.isProcessing),
    completed: tasks.filter((task) => task.completed),
  };

  const handleDelete = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    deleteTask(taskId);
  };

  const handleDoubleClick = (taskId, taskName) => {
    setEditingTaskId(taskId);
    setEditedTaskName(taskName);
  };

  const handleNameChange = (e) => {
    setEditedTaskName(e.target.value);
  };

  const handleNameUpdate = (taskId) => {
    if (editedTaskName.trim() !== "") {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, name: editedTaskName.trim() } : task
      );
      setTasks(updatedTasks);
      updateTask(taskId, { name: editedTaskName.trim() });
    }
    setEditingTaskId(null);
  };

  const Column = ({ title, tasks, status }) => (
    <div className="flex-1 rounded-lg bg-gray-100 p-4 shadow">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`min-h-[300px] space-y-2 ${
              snapshot.isDraggingOver
                ? "border-2 border-dashed border-blue-500 bg-blue-100"
                : ""
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`flex items-center justify-between rounded bg-white p-3 shadow ${
                      snapshot.isDragging ? "opacity-50" : ""
                    }`}
                  >
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        value={editedTaskName}
                        onChange={handleNameChange}
                        onBlur={() => handleNameUpdate(task.id)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleNameUpdate(task.id);
                        }}
                        className="flex-grow bg-white px-2 py-1 focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      <span className="line-clamp-2" onDoubleClick={() => handleDoubleClick(task.id, task.name)}>
                        {wrapLinksInText(task.name)}
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );

  return (
    <div className="overflow-x-auto md:overflow-x-visible">
      <div className="flex space-x-4 min-w-[768px]">
        <Column title="To Do" tasks={columns.todo} status="todo" />
        <Column title="In Progress" tasks={columns.inProgress} status="inProgress" />
        <Column title="Completed" tasks={columns.completed} status="completed" />
      </div>
    </div>
  );
};

export default Kanban;