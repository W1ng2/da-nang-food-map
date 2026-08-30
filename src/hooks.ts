import { useCallback, useState } from 'react'

export function useStoredSet(key: string) {
  const [values, setValues] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')) } catch { return new Set() }
  })

  const toggle = useCallback((id: string) => {
    setValues((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      localStorage.setItem(key, JSON.stringify([...next]))
      return next
    })
  }, [key])

  return [values, toggle] as const
}
