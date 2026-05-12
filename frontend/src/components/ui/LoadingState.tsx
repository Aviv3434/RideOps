export function LoadingState({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-1/3 rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
      </div>

      <p className="mt-4 text-sm text-gray-500">{text}</p>
    </div>
  );
}