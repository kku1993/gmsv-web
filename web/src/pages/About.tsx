import {useFetch} from '@/hooks/useFetch'
import {fetchPeople, type Person} from '@/sanity/queries'
import {SanityImage} from '@/components/SanityImage'
import {Container, PageHeading} from '@/components/Page'
import {Skeleton} from '@/components/ui/skeleton'
import {Separator} from '@/components/ui/separator'
import {cn} from '@/lib/utils'

// Display order for role sections. Leadership first, then governance/advisors,
// then staff/interns. Roles not listed here fall after, in alphabetical order.
const ROLE_ORDER = [
  'Chair',
  'Co-President',
  'Vice President',
  'Chief Finance Officer',
  'Secretary General',
  'Board',
  'Impact Specialist',
  'Legal Consultant',
  'Advisor',
  'High School Intern',
] as const

// Turn a role string into a URL-safe anchor id, e.g. "Co-President" →
// "co-president". Stable across renders so the sidebar links resolve.
function sectionId(role: string): string {
  return role
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Group people by role, returning sections in ROLE_ORDER (then alphabetically
// for any roles not explicitly listed). People with no role go into a final
// "Team" section.
function groupByRole(people: Person[]): {role: string; people: Person[]}[] {
  const byRole = new Map<string, Person[]>()
  for (const person of people) {
    const role = person.role?.trim() || 'Team'
    const list = byRole.get(role) ?? []
    list.push(person)
    byRole.set(role, list)
  }

  const known = ROLE_ORDER.filter((r) => byRole.has(r))
  const knownSet = new Set<string>(known)
  const extra = [...byRole.keys()].filter((r) => !knownSet.has(r)).sort()

  return [...known, ...extra]
    .filter((r) => byRole.has(r))
    .map((role) => ({role, people: byRole.get(role)!}))
}

function PersonCard({person}: {person: Person}) {
  const hasUrl = Boolean(person.url)
  const name = person.name ?? 'Untitled'
  const role = person.role ?? ''

  const photo = (
    <SanityImage
      image={person.image}
      alt={name}
      width={400}
      height={400}
      aspect="aspect-square"
      className="w-full rounded-lg"
    />
  )

  const caption = (
    <div className="mt-3 text-center">
      <p className="font-medium leading-tight">{name}</p>
      {role ? <p className="text-sm text-muted-foreground">{role}</p> : null}
    </div>
  )

  const className = cn('group block focus:outline-none')

  if (hasUrl) {
    return (
      <a
        href={person.url ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(className, 'focus-visible:ring-2 focus-visible:ring-ring rounded-lg')}
      >
        {photo}
        {caption}
      </a>
    )
  }
  return (
    <div className={className}>
      {photo}
      {caption}
    </div>
  )
}

function PersonGrid({people}: {people: Person[]}) {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
      {people.map((person) => (
        <PersonCard key={person._id} person={person} />
      ))}
    </div>
  )
}

function PersonSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton className="mx-auto mt-3 h-4 w-24" />
      <Skeleton className="mx-auto mt-1 h-3 w-16" />
    </div>
  )
}

export default function About() {
  const {data: people, loading, error} = useFetch('people', fetchPeople)
  const sections = people && people.length > 0 ? groupByRole(people) : []

  return (
    <Container>
      <PageHeading title="About" />
      {error ? (
        <p className="text-muted-foreground">Unable to load people.</p>
      ) : loading ? (
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({length: 8}).map((_, i) => (
            <PersonSkeleton key={i} />
          ))}
        </div>
      ) : sections.length > 0 ? (
        <div className="flex gap-10">
          {/* Sticky "Jump to" sidebar */}
          <aside className="hidden w-48 shrink-0 md:block">
            <nav className="sticky top-24 flex flex-col gap-1">
              {sections.map(({role}) => (
                <a
                  key={role}
                  href={`#${sectionId(role)}`}
                  className="rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {role}
                </a>
              ))}
            </nav>
          </aside>

          {/* Role sections */}
          <div className="flex min-w-0 flex-1 flex-col gap-12">
            {sections.map(({role, people: group}, i) => (
              <section
                key={role}
                id={sectionId(role)}
                className="flex scroll-mt-24 flex-col gap-6"
              >
                {i > 0 ? <Separator /> : null}
                <h2 className="text-2xl font-semibold tracking-tight">{role}</h2>
                <PersonGrid people={group} />
              </section>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">No people yet.</p>
      )}
    </Container>
  )
}
