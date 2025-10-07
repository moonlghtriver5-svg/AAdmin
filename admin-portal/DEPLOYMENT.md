# ALICE Admin Portal - Deployment Guide

## Railway Deployment

This application is configured to deploy to Railway with zero configuration.

### Quick Deploy to Railway

1. **Install Railway CLI** (optional):
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize Railway project**:
   ```bash
   railway init
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

### Deploy via GitHub

1. Push your code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Select your repository
6. Railway will automatically:
   - Detect it's a Next.js app
   - Run `npm install`
   - Run `npm run build`
   - Start the app with `npm run start`

### Environment Variables

No environment variables are required for the demo version. All data is mocked.

For production, you would add:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection for caching
- `AUTH_SECRET` - Authentication secret key
- `API_BASE_URL` - Base URL for backend API

### Build Configuration

The app uses:
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Node Version**: 20.x (automatically detected)

### Post-Deployment

After deployment, Railway will provide you with a public URL like:
`https://your-app.railway.app`

The app will be accessible at:
- Homepage (Usage): `/`
- Controls: `/controls`
- Proxy Funnel: `/proxy-funnel`

### Troubleshooting

If build fails:
1. Check the build logs in Railway dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node version compatibility

### Local Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### Production Build (Test Locally)

```bash
npm run build
npm run start
```

Visit `http://localhost:3000`
