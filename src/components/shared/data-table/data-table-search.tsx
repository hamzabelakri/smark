import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { TableSearchProps } from "@/models/table-model";
import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useDebounce } from "@/hooks/use-debounce";

interface DataTableSearchProps {
  tableSearchProps?: TableSearchProps;
}

const DataTableSearch = ({ tableSearchProps }: DataTableSearchProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 150) || "";

  useEffect(() => {
    if (tableSearchProps?.setQueryParams) {
      tableSearchProps.setQueryParams({
        search: debouncedSearchTerm,
        page: 1,
      });
    }
  }, [debouncedSearchTerm, tableSearchProps?.setQueryParams]);

  return (
    <InputGroup
      className={cn(
        // pill shape, same as the ProfileDropdown trigger
        "h-11 w-[170px] rounded-full border-0 bg-muted shadow-none lg:w-[220px]",
        "dark:bg-muted ps-1.5 pe-3 transition-colors hover:bg-accent",
        // same focus ring as ProfileDropdown
        "has-[[data-slot=input-group-control]:focus-visible]:ring-2",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-ring"
      )}
    >
      <InputGroupAddon className="pl-0 ps-0">
        {/* circular icon badge, like the avatar fallback */}
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Search className="size-4" />
        </span>
      </InputGroupAddon>
      <InputGroupInput
        placeholder={tableSearchProps?.placeholder || "Search..."}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="text-xs"
      />
    </InputGroup>
  );
};

export default DataTableSearch;