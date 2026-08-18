import {Link } from 'react-router-dom'
import {Button} from '@/components/ui/button'
import {Container} from '@/components/Page'

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button render={<Link to="/" />} className="mt-6">
        Back to home
      </Button>
    </Container>
  )
}
