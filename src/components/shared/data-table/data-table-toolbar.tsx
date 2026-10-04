import { Table } from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import { ToolbarProps } from "@/models/table-model";
import { DataTableViewOptions } from "./data-table-view-options";
import DataTableSearch from "./data-table-search";
import DataTableAdd from "./data-table-add";
import { DataTableExport } from "./data-table-export";
import { DataTableFilter } from "./data-table-filter";
import DataTableExtra from "./data-table-extra";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  toolbarProps?: ToolbarProps;
}

export function DataTableToolbar<TData>({
  table,
  toolbarProps,
}: DataTableToolbarProps<TData>) {
  return (
    <Card paddingY="py-0">
      <div className="flex items-center justify-between gap-2 p-2">
        <div className="flex flex-1 items-center gap-2">
          {toolbarProps?.tableSearchProps && (
            <DataTableSearch tableSearchProps={toolbarProps.tableSearchProps} />
          )}
          <DataTableViewOptions table={table} />
        </div>

        <div className="flex items-center gap-2">
          {toolbarProps?.extraAction && (
            <DataTableExtra tableExtraActionProps={toolbarProps.extraAction} />
          )}

          {toolbarProps?.exportFunction && (
            <DataTableExport exportFn={toolbarProps.exportFunction} />
          )}

          {toolbarProps?.tableFilterProps && (
            <DataTableFilter tableFilterProps={toolbarProps.tableFilterProps} />
          )}

          {toolbarProps?.tableAddProps && (
            <DataTableAdd tableAddProps={toolbarProps.tableAddProps} />
          )}
        </div>
      </div>
    </Card>
  );
}