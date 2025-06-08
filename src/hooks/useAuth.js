
import { useState, useEffect } from 'react'
import { supabase } from '../integrations/supabase/client'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) {
        console.error('Signup error:', error)
        return { data: null, error }
      }
      
      console.log('Signup successful:', data)
      return { data, error: null }
    } catch (error) {
      console.error('Signup exception:', error)
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Signin error:', error)
        return { data: null, error }
      }
      
      console.log('Signin successful:', data)
      return { data, error: null }
    } catch (error) {
      console.error('Signin exception:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Signout error:', error)
      }
      // Clear local state immediately
      setUser(null)
      setSession(null)
      return { error }
    } catch (error) {
      console.error('Signout exception:', error)
      return { error }
    }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  }
}
