How to run the frontend and connect to the backend

- Install dependencies in the frontend folder:

  npm install

- Start the dev server:

  npm run dev


By default the frontend will try to fetch data from http://localhost:4000/api/overview.
Override this by creating a file named `.env` in the `frontend` folder and adding:

```
VITE_BACKEND_URL=http://localhost:4000/api/overview
```

Then restart the dev server. Alternatively set the env var in PowerShell before running:

```
$env:VITE_BACKEND_URL = 'http://localhost:4000/api/overview'; npm run dev
```

Make sure the backend is running (see ../backend).
