
import { useState, useEffect } from 'react'
import { supabase } from '../integrations/supabase/client'
import { useAuth } from './useAuth'

export const useRatings = () => {
  const [ratings, setRatings] = useState([])
  const [userStats, setUserStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchUserRatings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('project_ratings')
        .select(`
          *,
          projects(title),
          rater_id
        `)
        .eq('rated_user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching ratings:', error)
      return []
    }
  }

  const fetchUserStats = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_rating_stats')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return null
    }
  }

  const submitRating = async (projectId: string, ratedUserId: string, rating: number, feedback?: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('project_ratings')
        .insert({
          project_id: projectId,
          rater_id: user.id,
          rated_user_id: ratedUserId,
          rating,
          feedback: feedback || null
        })
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error submitting rating:', error)
      throw error
    }
  }

  const getProjectTeammates = async (projectId: string) => {
    if (!user) return []

    try {
      // Get project owner
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('author_id, author_name')
        .eq('id', projectId)
        .single()

      if (projectError) throw projectError

      // Get approved applicants
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('applicant_id, applicant_name')
        .eq('project_id', projectId)
        .eq('status', 'approved')

      if (appError) throw appError

      const teammates = []
      
      // Add project owner if it's not the current user
      if (project.author_id !== user.id) {
        teammates.push({
          id: project.author_id,
          name: project.author_name,
          role: 'Project Owner'
        })
      }

      // Add approved applicants (excluding current user)
      applications?.forEach(app => {
        if (app.applicant_id !== user.id) {
          teammates.push({
            id: app.applicant_id,
            name: app.applicant_name,
            role: 'Team Member'
          })
        }
      })

      return teammates
    } catch (error) {
      console.error('Error fetching teammates:', error)
      return []
    }
  }

  const checkExistingRating = async (projectId: string, ratedUserId: string) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('project_ratings')
        .select('*')
        .eq('project_id', projectId)
        .eq('rater_id', user.id)
        .eq('rated_user_id', ratedUserId)
        .maybeSingle()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error checking existing rating:', error)
      return null
    }
  }

  return {
    ratings,
    userStats,
    loading,
    fetchUserRatings,
    fetchUserStats,
    submitRating,
    getProjectTeammates,
    checkExistingRating
  }
}
