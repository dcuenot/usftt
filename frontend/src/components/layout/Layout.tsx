import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { MobileNav } from './MobileNav'
import { PageTransition } from '../PageTransition'

export function Layout() {
  return (
    <div className="min-h-screen pb-16 lg:pb-0">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-5">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <MobileNav />
    </div>
  )
}
