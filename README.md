# Frontend Deployment

Deploy this folder to Vercel.

## Vercel Settings

```txt
Framework Preset: Angular
Root Directory: bestic-fashion-frontend
Install Command: npm ci
Build Command: npm run build:vercel
Output Directory: dist/flipshop-frontend/browser
```

## Environment Variables

Set this in Vercel before deploying:

```txt
API_BASE_URL=https://YOUR_BACKEND_DOMAIN/api
```

For a Railway backend, use the public Railway backend URL, for example:

```txt
API_BASE_URL=https://YOUR_RAILWAY_BACKEND.up.railway.app/api
```

The Vercel build writes `src/assets/runtime-config.js` with this API URL. The deployed config disables long-term caching for that file so future API URL changes take effect quickly.

## Local Vs Production API Config

Local config:

```txt
src/assets/config.local.json
```

Production config:

```txt
src/assets/config.production.json
```

Local `npm start` writes `runtime-config.js` from `config.local.json`, currently:

```txt
http://127.0.0.1:5000/api
```

Production/Vercel build writes `runtime-config.js` from `config.production.json`, unless Vercel `API_BASE_URL` is set. Vercel `API_BASE_URL` has priority.
