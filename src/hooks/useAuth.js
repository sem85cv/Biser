import { useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase.js'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Picks up the result after Google redirects back to the app.
    getRedirectResult(auth).catch((err) => setError(err))

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  function signIn() {
    return signInWithRedirect(auth, googleProvider)
  }
  function signOutUser() {
    return fbSignOut(auth)
  }

  return { user, loading, error, signIn, signOut: signOutUser }
}
