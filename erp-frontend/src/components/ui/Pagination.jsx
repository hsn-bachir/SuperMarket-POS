export default function Pagination({ page, setPage, count, pageSize = 10 }) {
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages <= 1) return null;

  function getPages() {
    const pages = [];

    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (page <= 3) end = Math.min(5, totalPages);

    if (page >= totalPages - 2) start = Math.max(1, totalPages - 4);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing page <span className="font-semibold">{page}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          Previous
        </button>

        {getPages().map((number) => (
          <button
            key={number}
            onClick={() => setPage(number)}
            className={`h-10 w-10 rounded-lg border text-sm font-medium transition ${
              number === page
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            }`}
          >
            {number}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          Next
        </button>
      </div>
    </div>
  );
}
