# EduCMS Demo

This folder contains a separate demo app for presentation use. It does not live inside the main frontend and it does not own any database state. Instead:

- `demo/backend` logs into the CMS with dedicated demo credentials
- `demo/backend` fetches questions and topics from the CMS
- `demo/backend` strips answer keys before sending quiz data to the browser
- `demo/frontend` renders the quiz and submits answers back to `demo/backend`

## Run It

### 1. Start the main CMS backend

Make sure the project backend is running on `http://localhost:3000`.

### 2. Build the demo frontend

```bash
cd demo/frontend
npm install
npm run build
```

### 3. Start the demo backend

```bash
cd demo/backend
cp .env.example .env
npm install
npm run dev
```

Set `CMS_EMAIL` and `CMS_PASSWORD` in `demo/backend/.env` to a CMS account that owns the quiz content you want to present.
The demo backend uses `PORT` and defaults to `3001`.

### 4. Open the demo

Visit `http://localhost:3001`.

## Optional Frontend Dev Mode

If you want hot reloading while editing the demo UI, you can still run:

```bash
cd demo/frontend
npm run dev
```

That uses the existing Vite setup and talks to the demo backend from `http://localhost:4173`.
