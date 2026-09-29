import {
  useDocumentOperation,
  type DocumentActionComponent,
  type DocumentActionProps,
} from 'sanity'
import {slugify} from '../utils/slugify'

// Rewrites slug.current on every publish as `<slugified-title>-<8 hex chars>`,
// e.g. "annual-fundraiser-3f8a2b1c". Wraps the built-in publish action so its
// validation gating and confirm dialog still apply.
export function slugOnPublish(originalAction: DocumentActionComponent): DocumentActionComponent {
  const WrappedAction: DocumentActionComponent = (props: DocumentActionProps) => {
    const originalResult = originalAction(props)
    const {patch} = useDocumentOperation(props.id, props.type)

    if (!originalResult) return originalResult

    return {
      ...originalResult,
      onHandle: () => {
        const title = props.draft?.title ?? props.published?.title
        const base = slugify(typeof title === 'string' ? title : '') || 'untitled'
        const suffix = crypto.randomUUID().slice(0, 8)
        patch.execute([{set: {slug: {_type: 'slug', current: `${base}-${suffix}`}}}])
        originalResult.onHandle?.()
      },
    }
  }
  WrappedAction.action = 'publish'
  WrappedAction.displayName = 'SlugOnPublishAction'
  return WrappedAction
}
