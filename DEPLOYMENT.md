# Deployment Checklist

## MongoDB Atlas
1. Create an Atlas cluster.
2. Create a database user.
3. Allow the deployment service's network access as appropriate.
4. Copy the Node.js driver connection string.
5. Set it as `MONGO_URI` in the backend hosting environment.

## Render Backend
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment:
  - `MONGO_URI`
  - `PORT`

## Render Frontend
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment:
  - `VITE_API_URL=https://YOUR-BACKEND.onrender.com/api`

## React Router
Add a rewrite:
- Source: `/*`
- Destination: `/index.html`
- Action: Rewrite

## GitHub
Never commit `.env`. The repository includes `.env.example` files instead.
