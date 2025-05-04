import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

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
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, status: true }),
      });

      if (res.ok) {
        toast.success("Task created successfully");
        onSuccess();
        onClose();
      } else {
        throw new Error("Failed to create task");
      }
    } catch (error) {
      toast.error("Failed to create task");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Title *</label>
        <input
          {...register("title", { required: "Title is required" })}
          className="border w-full p-2 rounded"
        />
        {errors.title && (
          <p className="text-red-500">{errors.title.message}</p>
        )}
      </div>
      <div className="mt-2">
        <label>Description</label>
        <textarea {...register("description")} className="border w-full p-2 rounded" />
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Create
      </button>
    </form>
  );
};

export default TaskForm;
