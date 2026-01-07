# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/743521ad-62c0-4bf4-90db-a52839df4c3e

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/743521ad-62c0-4bf4-90db-a52839df4c3e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Deploy to Vercel (Recommended)

This project is configured for Vercel deployment with Cerebras AI integration.

1. **Quick Deploy**:
   - Fork this repository
   - Import it to Vercel at https://vercel.com/new
   - Add the required environment variables (see below)
   - Click Deploy

2. **Detailed Instructions**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide

### Required Environment Variables

Set these in your Vercel project settings:

- `VITE_CEREBRAS_API_KEY` - Your Cerebras API key (get it from https://cloud.cerebras.ai/)
- `VITE_CEREBRAS_MODEL` - Model to use (default: `llama-3.3-70b`)
- `VITE_CLERK_PUBLISHABLE_KEY` - Your Clerk authentication key

### Alternative: Deploy via Lovable

You can also open [Lovable](https://lovable.dev/projects/743521ad-62c0-4bf4-90db-a52839df4c3e) and click on Share -> Publish.

## Features

- **AI-Powered Text Analysis** using Cerebras AI (LLaMA 3.3 70B model)
- **URL Content Summarization** - Analyze content from any URL
- **Chat History** - Keep track of your conversations
- **Authentication** via Clerk
- **Text-to-Speech** support for accessibility
- **Dark/Light Mode** theme support

## I want to use a custom domain - is that possible?

Vercel supports custom domains. After deploying to Vercel, go to your project settings and add your custom domain. See [Vercel's custom domain documentation](https://vercel.com/docs/concepts/projects/custom-domains) for details.
