import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { ThemeToggle } from '../ui/ThemeToggle'

export function Navbar() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)

  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        'bg-white dark:bg-gray-900 mb-4 hidden lg:block sticky top-0 z-40 transition-all duration-300',
        'border-b border-gray-200 dark:border-gray-800',
        isScrolled ? 'shadow-md dark:shadow-gray-950/30' : 'shadow-sm dark:shadow-gray-950/10'
      )}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div
          className={cn(
            'flex items-center justify-between gap-4 transition-all duration-300',
            isScrolled ? 'h-14' : 'h-16'
          )}
        >
          <Link to="/" className="flex items-center gap-3 group" aria-label="USFTT Home">
            <img
              src="/usftt/logo/usftt-logo.png"
              alt="USFTT Logo"
              className={cn(
                'w-auto transition-all duration-300 group-hover:scale-105',
                isScrolled ? 'h-8' : 'h-10'
              )}
              onError={(e) => {
                // Fallback to text if logo doesn't exist
                e.currentTarget.style.display = 'none'
                const textFallback = e.currentTarget.nextElementSibling
                if (textFallback) {
                  textFallback.classList.remove('hidden')
                }
              }}
            />
            <span className="text-xl font-semibold text-gray-900 dark:text-gray-100 hidden">USFTT</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex space-x-2">
              <Link
                to="/"
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive('/')
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
                )}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                Accueil
              </Link>
              <Link
                to="/classement"
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive('/classement')
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
                )}
                aria-current={isActive('/classement') ? 'page' : undefined}
              >
                Classement individuel
              </Link>
              <Link
                to="/equipes"
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive('/equipes')
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
                )}
                aria-current={isActive('/equipes') ? 'page' : undefined}
              >
                Résultats par équipes
              </Link>
              <Link
                to="/tests"
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive('/tests')
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
                )}
                aria-current={isActive('/tests') ? 'page' : undefined}
              >
                Tests
              </Link>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
