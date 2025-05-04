import { useCallback, useEffect, useState } from "react";
import { Task } from "../types/Task";
import { toast } from "react-toastify";
import TaskModal from "./TaskModal";
import TaskForm from "./TaskForm";
import { TrashIcon } from "lucide-react";

interface PropsType {
  isModalOpen: boolean;
  setIsModalOpen: (setIsModalOpen: boolean) => void;
}

const TaskList = ({ isModalOpen, setIsModalOpen }: PropsType) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      "id": 6,
      "title": "TASK 1",
      "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente architecto necessitatibus est repudiandae iusto ullam nostrum nihil quos mollitia at.\n",
      "status": false
    },
    {
      "id": 7,
      "title": "TASK 2",
      "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente architecto necessitatibus est repudiandae iusto ullam nostrum nihil quos mollitia at.\n",
      "status": true
    }
  ]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tasks");
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
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Task deleted");
        fetchTasks();
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast.error("Delete failed");
      console.error(error);
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: !currentStatus }),
      });

      if (res.ok) {
        toast.success("Status updated");
        fetchTasks();
      } else {
        throw new Error("Status update failed");
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
        <div className="col-span-full text-center text-3xl w-full h-[calc(100vh-200px)] flex items-center justify-center  font-medium">
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="col-span-full w-full h-[calc(100vh-200px)] flex items-center justify-center text-center text-3xl font-medium text-gray-500">
          No tasks found.
        </div>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="border border-gray-400 rounded shadow-sm flex-col p-4 mb-2 flex justify-between items-start"
          >
            <div className="w-full flex-col flex gap-2">
              <h3 className="text-xl font-semibold">{task.title}</h3>
              <p>
                Status:{" "}
                {task.status ? (
                  <span className="text-green-600 font-semibold">Done</span>
                ) : (
                  <span className="text-red-500 font-semibold">Undone</span>
                )}
              </p>
              <p className="text-sm text-justify">{task.description}</p>
            </div>

            <div className="flex mt-8 w-full items-center justify-between gap-5">
              {/* Toggle switch */}
              <button
                onClick={() => toggleStatus(task.id, task.status)}
                className={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out ${
                  task.status ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${
                    task.status ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>

              {/* Delete button */}
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-600 cursor-pointer hover:text-red-800 transition"
                aria-label="Delete Task"
              >
                <TrashIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))
      )}

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm onClose={() => setIsModalOpen(false)} onSuccess={fetchTasks} />
      </TaskModal>
    </div>
  );
};

export default TaskList;
