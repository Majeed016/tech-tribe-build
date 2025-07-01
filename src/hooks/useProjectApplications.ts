
import { useState, useEffect } from 'react'
import { supabase } from '../integrations/supabase/client'
import { useAuth } from './useAuth'

export const useProjectApplications = () => {
  const [projectApplications, setProjectApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchProjectApplications = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          projects(title, author_id)
        `)
        .eq('projects.author_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjectApplications(data || [])
    } catch (error) {
      console.error('Error fetching project applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', applicationId)
        .select()

      if (error) throw error
      
      // Refresh the applications list
      await fetchProjectApplications()
      
      return data[0]
    } catch (error) {
      console.error('Error updating application status:', error)
      throw error
    }
  }

  useEffect(() => {
    if (user) {
      fetchProjectApplications()
    }
  }, [user])

  return {
    projectApplications,
    loading,
    updateApplicationStatus,
    refetchProjectApplications: fetchProjectApplications
  }
}
