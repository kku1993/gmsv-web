import {Outlet, ScrollRestoration} from 'react-router-dom'
import {Header} from './Header'
import Footer from '@/components/shadcn-studio/blocks/footer-component-01/footer-component-01'

// Shared page shell: static header row + page content. Used by every route.
export function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
