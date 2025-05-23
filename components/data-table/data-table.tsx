"use client"

import type React from "react"
import { useState, useRef, useCallback, useMemo } from "react"
import { useVirtual } from "react-virtual"
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    type SortingState,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface DataTableColumn<T extends Record<string, unknown>> {
    key: string
    title: string
    width?: number
    renderCell?: (row: T) => React.ReactNode
}

export interface DataTableProps<T extends Record<string, unknown>> {
    /**
     * Array of column definitions
     */
    columns: DataTableColumn<T>[]
    /**
     * Array of data objects to display in the table
     */
    data?: T[]
    /**
     * Number of rows to display per page
     * @default 10
     */
    pageSize?: number
    /**
     * Callback function triggered when a row is clicked
     */
    onRowClick?: (row: T) => void
    /**
     * Callback function triggered when a column is sorted
     */
    onSort?: (columnKey: string, direction: "asc" | "desc") => void
    /**
     * Theme customization options
     */
    theme?: {
        headerBg?: string
        rowHoverColor?: string
    }
    /**
     * Height of the table in pixels
     * @default 400
     */
    height?: number
    /**
     * Optional CSS class name for additional styling
     */
    className?: string
}

export function DataTable<T extends Record<string, unknown>>({
    columns,
    data = [],
    pageSize = 10,
    onRowClick,
    onSort,
    theme = {
        headerBg: "bg-muted",
        rowHoverColor: "hover:bg-muted/50",
    },
    height = 400,
    className,
}: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [currentPage, setCurrentPage] = useState(0)
    const tableContainerRef = useRef<HTMLDivElement>(null)

    const totalPages = useMemo(() => Math.ceil(data.length / pageSize), [data.length, pageSize])
const pageData = useMemo(
  () => data.slice(currentPage * pageSize, (currentPage + 1) * pageSize),
  [data, currentPage, pageSize],
)
const columnHelper = useMemo(() => createColumnHelper<T>(), [])
    const tableColumns = useMemo(() => columns.map((col) => {
        return columnHelper.accessor((row) => row[col.key], {
            id: col.key,
            header: col.title,
            cell: (info) => (col.renderCell ? col.renderCell(info.row.original) : info.getValue()),
            size: col.width,
        })
    }), [columnHelper, columns])

    const handleSortingChange = useCallback(
        (updater: any) => {
          const newSorting = typeof updater === "function" ? updater(sorting) : updater
          setSorting(newSorting)
          if (newSorting.length > 0 && onSort) {
            onSort(newSorting[0].id, newSorting[0].desc ? "desc" : "asc")
          }
        },
        [sorting, onSort],
      )

    const table = useReactTable({
        data: pageData,
        columns: tableColumns,
        state: {
            sorting,
        },
        onSortingChange: (updater) => {handleSortingChange(updater)},
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    const { rows } = table.getRowModel()

    const rowVirtualizer = useVirtual({
        parentRef: tableContainerRef,
        size: rows.length,
        overscan: 10,
        estimateSize: useCallback(() => 48, []),
    })

    const { virtualItems: virtualRows, totalSize } = rowVirtualizer

    const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0
    const paddingBottom = virtualRows.length > 0 ? totalSize - virtualRows[virtualRows.length - 1].end : 0

const goToPage = useCallback(
    (page: number) => {
      const newPage = Math.max(0, Math.min(page, totalPages - 1))
      if (newPage !== currentPage) {
        setCurrentPage(newPage)
      }
    },
    [totalPages, currentPage],
  )

    return (
        <div className={cn("flex flex-col space-y-4", className)}>
            <div ref={tableContainerRef} className="relative overflow-auto border rounded-md" style={{ height }}>
                {data.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                        <div className="text-lg font-medium">Loading...</div>
                    </div>
                )}
                <table className="w-full caption-bottom text-sm">
                    <thead className={cn("sticky top-0 z-10", theme.headerBg)}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        style={{ width: header.getSize() }}
                                        className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={cn(
                                                    "flex items-center gap-1",
                                                    header.column.getCanSort() && "cursor-pointer select-none",
                                                )}
                                                onClick={header.column.getToggleSortingHandler()}
                                                role={header.column.getCanSort() ? "button" : undefined}
                                                tabIndex={header.column.getCanSort() ? 0 : undefined}
                                                aria-label={
                                                    header.column.getCanSort()
                                                        ? `Sort by ${header.column.id} ${header.column.getIsSorted() === "asc"
                                                            ? "descending"
                                                            : header.column.getIsSorted() === "desc"
                                                                ? "ascending"
                                                                : "ascending"
                                                        }`
                                                        : undefined
                                                }
                                                onKeyDown={(e) => {
                                                    if (header.column.getCanSort() && (e.key === "Enter" || e.key === " ")) {
                                                        e.preventDefault()
                                                        header.column.toggleSorting()
                                                    }
                                                }}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{
                                                    asc: <ChevronUp className="h-4 w-4" />,
                                                    desc: <ChevronDown className="h-4 w-4" />,
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody
                        className="relative"
                        style={{
                            height: `${totalSize}px`,
                        }}
                    >
                        {paddingTop > 0 && (
                            <tr>
                                <td style={{ height: `${paddingTop}px` }} colSpan={columns.length} />
                            </tr>
                        )}
                        {virtualRows.map((virtualRow) => {
                            const row = rows[virtualRow.index]
                            return (
                                <tr
                                    key={row.id}
                                    className={cn("h-12 transition-colors", theme.rowHoverColor, onRowClick && "cursor-pointer")}
                                    onClick={() => onRowClick && onRowClick(row.original)}
                                    tabIndex={onRowClick ? 0 : undefined}
                                    role={onRowClick ? "button" : undefined}
                                    onKeyDown={(e) => {
                                        if (onRowClick && (e.key === "Enter" || e.key === " ")) {
                                            e.preventDefault()
                                            onRowClick(row.original)
                                        }
                                    }}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })}
                        {paddingBottom > 0 && (
                            <tr>
                                <td style={{ height: `${paddingBottom}px` }} colSpan={columns.length} />
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Page {currentPage + 1} of {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(0)}
                            disabled={currentPage === 0}
                            aria-label="First page"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 0}
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            aria-label="Next page"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(totalPages - 1)}
                            disabled={currentPage === totalPages - 1}
                            aria-label="Last page"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
