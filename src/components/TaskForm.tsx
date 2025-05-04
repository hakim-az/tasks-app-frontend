import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";

interface FormValues {
  title: string;
  description?: string;
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const TaskForm = ({ onClose, onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, status: true }),
      });

      if (res.ok) {
        toast.success("Task created successfully", {
          onClose: () => {
            setLoading(false);
            onClose();
          },
        });
        onSuccess();
        reset();
      } else {
        throw new Error("Failed to create task");
      }
    } catch (error) {
      toast.error("Failed to create task", {
        onClose: () => {
          setLoading(false);
        },
      });
      console.error(error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <label className="font-semibold">Title <span className="text-red-600">*</span></label>
        <input
          {...register("title", { required: "Title is required" })}
          className="border h-10 border-gray-300 w-full p-2 rounded focus:outline-blue-500 focus:outline-2"
          disabled={loading}
        />
        {errors.title && (
          <p className="text-red-500">{errors.title.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <label className="font-semibold">Description</label>
        <textarea
          {...register("description")}
          className="border border-gray-300 h-32 w-full resize-none focus:outline-blue-500 focus:outline-2 p-2 rounded"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`mt-8 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer hover:opacity-70 transition-all ease-in-out delay-75 bg-blue-500 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
};

export default TaskForm;
