import { ReactNode } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const TaskModal = ({ isOpen, onClose, children }: Props) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-96">
        <button className="text-right mb-2 text-red-500" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default TaskModal;
