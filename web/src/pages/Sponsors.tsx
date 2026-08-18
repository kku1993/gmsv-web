import {Container, PageHeading} from '@/components/Page'
import {Empty, EmptyHeader, EmptyTitle, EmptyDescription} from '@/components/ui/empty'

export default function Sponsors() {
  return (
    <Container>
      <PageHeading title="Sponsors" />
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Coming soon</EmptyTitle>
          <EmptyDescription>Sponsor information will be available here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </Container>
  )
}
