import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border bg-white p-8 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>

      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}