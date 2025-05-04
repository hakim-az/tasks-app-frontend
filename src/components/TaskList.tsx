import { useCallback, useEffect, useState } from "react";
import { Task } from "../types/Task";
import { toast } from "react-toastify";
import TaskModal from "./TaskModal";
import TaskForm from "./TaskForm";

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL); 
      const data = await res.json();
      console.log("Fetched tasks response:", data);
      setTasks(data.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  }, []);
  
  

  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
  
      if (res.ok) {
        toast.success("Task deleted");
        fetchTasks(); // Re-fetch the tasks after successful delete
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      toast.error("Delete failed");
      console.error(error);
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: !currentStatus }),
      });
  
      if (res.ok) {
        toast.success("Status updated");
        fetchTasks(); // Re-fetch tasks to update the list
      } else {
        throw new Error('Status update failed');
      }
    } catch (error) {
      toast.error("Status update failed");
      console.error(error);
    }
  };
  

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        + New Task
      </button>

      {tasks.map((task) => (
        <div
          key={task.id}
          className="border p-4 mb-2 flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status ? "✅" : "❌"}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleStatus(task.id, task.status)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Toggle
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchTasks}
        />
      </TaskModal>
    </div>
  );
};

export default TaskList;
