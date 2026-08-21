import Toolbar from "@/components/ui/Toolbar";
import SearchInput from "@/components/ui/SearchInput";

export default function ServiceToolbar({ search, setSearch, setPage }) {
  return (
    <Toolbar>
      <SearchInput
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);

          if (setPage) {
            setPage(1);
          }
        }}
        placeholder="Search service history..."
      />
    </Toolbar>
  );
}
