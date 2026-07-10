import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ReportsFilters({ filters, setFilters }) {
  function reset() {
    setFilters({
      start_date: "",
      end_date: "",
    });
  }

  return (
    <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl border border-gray-300 bg-white p-5">
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-sm text-gray-900">Start Date</label>

          <Input
            type="date"
            value={filters.start_date}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                start_date: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-900">End Date</label>

          <Input
            type="date"
            value={filters.end_date}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                end_date: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={reset}>Reset</Button>

        {/* nothing needed */}
        <Button>Apply Filters</Button>
      </div>
    </div>
  );
}
