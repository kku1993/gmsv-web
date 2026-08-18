import {Outlet, ScrollRestoration} from 'react-router-dom'
import {Header} from './Header'

// Shared page shell: static header row + page content. Used by every route.
export function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          GMSV
        </div>
      </footer>
      <ScrollRestoration />
    </div>
  )
}
