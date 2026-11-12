# To-Do List App (MERN)

Mobile-first to-do app: create / edit / delete / search tasks, weekly grouping (Mon–Sun) with open vs completed cards, status toggle, swipe-left to delete.

## Stack
- **Client:** React 18 + Vite + Tailwind CSS 3 + date-fns + lucide-react
- **Server:** Node + Express + Mongoose (MongoDB)

## Prerequisites
- Node.js 18+ and npm
- A MongoDB database: local MongoDB **or** a free MongoDB Atlas cluster

## Run locally
```bash
# 1) API
cd server
npm install
cp .env.example .env        # set MONGO_URI
npm run dev                 # http://localhost:5000

# 2) Client (new terminal)
cd client
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm run dev                 # http://localhost:5173
```

## Packages installed
Server: `express`, `mongoose`, `cors`, `dotenv`, `nodemon` (dev)
Client: `react`, `react-dom`, `date-fns`, `lucide-react`, `vite`, `@vitejs/plugin-react`, `tailwindcss@3`, `postcss`, `autoprefixer`

## API
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/tasks?q=` | list / search (title + description) |
| POST | `/api/tasks` | create (title, dateTime required) |
| PUT | `/api/tasks/:id` | edit any field |
| PATCH | `/api/tasks/:id/status` | `completed` / `in-progress` |
| DELETE | `/api/tasks/:id` | delete |
| GET | `/api/tasks/summary/weeks` | open/completed counts per week |

## Deploy
**API (Render):** New Web Service → root dir `server`, build `npm install`, start `npm start`.
Env vars: `MONGO_URI` (Atlas string; allow 0.0.0.0/0 in Atlas Network Access), `CLIENT_URL` (your Netlify URL).

**Client (Netlify):** root/base dir `client`, build `npm run build`, publish `dist`.
Env var: `VITE_API_URL=https://<your-render-app>.onrender.com/api`.
