# Prompt Temple — AI Image Prompt Library

A beautiful, static web page showcasing a curated library of prompt modules for AI image generation. Built with React, Vite, and Tailwind CSS. Designed for deployment on GitHub Pages.

## Features

- 6 prompt module categories (Head & Face, Body & Pose, Arms & Hands, Legs & Feet, Camera Angles, Lighting)
- Interactive prompt builder with live preview and copy-to-clipboard
- 4 ready-made example prompts
- Bilingual support (English + Persian/Farsi RTL)
- Responsive design for mobile and desktop
- Dark theme with animated gradient backgrounds

## Deploy to GitHub Pages

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to GitHub Pages on every push to `main`.

### Steps:

1. Push this code to a GitHub repository
2. Go to **Settings → Pages**
3. Under **Source**, select **GitHub Actions**
4. Push to `main` — the workflow will build and deploy automatically
5. Your site will be live at `https://[username].github.io/[repo-name]/`

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is in the `dist/` folder.
