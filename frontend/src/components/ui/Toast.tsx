type ToastType = "success" | "error";

type ToastProps = {
  message: string;
  type?: ToastType;
  onClose: () => void;
};

const classes: Record<ToastType, string> = {
  success: "bg-green-700",
  error: "bg-red-700",
};

export function Toast({ message, type = "success", onClose }: ToastProps) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${classes[type]}`}
    >
      <div className="flex items-center gap-4">
        <span>{message}</span>

        <button onClick={onClose} className="font-bold">
          ×
        </button>
      </div>
    </div>
  );
}