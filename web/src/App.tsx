import {Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import PageDetail from './pages/PageDetail'
import {LOCALES, DEFAULT_LOCALE} from './sanity/i18n'
import './App.css'

function App() {
  // Static routes for each non-default locale. Static segments outrank
  // dynamic `:slug` in React Router v6, so `/zh-Hant` won't collide with
  // `/:slug`. Add locales to LOCALES and they get a route automatically.
  const nonDefaultLocales = LOCALES.filter((l) => l.id !== DEFAULT_LOCALE)

  return (
    <Routes>
      {/* Default locale (en) at root */}
      <Route path="/" element={<Home />} />
      <Route path="/:slug" element={<PageDetail />} />

      {/* Non-default locales, prefixed */}
      {nonDefaultLocales.map((l) => (
        <Route key={l.id} path={`/${l.id}`} element={<Home />} />
      ))}
      {nonDefaultLocales.map((l) => (
        <Route key={l.id} path={`/${l.id}/:slug`} element={<PageDetail />} />
      ))}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
