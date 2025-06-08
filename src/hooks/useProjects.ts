
import { useState, useEffect } from 'react'
import { supabase } from '../integrations/supabase/client'
import { useAuth } from './useAuth'

export const useProjects = () => {
  const [projects, setProjects] = useState([])
  const [userProjects, setUserProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching projects:', error)
        throw error
      }
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProjects = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user projects:', error)
        throw error
      }
      setUserProjects(data || [])
    } catch (error) {
      console.error('Error fetching user projects:', error)
    }
  }

  const createProject = async (projectData: any) => {
    if (!user) {
      console.error('User not authenticated')
      throw new Error('User not authenticated')
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          author_id: user.id,
          author_name: user.user_metadata?.full_name || user.email,
          author_role: user.user_metadata?.role || 'Developer'
        }])
        .select()

      if (error) {
        console.error('Error creating project:', error)
        throw error
      }
      
      console.log('Project created successfully:', data)
      
      // Refresh projects list
      await fetchProjects()
      await fetchUserProjects()
      
      return data[0]
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('author_id', user.id)

      if (error) {
        console.error('Error deleting project:', error)
        throw error
      }
      
      // Refresh projects list
      await fetchProjects()
      await fetchUserProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (user) {
      fetchUserProjects()
    } else {
      setUserProjects([])
    }
  }, [user])

  return {
    projects,
    userProjects,
    loading,
    createProject,
    deleteProject,
    refetchProjects: fetchProjects,
    refetchUserProjects: fetchUserProjects
  }
}
