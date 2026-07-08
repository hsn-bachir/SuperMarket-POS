import { cn } from "@/lib/utils";

function Table({ className, ...props }) {
  return (
    <div
      data-slot="table-container"
      className="
        relative
        w-full
        overflow-hidden
        rounded-3xl
        border
        border-gray-700
        bg-gray-900
        shadow-[0_8px_30px_rgba(0,0,0,0.35)]
      "
    >
      <div className="overflow-x-auto">
        <table
          data-slot="table"
          className={cn("w-full caption-bottom text-sm", className)}
          {...props}
        />
      </div>
    </div>
  );
}

function TableHead({ className, ...props }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        `
        bg-gray-900
        px-6
        py-4
        text-left
        text-xs
        font-semibold
        uppercase
        tracking-wider
        text-gray-400
        whitespace-nowrap
      `,
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        `
        border-t
        border-gray-800
        transition-all

        hover:bg-gray-800/40
      `,
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        `
        px-6
        py-4
        align-middle
        whitespace-nowrap
        text-gray-300
      `,
        className,
      )}
      {...props}
    />
  );
}

export { Table, TableHead, TableRow, TableCell };
