interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div className="fixed right-5 top-5 z-50">
      <div
        className={`flex min-w-[320px] items-center justify-between rounded-xl px-5 py-4 text-white shadow-lg ${
          type === "success" ? "bg-green-600" : "bg-red-600"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">
            {type === "success" ? "✓" : "!"}
          </span>

          <p className="text-sm font-medium">{message}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="ml-4 text-lg font-bold opacity-80 hover:opacity-100"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;