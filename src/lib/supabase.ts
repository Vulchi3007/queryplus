import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Only create Supabase client if both URL and key are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface UserData {
  id?: string
  full_name: string
  age: number
  city: string
  mobile: string
  email?: string
  created_at?: string
}

export interface AnalysisRecord {
  id?: string
  user_id: string
  image_url?: string
  probability?: number
  stage?: string
  reasoning?: string
  created_at?: string
}

// Insert user data
export const insertUserData = async (userData: Omit<UserData, 'id' | 'created_at'>) => {
  if (!supabase) {
    console.warn('Supabase not configured - user data not saved')
    // Return mock data for development
    return { id: 'mock-user-id', ...userData, created_at: new Date().toISOString() }
  }

  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single()

  if (error) {
    console.error('Error inserting user data:', error)
    throw error
  }

  return data
}

// Insert analysis record
export const insertAnalysisRecord = async (analysisData: Omit<AnalysisRecord, 'id' | 'created_at'>) => {
  if (!supabase) {
    console.warn('Supabase not configured - analysis record not saved')
    // Return mock data for development
    return { id: 'mock-analysis-id', ...analysisData, created_at: new Date().toISOString() }
  }

  const { data, error } = await supabase
    .from('analysis_records')
    .insert([analysisData])
    .select()
    .single()

  if (error) {
    console.error('Error inserting analysis record:', error)
    throw error
  }

  return data
}

// Get user analysis history
export const getUserAnalysisHistory = async (userId: string) => {
  if (!supabase) {
    console.warn('Supabase not configured - returning empty history')
    return []
  }

  const { data, error } = await supabase
    .from('analysis_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching analysis history:', error)
    throw error
  }

  return data
}