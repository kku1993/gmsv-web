import {Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import PageDetail from './pages/PageDetail'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:slug" element={<PageDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
