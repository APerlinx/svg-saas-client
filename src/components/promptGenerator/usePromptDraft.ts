import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

export function usePromptDraft<T>(
  storageKey: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const saved = sessionStorage.getItem(storageKey)
    if (!saved) return initialValue

    try {
      return JSON.parse(saved) as T
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(value))
  }, [storageKey, value])

  return [value, setValue]
}
