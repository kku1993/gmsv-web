import {Container, PageHeading} from '@/components/Page'
import {Empty, EmptyHeader, EmptyTitle, EmptyDescription} from '@/components/ui/empty'

export default function Contact() {
  return (
    <Container>
      <PageHeading title="Contact" />
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Coming soon</EmptyTitle>
          <EmptyDescription>Contact information will be available here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </Container>
  )
}
