import { useCallback, useEffect, useState } from "react";
import { Task } from "../types/Task";
import { toast } from "react-toastify";
import TaskModal from "./TaskModal";
import TaskForm from "./TaskForm";

interface PropsType {
  isModalOpen: boolean
  setIsModalOpen: (setIsModalOpen: boolean) => void
}

const TaskList = ({ isModalOpen, setIsModalOpen }: PropsType) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tasks');
      const data = await res.json();
      console.log("Fetched tasks response:", data);
      setTasks(data.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success("Task deleted");
        fetchTasks();
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
        fetchTasks();
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {loading ? (
        <div className="col-span-full text-center text-3xl w-full h-[calc(100vh-200px)] flex items-center justify-center  font-medium">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="col-span-full w-full h-[calc(100vh-200px)] flex items-center justify-center text-center text-3xl font-medium text-gray-500">No tasks found.</div>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="border border-gray-400 rounded shadow-sm flex-col p-4 mb-2 flex justify-between items-start"
          >
            <div className="w-full flex-col flex gap-2">
              <h3 className="text-xl font-semibold">{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status ? "✅" : "❌"}</p>
            </div>
            <div className="flex mt-8 w-full items-center justify-center gap-5">
              <button
                onClick={() => toggleStatus(task.id, task.status)}
                className="bg-blue-500 text-white px-8 py-1 rounded"
              >
                Toggle
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="bg-red-500 text-white px-8 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

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
