import { useState, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

interface AccordionProps {
  trigger?: ReactNode
  content?: ReactNode
  title?: ReactNode
  children?: ReactNode
  defaultOpen?: boolean
  className?: string
}

export function Accordion({
  trigger,
  content,
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // Support both trigger/content and title/children patterns
  const triggerContent = trigger ?? title
  const bodyContent = content ?? children

  return (
    <div className={cn('border border-gray-200 rounded-lg overflow-hidden', className)} data-testid="accordion">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        {triggerContent}
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ml-2',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
        data-testid="accordion-content"
      >
        <div className="px-4 pb-4">
          {bodyContent}
        </div>
      </div>
    </div>
  )
}
