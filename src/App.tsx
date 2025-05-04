import { useState } from "react";
import TaskList from "./components/TaskList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="w-11/12 max-w-7xl mx-auto">
      <nav className="w-full flex items-center justify-between py-7">
      <h1 className="text-2xl font-bold mb-4">📝 Task Manager</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-green-500 cursor-pointer hover:scale-110 transition-all ease-in-out delay-75 hover:opacity-90 text-white px-4 py-2 rounded"
      >
        + New Task
      </button>
      </nav>
      <TaskList isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <ToastContainer />
    </div>
  );
}

export default App;
