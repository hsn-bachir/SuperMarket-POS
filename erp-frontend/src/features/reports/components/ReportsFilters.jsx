export default function ReportsFilters({ filters, setFilters }) {
  function handleChange(e) {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  }

  function clearFilters() {
    setFilters({
      start_date: "",
      end_date: "",
    });
  }

  return (
    <div className="rounded-xl border bg-white dark:bg-gray-900 p-5">
      <div className="flex flex-wrap items-end gap-5">
        <div>
          <label className="block mb-2 text-sm font-medium">Start Date</label>

          <input
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-48"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">End Date</label>

          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-48"
          />
        </div>

        <button
          onClick={clearFilters}
          className="px-5 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
