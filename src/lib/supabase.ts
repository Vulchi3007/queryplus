import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Not set')
console.log('Supabase Key:', supabaseAnonKey ? 'Set' : 'Not set')

// Validate Supabase URL format
const isValidSupabaseUrl = (url: string) => {
  if (!url) return false
  if (url.includes('your_supabase_project_url') || url.includes('your-project')) return false
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'https:' && urlObj.hostname.includes('supabase')
  } catch {
    return false
  }
}

// Validate Supabase key format
const isValidSupabaseKey = (key: string) => {
  if (!key) return false
  if (key.includes('your_supabase_anon_key') || key.includes('your-actual')) return false
  return key.length > 20 // Basic length check
}

// Create Supabase client
export const supabase = isValidSupabaseUrl(supabaseUrl) && isValidSupabaseKey(supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false // For anonymous usage
      }
    })
  : null

// Test connection
if (supabase) {
  supabase.from('users').select('count', { count: 'exact', head: true })
    .then(({ error, count }) => {
      if (error) {
        console.error('Supabase connection error:', error)
      } else {
        console.log('Supabase connected successfully. Users count:', count)
      }
    })
}

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
    console.error('Supabase not configured - user data not saved')
    // Return mock data for development when Supabase is not configured
    const mockUser: UserData = {
      id: `mock-${Date.now()}`,
      ...userData,
      created_at: new Date().toISOString()
    }
    console.log('Using mock user data:', mockUser)
    return mockUser
  }

  console.log('Inserting user data:', userData)

  try {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()

    if (error) {
      console.error('Error inserting user data:', error)
      throw error
    }

    console.log('User data inserted successfully:', data)
    return data
  } catch (error) {
    console.error('Failed to insert user data:', error)
    // Return mock data for development
    throw error
  }
}

// Insert analysis record
export const insertAnalysisRecord = async (
  analysisData: Omit<AnalysisRecord, 'id' | 'created_at'>,
  imageFile?: File
) => {
  if (!supabase) {
    console.error('Supabase not configured - analysis record not saved')
    // Return mock data for development when Supabase is not configured
    const mockRecord: AnalysisRecord = {
      id: `mock-analysis-${Date.now()}`,
      ...analysisData,
      created_at: new Date().toISOString()
    }
    console.log('Using mock analysis record:', mockRecord)
    return mockRecord
  }

  console.log('Inserting analysis record:', analysisData)

  try {
    // Return mock data for development
    let imageUrl = null
    let imageName = null

    // Upload image to Supabase Storage if provided
    if (imageFile) {
      console.log('Uploading image to storage...')
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
        console.log('Image uploaded successfully:', uploadData)
        // Get public URL for the uploaded image
        const { data: urlData } = supabase.storage
          .from('medical-images')
          .getPublicUrl(filePath)
        
        imageUrl = urlData.publicUrl
        console.log('Image URL:', imageUrl)
      }
    }

    const recordData = {
      ...analysisData,
      image_url: imageUrl,
      image_name: imageName
    }

    console.log('Inserting analysis record with data:', recordData)

    const { data, error } = await supabase
      .from('analysis_records')
      .insert([recordData])
      .select()
      .single()

    if (error) {
      console.error('Error inserting analysis record:', error)
      throw error
    }

    console.log('Analysis record inserted successfully:', data)
    return data
  } catch (error) {
    console.error('Failed to insert analysis record:', error)
    throw error
  }
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