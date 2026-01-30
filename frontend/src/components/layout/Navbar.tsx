import { Link, useLocation } from 'react-router-dom'

export function Navbar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-gray-100 mb-4 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/usftt/logo/usftt-logo.png"
              alt="USFTT Logo"
              className="h-10 w-auto transition-transform group-hover:scale-105"
              onError={(e) => {
                // Fallback to text if logo doesn't exist
                e.currentTarget.style.display = 'none'
                const textFallback = e.currentTarget.nextElementSibling
                if (textFallback) {
                  textFallback.classList.remove('hidden')
                }
              }}
            />
            <span className="text-xl font-semibold text-gray-900 hidden">USFTT</span>
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') ? 'font-bold text-primary' : 'text-gray-700 hover:text-primary'
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/classement"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/classement') ? 'font-bold text-primary' : 'text-gray-700 hover:text-primary'
              }`}
            >
              Classement individuel
            </Link>
            <Link
              to="/equipes"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/equipes') ? 'font-bold text-primary' : 'text-gray-700 hover:text-primary'
              }`}
            >
              Résultats par équipes
            </Link>
            <Link
              to="/tests"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/tests') ? 'font-bold text-primary' : 'text-gray-700 hover:text-primary'
              }`}
            >
              Tests
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
