# Frontend Deployment

Deploy this folder to Vercel.

## Vercel Settings

```txt
Root Directory: frontend
Install Command: npm install
Build Command: npm run build:vercel
Output Directory: dist/flipshop-frontend/browser
```

## Environment Variables

Set this in Vercel after the Render backend is deployed:

```txt
API_BASE_URL=https://YOUR_RENDER_BACKEND.onrender.com/api
```

The build writes `src/assets/runtime-config.js` with this API URL.
