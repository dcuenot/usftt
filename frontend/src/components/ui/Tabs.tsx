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
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
    } else if (e.key === 'Home') {
      e.preventDefault()
      newIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      newIndex = tabs.length - 1
    } else {
      return
    }

    onChange(tabs[newIndex].id)
  }

  return (
    <div className="border-b border-gray-200" data-testid="tabs">
      <nav className="-mb-px flex overflow-x-auto snap-x snap-mandatory" role="tablist" aria-label="Tabs">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors snap-start',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
            role="tab"
            aria-selected={activeTab === tab.id}
            tabIndex={activeTab === tab.id ? 0 : -1}
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
                aria-label={`${tab.badge} items`}
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
