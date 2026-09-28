import { useEffect, useState } from 'react'
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.js'

// `enabled` must be false until Firebase Auth has confirmed a signed-in user —
// otherwise the very first snapshot attempt fires before the ID token exists,
// Firestore rejects it as permission-denied, and (since a Firestore listener
// stops itself after an error) it never automatically retries even once the
// user is signed in a moment later.
export function useFirestoreCollection(name, enabled) {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!enabled) {
      setDocs([])
      setError(null)
      setLoading(true)
      return
    }
    setLoading(true)
    setError(null)
    const unsub = onSnapshot(
      collection(db, name),
      (snap) => {
        setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
    return unsub
  }, [name, enabled])

  async function add(data) {
    await addDoc(collection(db, name), data)
  }
  async function update(id, data) {
    await updateDoc(doc(db, name, id), data)
  }
  async function remove(id) {
    await deleteDoc(doc(db, name, id))
  }

  return { docs, loading, error, add, update, remove }
}
