import { Link, useLocation } from 'react-router-dom'
import { Home, Trophy, Users, Gauge } from 'lucide-react'
import { cn } from '@/utils/cn'

export function MobileNav() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 lg:hidden border-t border-gray-200">
      <div className="grid grid-cols-4 text-center safe-area-inset-bottom">
        <Link
          to="/"
          className={cn(
            'flex flex-col items-center py-3 text-xs transition-all duration-200 relative',
            isActive('/') ? 'text-primary' : 'text-gray-600 active:bg-gray-100'
          )}
        >
          {isActive('/') && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
          )}
          <Home
            className={cn(
              'w-6 h-6 mb-1 transition-all duration-200',
              isActive('/') ? 'scale-110' : 'scale-100'
            )}
          />
          <span className={cn('transition-all duration-200', isActive('/') && 'font-semibold')}>
            Accueil
          </span>
        </Link>
        <Link
          to="/classement"
          className={cn(
            'flex flex-col items-center py-3 text-xs transition-all duration-200 relative',
            isActive('/classement') ? 'text-primary' : 'text-gray-600 active:bg-gray-100'
          )}
        >
          {isActive('/classement') && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
          )}
          <Trophy
            className={cn(
              'w-6 h-6 mb-1 transition-all duration-200',
              isActive('/classement') ? 'scale-110' : 'scale-100'
            )}
          />
          <span
            className={cn('transition-all duration-200', isActive('/classement') && 'font-semibold')}
          >
            Classement
          </span>
        </Link>
        <Link
          to="/equipes"
          className={cn(
            'flex flex-col items-center py-3 text-xs transition-all duration-200 relative',
            isActive('/equipes') ? 'text-primary' : 'text-gray-600 active:bg-gray-100'
          )}
        >
          {isActive('/equipes') && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
          )}
          <Users
            className={cn(
              'w-6 h-6 mb-1 transition-all duration-200',
              isActive('/equipes') ? 'scale-110' : 'scale-100'
            )}
          />
          <span className={cn('transition-all duration-200', isActive('/equipes') && 'font-semibold')}>
            Équipes
          </span>
        </Link>
        <Link
          to="/tests"
          className={cn(
            'flex flex-col items-center py-3 text-xs transition-all duration-200 relative',
            isActive('/tests') ? 'text-primary' : 'text-gray-600 active:bg-gray-100'
          )}
        >
          {isActive('/tests') && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
          )}
          <Gauge
            className={cn(
              'w-6 h-6 mb-1 transition-all duration-200',
              isActive('/tests') ? 'scale-110' : 'scale-100'
            )}
          />
          <span className={cn('transition-all duration-200', isActive('/tests') && 'font-semibold')}>
            Tests
          </span>
        </Link>
      </div>
    </nav>
  )
}
