
import { useState, useEffect } from 'react'
import { supabase } from '../integrations/supabase/client'
import { useAuth } from './useAuth'

export const useApplications = () => {
  const [userApplications, setUserApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchUserApplications = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          projects(title)
        `)
        .eq('applicant_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setUserApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const createApplication = async (applicationData) => {
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('applications')
      .insert([{
        ...applicationData,
        applicant_id: user.id,
        applicant_name: user.user_metadata?.full_name || user.email
      }])
      .select()

    if (error) throw error
    return data[0]
  }

  useEffect(() => {
    if (user) {
      fetchUserApplications()
    }
  }, [user])

  return {
    userApplications,
    loading,
    createApplication,
    refetchApplications: fetchUserApplications
  }
}
