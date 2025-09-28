# 🚀 Deployment Guide

This guide helps you deploy the demo Next.js application to showcase your Sanity e-commerce starter.

## Quick Deploy to Vercel

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAhmed-KHI%2Fsanity-starter-kit&project-name=sanity-ecommerce-demo&repository-name=sanity-ecommerce-demo&demo-title=Sanity%20E-Commerce%20Demo&demo-description=A%20demo%20e-commerce%20site%20built%20with%20Sanity%20and%20Next.js&demo-url=https%3A%2F%2Fsanity-ecommerce-demo.vercel.app&root-directory=example-nextjs)

### Manual Steps (Recommended)
1. **Fork this repository**
2. **Connect to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your forked repository
   - **🚨 CRITICAL:** In "Configure Project" → Set **Root Directory** to `example-nextjs`
   - Click "Continue"

3. **Configure Environment Variables:**
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production  
   NEXT_PUBLIC_DEMO_MODE=true
   ```
   
4. **Deploy**
   - Click "Deploy" 
   - Wait for build to complete
   - Your demo will be live!

## 📋 Step-by-Step Visual Guide

### Root Directory Configuration
When importing to Vercel, you'll see this screen:

```
┌─────────────────────────────────────────┐
│ Configure Project                       │
├─────────────────────────────────────────┤
│ Framework Preset: Next.js ✓            │
│ Root Directory: [example-nextjs]  ← SET │
│ Build Command: npm run build            │
│ Output Directory: .next                 │
└─────────────────────────────────────────┘
```

**🚨 Make sure "Root Directory" shows `example-nextjs`**

### Environment Variables Screen
```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│ NEXT_PUBLIC_DEMO_MODE = true           │
│ NEXT_PUBLIC_SANITY_PROJECT_ID = (optional) │
│ NEXT_PUBLIC_SANITY_DATASET = production │
└─────────────────────────────────────────┘
```

## Getting Sanity Credentials

### Option 1: Use Demo Mode (Quickest)
Set `NEXT_PUBLIC_DEMO_MODE=true` to use fallback data - perfect for showcasing UI/UX without setting up Sanity.

### Option 2: Connect Real Sanity Project
1. Create account at [sanity.io](https://sanity.io)
2. Create new project
3. Use the Project ID from your project settings
4. Import the schemas from this starter kit

## Alternative Platforms

### Netlify
1. Connect repository
2. Set Build directory: `example-nextjs`
3. Build command: `cd example-nextjs && npm run build`
4. Publish directory: `example-nextjs/.next`

### Railway
```bash
# In example-nextjs directory
railway login
railway init
railway add --service
railway up
```

### Docker (Self-hosted)
```dockerfile
# See example-nextjs/Dockerfile for container setup
docker build -t sanity-ecommerce-demo ./example-nextjs
docker run -p 3000:3000 sanity-ecommerce-demo
```

## Custom Domain Setup

1. **Purchase domain** (Namecheap, GoDaddy, etc.)
2. **Configure in Vercel:**
   - Project Settings → Domains
   - Add custom domain
   - Follow DNS configuration steps
3. **Update README** with your live demo URL

## Performance Tips

- Enable Vercel Analytics for usage insights
- Set up monitoring with Vercel Speed Insights  
- Consider CDN for images if using many product photos
- Use Sanity's Image API for optimized images

## Troubleshooting

**Build fails:** Check that root directory is set to `example-nextjs`
**Environment issues:** Verify all required env vars are set
**Sanity connection:** Test with demo mode first, then add real credentials
**TypeScript errors:** Run `npm run typecheck` locally first

---
*Need help? Open an issue or check the [example-nextjs/README.md](./example-nextjs/README.md) for detailed instructions.*