import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/cn'

export interface ResponsiveColumnDef<T> extends ColumnDef<T> {
  priority?: 'high' | 'medium' | 'low'
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: ResponsiveColumnDef<T>[]
  defaultSorting?: SortingState
  mobileCard?: (row: T) => React.ReactNode
}

export function ResponsiveTable<T>({
  data,
  columns,
  defaultSorting = [],
  mobileCard,
}: ResponsiveTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')

  // Filter columns based on screen size and priority
  const visibleColumns = columns.filter((col) => {
    if (!col.priority) return true
    if (isMobile) return col.priority === 'high'
    if (isTablet) return col.priority !== 'low'
    return true
  })

  const table = useReactTable({
    data,
    columns: visibleColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  // Show mobile cards if provided and on mobile
  if (isMobile && mobileCard) {
    return (
      <div className="grid grid-cols-1 gap-4" data-testid="responsive-table-mobile">
        {data.map((row, index) => (
          <div key={index}>{mobileCard(row)}</div>
        ))}
      </div>
    )
  }

  // Show table
  return (
    <div className="overflow-x-auto" data-testid="responsive-table">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200',
                    header.column.getCanSort() &&
                      'cursor-pointer select-none hover:bg-gray-200 transition-colors'
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getCanSort() && (
                      <span className="text-primary">
                        {header.column.getIsSorted() === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4 opacity-30" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={visibleColumns.length}
                className="px-4 py-8 text-center text-gray-500"
              >
                Aucune donnée à afficher
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 border-b border-gray-200 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
