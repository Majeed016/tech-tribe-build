
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
    if (!user) {
      console.log('No user found')
      return []
    }

    try {
      console.log('Fetching teammates for project:', projectId, 'current user:', user.id)
      
      // Get project details
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('author_id, author_name')
        .eq('id', projectId)
        .single()

      if (projectError) {
        console.error('Error fetching project:', projectError)
        throw projectError
      }

      console.log('Project data:', project)

      // Get ALL applications for this project (not just approved ones initially)
      const { data: allApplications, error: appError } = await supabase
        .from('applications')
        .select('applicant_id, applicant_name, role, status')
        .eq('project_id', projectId)

      if (appError) {
        console.error('Error fetching applications:', appError)
        throw appError
      }

      console.log('All applications:', allApplications)

      // Filter for approved applications
      const approvedApplications = allApplications?.filter(app => app.status === 'approved') || []
      console.log('Approved applications:', approvedApplications)

      const teammates = []
      
      // Check if current user is the project owner
      const isProjectOwner = project.author_id === user.id
      console.log('Is current user project owner?', isProjectOwner)
      
      // Check if current user is an approved applicant
      const currentUserApplication = approvedApplications.find(app => app.applicant_id === user.id)
      const isApprovedApplicant = !!currentUserApplication
      console.log('Is current user approved applicant?', isApprovedApplicant, currentUserApplication)
      
      if (isProjectOwner) {
        // If current user is project owner, they can rate all approved applicants
        approvedApplications.forEach(app => {
          teammates.push({
            id: app.applicant_id,
            name: app.applicant_name,
            role: app.role
          })
        })
        console.log('Project owner can rate:', teammates.length, 'teammates')
      } else if (isApprovedApplicant) {
        // If current user is an approved applicant, they can rate the project owner and other approved applicants
        
        // Add project owner as teammate
        teammates.push({
          id: project.author_id,
          name: project.author_name,
          role: 'Project Owner'
        })
        
        // Add other approved applicants (excluding current user)
        approvedApplications.forEach(app => {
          if (app.applicant_id !== user.id) {
            teammates.push({
              id: app.applicant_id,
              name: app.applicant_name,
              role: app.role
            })
          }
        })
        console.log('Approved applicant can rate:', teammates.length, 'teammates')
      } else {
        console.log('Current user is neither project owner nor approved applicant')
      }

      console.log('Final teammates list:', teammates)
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
