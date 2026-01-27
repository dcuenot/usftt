import { cn } from '@/utils/cn'

export interface Tab {
  id: string
  label: string
  badge?: string | number
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="border-b border-gray-200" data-testid="tabs">
      <nav className="-mb-px flex overflow-x-auto snap-x snap-mandatory" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors snap-start',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            role="tab"
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'ml-2 py-0.5 px-2 rounded-full text-xs font-medium',
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-600'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
