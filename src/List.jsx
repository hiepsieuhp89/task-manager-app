import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import {
  FaCheck,
  FaGripVertical,
  FaPlus,
  FaTimes,
  FaTrash
} from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { wrapLinksInText } from "./App";

const List = ({
  tasks,
  setTasks,
  newTask,
  setNewTask,
  loading,
  updatingTaskId,
  addTask,
  updateTask,
  deleteTask
}) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState("");

  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    // Optimistically update UI
    setTasks(updatedTasks);
    // Silently call the API
    const updatedTask = updatedTasks.find((task) => task.id === id);
    updateTask(id, { completed: updatedTask.completed });
  };

  const handleDelete = (id) => {
    // Optimistically update UI
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    // Silently call the API
    deleteTask(id);
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

  return (
    <>
      <div className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow rounded-l bg-gray-200 px-4 py-2 text-gray-700 focus:bg-white focus:outline-none"
            placeholder="Enter a new task"
          />
          <button
            onClick={addTask}
            className="rounded-r bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:outline-none"
            disabled={loading}
          >
            {loading ? <ImSpinner8 className="animate-spin" /> : <FaPlus />}
          </button>
        </div>
      </div>
      <Droppable droppableId="tasks">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="flex items-center justify-between rounded bg-gray-100 p-3"
                  >
                    <div className="flex items-center flex-grow">
                      <span
                        {...provided.dragHandleProps}
                        className="mr-3 cursor-move"
                      >
                        <FaGripVertical />
                      </span>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="form-checkbox mr-3 h-5 w-5 text-indigo-600"
                      />
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
                        <span
                          className={`flex-grow line-clamp-2 ${
                            task.completed
                              ? "text-gray-500 line-through"
                              : "text-gray-700"
                          }`}
                          onDoubleClick={() => handleDoubleClick(task.id, task.name)}
                        >
                          {wrapLinksInText(task.name)}
                          {!task.completed && task.isProcessing && (
                            <span className="ml-2 text-xs text-gray-500">
                              (in progress)
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">
                        {task.completed ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </span>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </>
  );
};

export default List;