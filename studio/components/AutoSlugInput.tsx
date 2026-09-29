import {useEffect, useRef} from 'react'
import {PatchEvent, set, unset, useFormValue, type Path, type SlugInputProps} from 'sanity'

const DEFAULT_MAX_LENGTH = 96
const DEBOUNCE_MS = 300

function defaultSlugify(input: string, maxLength: number): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining marks (U+0300–U+036F)
    .toLowerCase()
    .replace(/['"‘’“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '')
}

// Keeps slug.current synced to the source field while the slug is empty or still
// matches a previously generated value. A slug that diverges from the generated
// value (i.e. manually customized) is never overwritten.
export function AutoSlugInput(props: SlugInputProps) {
  const {schemaType, value, onChange} = props
  const options = schemaType.options
  const maxLength = options?.maxLength ?? DEFAULT_MAX_LENGTH
  const sourcePath: Path =
    typeof options?.source === 'string'
      ? [options.source]
      : Array.isArray(options?.source)
        ? options.source
        : ['title']

  const sourceValue = useFormValue(sourcePath)
  const sourceText = typeof sourceValue === 'string' ? sourceValue : ''

  const slugRef = useRef(value?.current ?? '')
  slugRef.current = value?.current ?? ''

  const evaluatedSourceRef = useRef<string | undefined>(undefined)
  const lastGeneratedRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    const timer = setTimeout(() => {
      const toSlug = (input: string) => defaultSlugify(input, maxLength)

      const current = slugRef.current
      const next = toSlug(sourceText)
      const inSync =
        !current ||
        current === lastGeneratedRef.current ||
        current === toSlug(evaluatedSourceRef.current ?? '')

      evaluatedSourceRef.current = sourceText
      if (inSync && next !== current) {
        lastGeneratedRef.current = next
        onChange(PatchEvent.from(next ? set({_type: 'slug', current: next}) : unset()))
      }
    }, DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [sourceText]) // eslint-disable-line react-hooks/exhaustive-deps

  return props.renderDefault(props)
}
