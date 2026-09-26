import { useState, useEffect } from 'react'

export function usePersistedState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* storage unavailable — app still works for this session */
    }
  }, [key, state])
  return [state, setState]
}

export function newId(prefix) {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
