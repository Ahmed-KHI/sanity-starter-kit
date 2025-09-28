# Deploying to Vercel

This directory contains the demo Next.js application that can be deployed to Vercel.

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAhmed-KHI%2Fsanity-starter-kit&project-name=sanity-ecommerce-demo&repository-name=sanity-ecommerce-demo&demo-title=Sanity%20E-Commerce%20Demo&demo-description=A%20demo%20e-commerce%20site%20built%20with%20Sanity%20and%20Next.js&demo-url=https%3A%2F%2Fsanity-ecommerce-demo.vercel.app&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2FAhmed-KHI%2Fsanity-starter-kit%2Fmain%2Fdocs%2Fdemo-screenshot.png&root-directory=example-nextjs)

## Manual Deployment

### 1. Fork this repository

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"  
3. Import your forked repository
4. Set **Root Directory** to `example-nextjs`
5. Configure environment variables (see below)

### 3. Environment Variables
Add these in Vercel dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_DEMO_MODE=true
```

**Getting Sanity Project ID:**
1. Create account at [sanity.io](https://sanity.io)
2. Create new project or use existing
3. Find Project ID in project settings
4. Use `production` dataset (or create one)

### 4. Deploy
- Vercel will automatically build and deploy
- Your demo will be available at `your-project.vercel.app`

## Demo Mode
With `NEXT_PUBLIC_DEMO_MODE=true`, the app works without Sanity data using fallback content, perfect for showcasing the UI and functionality.

## Custom Domain (Optional)
1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update README with your demo URL