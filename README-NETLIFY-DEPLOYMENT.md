# Netlify Deployment Guide for QurePlus

## Quick Deployment Steps

### Option 1: Drag & Drop (Easiest)
1. Run `npm run build` locally
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist` folder to the deploy area

### Option 2: Git Integration (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Set these build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 18

### Option 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

## Required Environment Variables

Add these in Netlify Dashboard → Site Settings → Environment Variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key (optional)
```

## Build Configuration

The project includes:
- `netlify.toml` - Main Netlify configuration
- `_redirects` - SPA routing support
- Optimized build settings for React/Vite

## Features Included

✅ AI-powered varicose vein analysis
✅ User data collection and storage
✅ Image upload and processing
✅ Admin dashboard
✅ Responsive design
✅ Supabase database integration
✅ Professional medical reporting

## Post-Deployment

1. Test the analysis flow
2. Verify Supabase connection
3. Check admin dashboard at `/admin`
4. Ensure all environment variables are working

## Support

If you encounter issues:
1. Check build logs in Netlify dashboard
2. Verify environment variables are set
3. Ensure Supabase is properly configured