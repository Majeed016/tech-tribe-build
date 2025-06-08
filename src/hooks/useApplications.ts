
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

  const createApplication = async (applicationData: {
    project_id: string;
    role: string;
    message: string;
    github_profile?: string;
    portfolio_link?: string;
  }) => {
    if (!user) {
      console.error('User not authenticated')
      throw new Error('User not authenticated')
    }

    console.log('Creating application with data:', applicationData)
    console.log('User:', user)

    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([{
          project_id: applicationData.project_id,
          role: applicationData.role,
          message: applicationData.message,
          github_profile: applicationData.github_profile || null,
          portfolio_link: applicationData.portfolio_link || null,
          applicant_id: user.id,
          applicant_name: user.user_metadata?.full_name || user.email || 'Unknown User',
          status: 'pending'
        }])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Application created successfully:', data)
      
      // Refresh the applications list
      await fetchUserApplications()
      
      return data[0]
    } catch (error) {
      console.error('Error in createApplication:', error)
      throw error
    }
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
