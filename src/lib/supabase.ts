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
  image_name?: string
  image_url?: string
  probability?: number
  stage?: string
  reasoning?: string
  created_at?: string
}

export interface AnalysisSummary {
  id: string
  full_name: string
  age: number
  city: string
  mobile: string
  email?: string
  user_created_at: string
  total_analyses: number
  last_analysis_date?: string
  avg_probability?: number
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
export const insertAnalysisRecord = async (
  analysisData: Omit<AnalysisRecord, 'id' | 'created_at'>,
  imageFile?: File
) => {
  if (!supabase) {
    console.warn('Supabase not configured - analysis record not saved')
    // Return mock data for development
    return { id: 'mock-analysis-id', ...analysisData, created_at: new Date().toISOString() }
  }

  let imageUrl = null
  let imageName = null

  // Upload image to Supabase Storage if provided
  if (imageFile) {
    imageName = `${Date.now()}-${imageFile.name}`
    const filePath = `analysis-images/${analysisData.user_id}/${imageName}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('medical-images')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      // Continue without image - don't fail the analysis
    } else {
      // Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('medical-images')
        .getPublicUrl(filePath)
      
      imageUrl = urlData.publicUrl
    }
  }

  const { data, error } = await supabase
    .from('analysis_records')
    .insert([{
      ...analysisData,
      image_url: imageUrl,
      image_name: imageName
    }])
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

// Get user analysis summary
export const getUserAnalysisSummary = async () => {
  if (!supabase) {
    console.warn('Supabase not configured - returning empty summary')
    return []
  }

  const { data, error } = await supabase
    .from('user_analysis_summary')
    .select('*')
    .order('user_created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user analysis summary:', error)
    throw error
  }

  return data as AnalysisSummary[]
}

// Get detailed analysis for a specific user
export const getUserDetailedAnalysis = async (userId: string) => {
  if (!supabase) {
    console.warn('Supabase not configured - returning empty data')
    return { user: null, analyses: [] }
  }

  // Get user data
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (userError) {
    console.error('Error fetching user data:', userError)
    throw userError
  }

  // Get user's analysis history
  const { data: analysisData, error: analysisError } = await supabase
    .from('analysis_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (analysisError) {
    console.error('Error fetching analysis data:', analysisError)
    throw analysisError
  }

  return {
    user: userData as UserData,
    analyses: analysisData as AnalysisRecord[]
  }
}

// Create storage bucket for medical images (run this once)
export const createStorageBucket = async () => {
  if (!supabase) {
    console.warn('Supabase not configured')
    return
  }

  const { data, error } = await supabase.storage.createBucket('medical-images', {
    public: false, // Keep images private for medical privacy
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    fileSizeLimit: 10485760 // 10MB limit
  })

  if (error && error.message !== 'Bucket already exists') {
    console.error('Error creating storage bucket:', error)
    throw error
  }

  return data
}