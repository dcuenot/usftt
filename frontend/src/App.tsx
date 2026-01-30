import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Layout } from './components/layout/Layout'
import { LoadingBar } from './components/ui/LoadingBar'
import { ToastProvider } from './components/ui/Toast'

// Lazy load page components for code splitting
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const ClassementPage = lazy(() => import('./pages/ClassementPage').then(m => ({ default: m.ClassementPage })))
const EquipesPage = lazy(() => import('./pages/EquipesPage').then(m => ({ default: m.EquipesPage })))
const TestsPage = lazy(() => import('./pages/TestsPage').then(m => ({ default: m.TestsPage })))

// Use dynamic basename: /usftt in production, / in dev/test
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

function App() {
  return (
    <ToastProvider>
      <ErrorBoundary>
        <BrowserRouter basename={basename}>
          <Suspense fallback={<LoadingBar />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="classement" element={<ClassementPage />} />
                <Route path="equipes" element={<EquipesPage />} />
                <Route path="tests" element={<TestsPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </ToastProvider>
  )
}

export default App
