import { useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase.js'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  function signIn() {
    return signInWithPopup(auth, googleProvider)
  }
  function signOutUser() {
    return fbSignOut(auth)
  }

  return { user, loading, signIn, signOut: signOutUser }
}
