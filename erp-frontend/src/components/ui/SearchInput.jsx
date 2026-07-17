import { Search } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="relative w-80">
      <Search
        size={18}
        className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-[var(--text-secondary)]
        "
      />

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          h-10
          w-full
          rounded-lg
          border
          border-gray-300
          bg-white
          pl-10
          pr-4
          outline-none
          transition
          focus:border-[var(--primary)]
        "
      />
    </div>
  );
}
