import { useEffect, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import { DEFAULT_CATEGORIES } from '../utils/categories.js'

const DEFAULTS = { categories: DEFAULT_CATEGORIES, rate: 0 }

export function useSettingsDoc() {
  const [data, setData] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ref = doc(db, 'settings', 'app')
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setData({ ...DEFAULTS, ...snap.data() })
        } else {
          setDoc(ref, DEFAULTS).catch(() => {})
        }
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
    return unsub
  }, [])

  async function save(patch) {
    await setDoc(doc(db, 'settings', 'app'), patch, { merge: true })
  }

  return { categories: data.categories, rate: data.rate, loading, error, save }
}
