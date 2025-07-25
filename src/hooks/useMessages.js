
import { useState, useEffect } from 'react'
import { supabase } from '../integrations/supabase/client'
import { useAuth } from './useAuth'

export const useMessages = (projectId) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchMessages = async () => {
    if (!projectId) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (messageText) => {
    if (!user || !projectId) throw new Error('User not authenticated or no project')

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        project_id: projectId,
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email,
        message: messageText
      }])
      .select()

    if (error) throw error
    return data[0]
  }

  useEffect(() => {
    fetchMessages()

    if (projectId) {
      // Set up realtime subscription for new messages
      const channel = supabase
        .channel(`messages_${projectId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `project_id=eq.${projectId}`
          },
          (payload) => {
            console.log('New message received:', payload.new)
            setMessages(current => [...current, payload.new])
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [projectId])

  return {
    messages,
    loading,
    sendMessage,
    refetchMessages: fetchMessages
  }
}
