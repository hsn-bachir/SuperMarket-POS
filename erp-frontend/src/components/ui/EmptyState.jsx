import { Inbox } from "lucide-react";

export default function EmptyState({ title, description }) {
  return (
    <div className="py-20 text-center">
      <Inbox size={46} className="mx-auto mb-4 text-gray-400" />

      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mt-2 text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}
