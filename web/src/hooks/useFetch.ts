import {useEffect, useState} from 'react'

type State<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

// Minimal data-fetching hook for one-shot Sanity queries. Re-runs when the
// `key` string changes (e.g. a slug from the URL).
export function useFetch<T>(key: string, fetcher: () => Promise<T>): State<T> {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let active = true
    setState({data: null, loading: true, error: null})
    fetcher()
      .then((data) => {
        if (active) setState({data, loading: false, error: null})
      })
      .catch((error: Error) => {
        if (active) setState({data: null, loading: false, error})
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return state
}
