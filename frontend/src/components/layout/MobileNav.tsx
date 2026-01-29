import { Link, useLocation } from 'react-router-dom'
import { Home, Trophy, Users, Gauge } from 'lucide-react'

export function MobileNav() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 lg:hidden">
      <div className="grid grid-cols-4 text-center">
        <Link
          to="/"
          className={`flex flex-col items-center py-2 text-xs ${
            isActive('/') ? 'text-primary font-bold' : 'text-gray-600'
          }`}
        >
          <Home className="w-6 h-6 mb-1" />
          <span>Accueil</span>
        </Link>
        <Link
          to="/classement"
          className={`flex flex-col items-center py-2 text-xs ${
            isActive('/classement') ? 'text-primary font-bold' : 'text-gray-600'
          }`}
        >
          <Trophy className="w-6 h-6 mb-1" />
          <span>Classement</span>
        </Link>
        <Link
          to="/equipes"
          className={`flex flex-col items-center py-2 text-xs ${
            isActive('/equipes') ? 'text-primary font-bold' : 'text-gray-600'
          }`}
        >
          <Users className="w-6 h-6 mb-1" />
          <span>Équipes</span>
        </Link>
        <Link
          to="/tests"
          className={`flex flex-col items-center py-2 text-xs ${
            isActive('/tests') ? 'text-primary font-bold' : 'text-gray-600'
          }`}
        >
          <Gauge className="w-6 h-6 mb-1" />
          <span>Tests</span>
        </Link>
      </div>
    </nav>
  )
}
