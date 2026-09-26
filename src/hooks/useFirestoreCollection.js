import { useEffect, useState } from 'react'
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.js'

export function useFirestoreCollection(name) {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
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
  }, [name])

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
