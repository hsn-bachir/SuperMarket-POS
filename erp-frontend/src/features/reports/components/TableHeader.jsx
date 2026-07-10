import { Search } from "lucide-react";

import ExportButton from "@/components/ui/ExportButton";

export default function TableHeader({
  title,
  description,
  search,
  setSearch,
  exportName,
  filters = {},
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-gray-700 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-100">{title}</h2>

        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {setSearch && (
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="
                h-11
                w-full
                rounded-xl
                border
                border-gray-700
                bg-gray-800
                pl-10
                pr-4
                text-sm
                text-gray-100
                placeholder:text-gray-500
                outline-none
                transition
                focus:border-gray-600
              "
            />
          </div>
        )}

        <div className="flex gap-2 z-1000">
          <ExportButton endpoint={exportName} filters={filters} />
        </div>
      </div>
    </div>
  );
}
