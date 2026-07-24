export default function Pagination({ page, setPage, count, pageSize = 10 }) {
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages <= 1) return null;

  function getPages() {
    const pages = [];

    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (page <= 3) end = Math.min(5, totalPages);

    if (page >= totalPages - 2) {
      start = Math.max(1, totalPages - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  return (
    <div
      className="
    px-6 py-5
    flex flex-col gap-4
    md:flex-row
    md:items-center
    md:justify-between
  "
    >
      <p className="text-sm text-gray-400">
        Showing page <span className="font-semibold text-gray-400">{page}</span>{" "}
        of <span className="font-semibold text-gray-400">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          type="button"
          className="
            rounded-xl
            border border-gray-700
            bg-gray-800
            px-4 py-2
            text-sm font-medium
            text-gray-300
            transition-all

            hover:border-gray-600
            hover:bg-gray-700

            disabled:cursor-not-allowed
          "
        >
          Previous
        </button>

        {getPages().map((number) => (
          <button
            key={number}
            onClick={() => setPage(number)}
            type="button"
            className={`
              h-10 w-10
              rounded-xl
              border
              text-sm font-semibold
              transition-all

              ${
                number === page
                  ? `
                    border-emerald-500
                    bg-emerald-500/15
                    text-emerald-400
                  `
                  : `
                    border-gray-700
                    bg-gray-800
                    text-gray-300

                    hover:border-gray-600
                    hover:bg-gray-700
                    hover:text-gray-100
                  `
              }
            `}
          >
            {number}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          type="button"
          className="
            rounded-xl
            border border-gray-700
            bg-gray-800
            px-4 py-2
            text-sm font-medium
            text-gray-300
            transition-all

            hover:border-gray-600
            hover:bg-gray-700

            disabled:cursor-not-allowed
          "
        >
          Next
        </button>
      </div>
    </div>
  );
}
