# 🚀 GitHub Pages Deployment Guide

## 📋 Prerequisites

1. **GitHub Repository**: Your code must be in a GitHub repository
2. **GitHub Pages Enabled**: Pages must be enabled in repository settings
3. **Build Process**: Application must build successfully

## ⚙️ Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**

### 2. Configure Repository Settings

The workflow is already configured in `.github/workflows/deploy.yml` and will:

- ✅ Run tests and linting on every push
- ✅ Build the application
- ✅ Deploy to GitHub Pages on main branch pushes

### 3. Update Base Path (if needed)

The Vite config automatically detects GitHub Pages deployment and sets the
correct base path to `/holloid-assessment-test/`.

If your repository name is different, update line 11 in `vite.config.ts`:

```typescript
base: isGitHubPages ? '/YOUR-REPO-NAME/' : '/',
```

## 🔄 Deployment Process

### Automatic Deployment

- Push to `main` branch automatically triggers deployment
- Workflow runs tests, builds, and deploys
- Site will be available at:
  `https://jotaesteves.github.io/holloid-assessment-test/`

### Manual Deployment

If you need to deploy manually:

```bash
# Build for GitHub Pages
npm run build:gh-pages

# The dist folder contains the built files
# You can manually upload these to GitHub Pages
```

## 📊 Monitoring Deployment

### GitHub Actions

- Go to **Actions** tab in your repository
- Monitor the "Deploy to GitHub Pages" workflow
- Check for any build or deployment errors

### Deployment Status

- Successful deployment shows green checkmark
- Failed deployment shows red X with error details
- Deployment typically takes 2-5 minutes

## 🌐 Accessing Your Site

Once deployed, your Robot Fleet Dashboard will be available at:

```
https://jotaesteves.github.io/holloid-assessment-test/
```

## 🛠️ Troubleshooting

### Common Issues

1. **404 on Navigation**
   - Single Page Applications need proper routing setup
   - GitHub Pages serves static files, so direct URL access may fail

2. **Assets Not Loading**
   - Check that base path is correctly set in `vite.config.ts`
   - Ensure all asset paths are relative

3. **Build Failures**
   - Check GitHub Actions logs for specific errors
   - Run `npm run build` locally to test

4. **Test Failures**
   - All tests must pass for deployment to proceed
   - Fix any failing tests before pushing

### Debugging Steps

1. **Check Workflow Logs**:
   - Go to Actions tab → Select failed workflow → Review logs

2. **Test Locally**:

   ```bash
   npm run build:gh-pages
   npm run preview
   ```

3. **Verify Environment**:
   ```bash
   npm run test:run
   npm run type-check
   npm run lint
   ```

## 🔒 Security Considerations

- Environment variables starting with `VITE_` are exposed to the client
- Don't include sensitive data in client-side environment variables
- The application runs entirely in the browser (static hosting)

## 📈 Performance Optimization

The build is optimized for GitHub Pages with:

- ✅ Code splitting (vendor, UI library chunks)
- ✅ Asset compression
- ✅ Source maps for debugging
- ✅ Bundle size warnings

## 🔄 Updating the Site

1. Make changes to your code
2. Push to the `main` branch
3. GitHub Actions automatically rebuilds and redeploys
4. Changes are live within minutes

Your Robot Fleet Dashboard is now ready for production deployment on GitHub
Pages! 🎉
