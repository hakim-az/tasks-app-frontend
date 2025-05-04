import TaskList from "./components/TaskList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📝 Task Manager</h1>
      <TaskList />
      <ToastContainer />
    </div>
  );
}

export default App;
