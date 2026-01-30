import { cn } from '@/utils/cn'

interface FilterPanelProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export function FilterPanel({ children, title, className }: FilterPanelProps) {
  return (
    <div
      className={cn('card-elevated p-6 animate-fadeIn', className)}
      data-testid="filter-panel"
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="h-1 w-8 bg-primary rounded-full" />
          {title}
        </h3>
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        {children}
      </div>
    </div>
  )
}
