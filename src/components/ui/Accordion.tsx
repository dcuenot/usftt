import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

interface AccordionProps {
  trigger: React.ReactNode
  content: React.ReactNode
  defaultOpen?: boolean
}

export function Accordion({ trigger, content, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-t border-gray-200" data-testid="accordion">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        {trigger}
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-500 transition-transform duration-200',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
        data-testid="accordion-content"
      >
        <div className="pb-4">
          {content}
        </div>
      </div>
    </div>
  )
}
