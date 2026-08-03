import ExportButton from "@/components/ui/ExportButton";

export default function ReportHeader({
  title,
  description,
  exportName,
  filters = {},
}) {
  return (
    <div
      className="
        flex
        flex-col
        gap-5
        border-b
        border-gray-700
        px-6
        py-5
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-100">{title}</h2>

        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>

      <div className="z-1000 flex gap-2">
        <ExportButton endpoint={exportName} filters={filters} />
      </div>
    </div>
  );
}
