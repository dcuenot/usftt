interface FilterPanelProps {
  children: React.ReactNode
  title?: string
}

export function FilterPanel({ children, title }: FilterPanelProps) {
  return (
    <div className="bg-white rounded-card p-4 shadow-card" data-testid="filter-panel">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        {children}
      </div>
    </div>
  )
}
