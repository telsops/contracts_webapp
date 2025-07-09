# Complete GitHub Repository Setup Guide

## Step 1: Prepare Your Local Project

### 1.1 Initialize Git Repository
```bash
git init
```

### 1.2 Create .gitignore file (if not exists)
```bash
echo "node_modules/
dist/
.env
.env.local
*.log
.DS_Store" > .gitignore
```

### 1.3 Add all files to Git
```bash
git add .
git commit -m "Initial commit: Aboitiz Estates Contracts Management System"
```

## Step 2: Create New GitHub Repository

### 2.1 Go to GitHub
- Visit [https://github.com](https://github.com)
- Sign in to your account

### 2.2 Create New Repository
- Click the "+" icon in the top right corner
- Select "New repository"
- Repository name: `contracts-webapp` (or your preferred name)
- Description: "Aboitiz Estates Contracts Management System"
- Set to **Public** (required for GitHub Pages free tier)
- **DO NOT** initialize with README, .gitignore, or license (we already have these)
- Click "Create repository"

## Step 3: Connect Local Repository to GitHub

### 3.1 Add Remote Origin
Replace `yourusername` with your actual GitHub username:
```bash
git remote add origin https://github.com/yourusername/contracts-webapp.git
```

### 3.2 Push to GitHub
```bash
git branch -M main
git push -u origin main
```

## Step 4: Configure GitHub Pages

### 4.1 Enable GitHub Actions
- Go to your repository on GitHub
- Click on "Settings" tab
- In the left sidebar, click "Pages"
- Under "Source", select "GitHub Actions"

### 4.2 The deployment will automatically trigger
- GitHub Actions will build and deploy your site
- Wait for the green checkmark in the "Actions" tab
- Your site will be available at: `https://yourusername.github.io/contracts-webapp`

## Step 5: Verify Your Google Apps Script Configuration

### 5.1 Check Your Apps Script URL
Make sure your Google Apps Script is deployed as a web app:
- Open [Google Apps Script](https://script.google.com)
- Open your project
- Click "Deploy" → "New deployment"
- Choose type: "Web app"
- Execute as: "Me"
- Who has access: "Anyone"
- Click "Deploy"
- Copy the web app URL

### 5.2 Update Constants (if needed)
Your current configuration should work:
```javascript
GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyAYLVDKdlKdetbg6LM0ko8KY05N0gTLblXat7ctvWIft9mJxFqDs9tJoluEFaOHXBD-w/exec'
SPREADSHEET_ID = '1_D84dAt7Yo-xQhsdqMqMo5oDOB8tyitodB-AwY1ZLvY'
DRIVE_FOLDER_ID = '1LX5sGM0WjnVTWTiIyy4F9eh_ttYaMH0X'
```

## Step 6: Test Your Deployment

### 6.1 Wait for Deployment
- Check the "Actions" tab in your GitHub repository
- Wait for the workflow to complete (green checkmark)

### 6.2 Access Your Live Site
- Visit: `https://yourusername.github.io/contracts-webapp`
- Test user registration and login
- Test admin functionality

## Step 7: Making Updates

### 7.1 For Future Changes
```bash
# Make your changes to the code
git add .
git commit -m "Description of your changes"
git push origin main
```

### 7.2 Automatic Redeployment
- Every push to the main branch will automatically trigger a new deployment
- Check the "Actions" tab to monitor deployment progress

## Troubleshooting

### If GitHub Pages doesn't work:
1. Check repository is public
2. Verify GitHub Actions completed successfully
3. Check "Settings" → "Pages" shows the correct source

### If database connection fails:
1. Verify Google Apps Script is deployed as web app
2. Check CORS settings in your Apps Script
3. Ensure Google Sheets and Drive have proper permissions

### If build fails:
1. Check the "Actions" tab for error details
2. Ensure all dependencies are in package.json
3. Verify there are no TypeScript errors

## Security Notes

- Never commit API keys or sensitive data
- Your Google Apps Script URL is safe to be public as it's designed for web access
- The Google Sheets and Drive IDs are also safe as they're configured with proper permissions

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Verify your Google Apps Script configuration
3. Test locally first with `npm run dev`
4. Check browser console for JavaScript errors

Your contracts management system should now be fully deployed and accessible via GitHub Pages!