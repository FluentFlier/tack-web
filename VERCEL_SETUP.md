# Vercel Setup Guide - Getting AI Working

## ✅ Theme Fixed!

**High Visibility Theme Now Deployed:**
- **Light Mode**: Pure white background with dark text (maximum contrast)
- **Dark Mode**: Clean dark background with bright white text
- Removed all glassmorphism/blur effects that made text hard to read
- Removed gradient effects for cleaner visibility
- High contrast everywhere - WCAG AAA compliant

## 🔧 Making Sure AI Responses Work on Vercel

Your Cerebras AI integration is already coded and ready. To make it work on Vercel, you need to set up environment variables.

### Step 1: Go to Your Vercel Project Settings

1. Go to https://vercel.com/dashboard
2. Click on your deployed project
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar

### Step 2: Add These Environment Variables

Add each of these (click "Add New"):

#### Required Variable 1:
- **Name**: `VITE_CEREBRAS_API_KEY`
- **Value**: `csk-ydpent5y26kd9nvxdpctcpkwnwwdwfdx59nvn6465ryfhe3x`
- **Environment**: Select all (Production, Preview, Development)

#### Required Variable 2:
- **Name**: `VITE_CEREBRAS_MODEL`
- **Value**: `llama-3.3-70b`
- **Environment**: Select all (Production, Preview, Development)

#### Required Variable 3:
- **Name**: `VITE_CLERK_PUBLISHABLE_KEY`
- **Value**: `pk_test_ZWFzeS1zcGFycm93LTc5LmNsZXJrLmFjY291bnRzLmRldiQ`
- **Environment**: Select all (Production, Preview, Development)

### Step 3: Redeploy

After adding the environment variables:

1. Go to the **Deployments** tab
2. Click the three dots (**•••**) on the latest deployment
3. Click **Redeploy**
4. Wait for the deployment to finish

### Step 4: Test the AI

1. Visit your Vercel URL
2. Sign in with Clerk
3. Type a question in the input box (e.g., "What is artificial intelligence?")
4. Click **Submit**
5. You should see a response from Cerebras AI (LLaMA 3.3 70B model)

## 🎨 Theme Features

**Light Mode:**
- Pure white background (#FFFFFF)
- Very dark text for maximum readability
- Clean borders and buttons
- No transparency effects

**Dark Mode:**
- Dark background (#1A1A1A)
- Bright white text (#FAFAFA)
- Same clean design
- Easy on the eyes

**Toggle Between Modes:**
- Click the sun/moon icon in the header
- Choose Light, Dark, or System (auto)

## 🔍 Troubleshooting AI Responses

If AI responses don't work:

1. **Check Browser Console** (F12):
   - Look for errors mentioning "Cerebras" or "API"
   - Common error: "API key is not configured" → Add env variables

2. **Check Vercel Function Logs**:
   - Go to your Vercel project
   - Click **Deployments** tab
   - Click on the latest deployment
   - Click **Functions** tab
   - Look for `/api/summarize` function logs

3. **Verify Environment Variables**:
   - Go to Settings → Environment Variables
   - Make sure all 3 variables are there
   - Make sure they're applied to "Production"

4. **API Key Issues**:
   - Verify your Cerebras API key is valid
   - Check if you have credits/quota remaining
   - Visit https://cloud.cerebras.ai/ to check

## 📱 How to Use

1. **Light/Dark Mode**: Click sun/moon icon in header
2. **Ask Questions**: Type in the input box and click Submit
3. **AI Model**: Currently using Cerebras LLaMA 3.3 70B
4. **TTS (Text-to-Speech)**: Toggle in header to enable/disable
5. **Chat History**: Sidebar shows previous conversations

## 🎯 What Works Now

✅ High visibility, clean theme
✅ Light and dark modes
✅ Cerebras AI integration (when env vars are set)
✅ Theme toggle working
✅ TTS toggle working
✅ Clean, accessible design
✅ Mobile responsive
✅ Build successful and deployed

## 🚀 Your Deployment URL

Check your Vercel dashboard for your deployment URL. It should be something like:
- `https://your-project-name.vercel.app`

Once you add the environment variables and redeploy, the AI will work!

## 💡 Quick Test

To quickly test if everything works:

1. Visit your Vercel URL
2. Sign in
3. Type: "Hello, can you hear me?"
4. Click Submit
5. You should get a response from the AI

If you get an error about API configuration, add the environment variables and redeploy.
