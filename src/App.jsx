import axios from "axios";
import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { FaCalendarAlt, FaList } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Kanban from "./Kanban";
import List from "./List";
import { useNotification } from "./hooks/useNotification";

const API_URL = "https://67028cf5bd7c8c1ccd3f2f52.mockapi.io/todos";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [activeTab, setActiveTab] = useState("list");
  const { showNotification } = useNotification();

  const sortTasksByPosition = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => a.position - b.position);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      const sortedTasks = sortTasksByPosition(response.data);
      setTasks(sortedTasks);
      showNotification("Tasks fetched successfully");
    } catch (error) {
      console.error("Error fetching tasks:", error);
      showNotification("Error fetching tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;
    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        name: newTask,
        completed: false,
        createdAt: new Date().toISOString(),
        position: tasks.length,
        isProcessing: false,
      });
      const updatedTasks = sortTasksByPosition([...tasks, response.data]);
      setTasks(updatedTasks);
      setNewTask("");
      showNotification("Task added successfully");
    } catch (error) {
      console.error("Error adding task:", error);
      showNotification("Error adding task", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === id);
      await axios.put(`${API_URL}/${id}`, {
        ...taskToUpdate,
        ...updates,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      // Optionally, you can show an error notification here
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      // Optionally, you can show an error notification here
    }
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const updatedTasks = Array.from(tasks);
    const [reorderedTask] = updatedTasks.splice(source.index, 1);
    updatedTasks.splice(destination.index, 0, reorderedTask);

    // Update positions for all tasks
    const tasksWithUpdatedPositions = updatedTasks.map((task, index) => ({
      ...task,
      position: index,
    }));

    if (source.droppableId !== destination.droppableId) {
      // Kanban mode: Update task status
      const taskIndex = tasksWithUpdatedPositions.findIndex(
        (task) => task.id === draggableId
      );
      tasksWithUpdatedPositions[taskIndex] = {
        ...tasksWithUpdatedPositions[taskIndex],
        isProcessing: destination.droppableId === "inProgress",
        completed: destination.droppableId === "completed",
      };
    }

    // Optimistically update UI
    setTasks(sortTasksByPosition(tasksWithUpdatedPositions));

    // Prepare updates for the API call
    const taskToUpdate = tasksWithUpdatedPositions.find((task) => task.id === draggableId);
    const updates = {
      position: taskToUpdate.position,
    };

    if (source.droppableId !== destination.droppableId) {
      updates.isProcessing = taskToUpdate.isProcessing;
      updates.completed = taskToUpdate.completed;
    }

    // Silently call the API
    updateTask(draggableId, updates);

    // Update positions for all other tasks
    tasksWithUpdatedPositions.forEach((task) => {
      if (task.id !== draggableId) {
        updateTask(task.id, { position: task.position });
      }
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="mx-auto mt-10 max-w-6xl rounded-lg bg-white p-6 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-indigo-600">
          Task Manager
        </h1>
        <div className="mb-2 flex flex-col items-center justify-center gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("list")}
              className={`flex items-center rounded px-4 py-2 ${
                activeTab === "list"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <FaList className="mr-2" /> Tasks
            </button>
            <button
              onClick={() => setActiveTab("kanban")}
              className={`flex items-center rounded px-4 py-2 ${
                activeTab === "kanban"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <FaCalendarAlt className="mr-2" /> Kanban
            </button>
          </div>
          <p className="mb-6 text-left text-sm italic text-gray-500">
            {activeTab === "list" ? (
              <>
                Double-click a task name to edit.
                <br />
                Drag tasks to reorder.
              </>
            ) : (
              <>
                Drag tasks between columns.
                <br />
                Double-click a task name to edit.
              </>
            )}
          </p>
        </div>
        {activeTab === "list" && (
          <List
            tasks={tasks}
            setTasks={setTasks}
            newTask={newTask}
            setNewTask={setNewTask}
            loading={loading}
            updatingTaskId={updatingTaskId}
            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        )}
        {activeTab === "kanban" && (
          <Kanban
            tasks={tasks}
            setTasks={setTasks}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        )}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={1}
        />
      </div>
    </DragDropContext>
  );
};

export default App;
