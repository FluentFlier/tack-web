# Vercel Deployment Guide

This guide will help you deploy the Tack Insight Web Browser to Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Cerebras API key
- Clerk publishable key (for authentication)

## Environment Variables

You'll need to set the following environment variables in your Vercel project settings:

### Required Variables

1. **VITE_CEREBRAS_API_KEY**
   - Your Cerebras API key
   - Get it from: https://cloud.cerebras.ai/
   - Example: `csk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

2. **VITE_CEREBRAS_MODEL**
   - The Cerebras model to use
   - Default: `llama-3.3-70b`
   - You can use other available models from Cerebras

3. **VITE_CLERK_PUBLISHABLE_KEY**
   - Your Clerk publishable key for authentication
   - Get it from: https://dashboard.clerk.com/
   - Example: `pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will automatically detect it's a Vite project
4. Add the environment variables listed above in the "Environment Variables" section
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from the project root:
   ```bash
   vercel
   ```

4. Follow the prompts and set up your environment variables when asked

5. For production deployment:
   ```bash
   vercel --prod
   ```

## Setting Environment Variables in Vercel

1. Go to your project in the Vercel dashboard
2. Click on "Settings"
3. Click on "Environment Variables"
4. Add each variable:
   - Name: `VITE_CEREBRAS_API_KEY`
   - Value: Your Cerebras API key
   - Environment: Production, Preview, Development (select all)
5. Repeat for other variables
6. Redeploy your project for changes to take effect

## Vercel Configuration

The project includes a `vercel.json` file that configures:
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite
- API routes rewrites for serverless functions

## API Routes

The `/api/summarize` endpoint is implemented as a Vercel serverless function to securely handle Cerebras API calls. The API key is kept server-side and not exposed to the client.

## Testing Your Deployment

After deployment:

1. Visit your Vercel deployment URL
2. Sign in with Clerk authentication
3. Try submitting a question or URL to test the Cerebras API integration
4. Check the Vercel function logs if you encounter any issues

## Troubleshooting

### Build Fails
- Check that all dependencies are listed in `package.json`
- Verify Node.js version compatibility (Node 18+ recommended)

### API Calls Fail
- Verify environment variables are set correctly in Vercel
- Check Vercel function logs for error messages
- Ensure your Cerebras API key is valid and has credits

### Authentication Issues
- Verify Clerk publishable key is correct
- Check Clerk dashboard for any domain restrictions
- Add your Vercel domain to Clerk's allowed origins

## Support

For issues:
- Vercel documentation: https://vercel.com/docs
- Cerebras documentation: https://cerebras.ai/docs
- Clerk documentation: https://clerk.com/docs
