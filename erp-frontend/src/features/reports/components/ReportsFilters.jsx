import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ReportsFilters() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl border border-gray-300 bg-white  p-5">
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-sm text-gray-900">Start Date</label>

          <Input type="date" />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-900">End Date</label>

          <Input type="date" />
        </div>
      </div>

      <div className="flex gap-2">
        <Button>Reset</Button>

        <Button>Apply Filters</Button>
      </div>
    </div>
  );
}
