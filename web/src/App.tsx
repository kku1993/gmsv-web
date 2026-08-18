import {createBrowserRouter, Navigate} from 'react-router-dom'
import {Layout} from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Mission from './pages/Mission'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Podcasts from './pages/Podcasts'
import PodcastDetail from './pages/PodcastDetail'
import Sponsors from './pages/Sponsors'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {path: '/', element: <Home />},
      {path: '/about', element: <About />},
      {path: '/mission', element: <Mission />},
      {path: '/events', element: <Events />},
      {path: '/events/:slug', element: <EventDetail />},
      {path: '/podcasts', element: <Podcasts />},
      {path: '/podcasts/:slug', element: <PodcastDetail />},
      {path: '/sponsors', element: <Sponsors />},
      {path: '/contact', element: <Contact />},
      {path: '/404', element: <NotFound />},
      {path: '*', element: <Navigate to="/404" replace />},
    ],
  },
])
