# Project Setup Guide

This project consists of a Django REST API backend and a Next.js frontend. Follow the steps below to set up and run both parts of the application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+** (for backend)
- **Node.js 18+** and **npm/yarn/pnpm** (for frontend)
- **Git** (for cloning the repository)

## Project Structure

```
teest/
├── backend/          # Django REST API backend
│   ├── backend/      # Django project settings
│   ├── core/         # Core app with API endpoints
│   ├── manage.py     # Django management script
│   └── venv/          # Python virtual environment
└── frontend/         # Next.js frontend application
    ├── app/          # Next.js App Router pages
    ├── components/   # React components
    └── lib/          # Utilities and API client
```

## Documentation

- **Setup Guide**: This file (`README.md`)
- **API Documentation**: See [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) for complete API endpoint documentation, request/response formats, and examples.

---

## Backend Setup (Django)

### Step 1: Navigate to the Backend Directory

```bash
cd backend
```

### Step 2: Activate the Virtual Environment

**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt, indicating the virtual environment is active.

### Step 3: Install Dependencies (if needed)

If the virtual environment doesn't have all packages installed, you can install them. However, since a `venv` already exists with packages, you may skip this step. If you need to reinstall:

```bash
pip install django djangorestframework django-cors-headers django-cms django-sekizai django-treebeard django-classy-tags pillow
```

### Step 4: Run Database Migrations

Apply the database migrations to set up the database schema:

```bash
python manage.py migrate
```

This will create the SQLite database file (`db.sqlite3`) if it doesn't exist and apply all migrations.

### Step 5: Create a Superuser (Optional)

If you want to access the Django admin panel, create a superuser account:

```bash
python manage.py createsuperuser
```

Follow the prompts to set a username, email, and password.

### Step 6: Start the Django Development Server

```bash
python manage.py runserver
```

The backend server will start on **http://localhost:8000**

You can verify it's running by visiting:
- **API Health Check**: http://localhost:8000/api/health/
- **Django Admin**: http://localhost:8000/admin/
- **API Articles**: http://localhost:8000/api/articles/

### Backend URLs

- **Admin Panel**: http://localhost:8000/admin/
- **API Base**: http://localhost:8000/api/
- **API Health Check**: http://localhost:8000/api/health/
- **Articles API**: http://localhost:8000/api/articles/

---

## Frontend Setup (Next.js)

### Step 1: Navigate to the Frontend Directory

Open a **new terminal window** (keep the backend server running) and navigate to the frontend directory:

```bash
cd frontend
```

### Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

Or if you prefer using yarn or pnpm:

```bash
yarn install
# or
pnpm install
```

### Step 3: Configure Environment Variables (Optional)

Create a `.env.local` file in the `frontend` directory to configure the API URL:

```bash
touch .env.local
```

Add the following content to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Note**: If you don't create this file, the frontend will use the default API URL `http://localhost:8000/api`.

### Step 4: Start the Next.js Development Server

```bash
npm run dev
```

Or with yarn/pnpm:

```bash
yarn dev
# or
pnpm dev
```

The frontend server will start on **http://localhost:3000**

Open your browser and navigate to **http://localhost:3000** to see the application.

---

## Running Both Servers

To run the full application, you need **two terminal windows**:

### Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

---

## Verification Checklist

✅ **Backend is running** if you can access:
- http://localhost:8000/api/health/ (should return a health check response)

✅ **Frontend is running** if you can access:
- http://localhost:3000 (should show the application homepage)

✅ **Integration is working** if:
- The frontend can fetch articles from the backend API
- No CORS errors appear in the browser console

---

## Common Issues and Solutions

### Backend Issues

**Issue**: `ModuleNotFoundError` or `ImportError`
- **Solution**: Make sure the virtual environment is activated and dependencies are installed.

**Issue**: `django.db.utils.OperationalError: no such table`
- **Solution**: Run `python manage.py migrate` to create database tables.

**Issue**: Port 8000 is already in use
- **Solution**: Use a different port: `python manage.py runserver 8001`

### Frontend Issues

**Issue**: `Cannot find module` errors
- **Solution**: Run `npm install` to install all dependencies.

**Issue**: API calls failing with CORS errors
- **Solution**: Ensure the backend is running and CORS is properly configured in `backend/backend/settings.py`.

**Issue**: Port 3000 is already in use
- **Solution**: Next.js will automatically use the next available port (3001, 3002, etc.) or you can specify: `npm run dev -- -p 3001`

---

## Additional Commands

### Backend Commands

```bash
# Create a new migration after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Access Django shell
python manage.py shell

# Collect static files (for production)
python manage.py collectstatic
```

### Frontend Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## Development Tips

1. **Keep both servers running**: The frontend needs the backend API to function properly.

2. **Check the terminal output**: Both servers will show helpful error messages and logs.

3. **Browser DevTools**: Use the browser's developer console to debug frontend issues and network requests.

4. **Django Admin**: Use the admin panel at http://localhost:8000/admin/ to manage data directly in the database.

---

## Production Deployment

This guide covers development setup only. For production deployment:

- **Backend**: Configure proper database (PostgreSQL recommended), set `DEBUG=False`, configure `ALLOWED_HOSTS`, set up proper static file serving, and use a production WSGI server (e.g., Gunicorn).

- **Frontend**: Run `npm run build` and deploy the generated files to a static hosting service or use `npm start` with a Node.js server.

---

## Support

If you encounter any issues not covered in this guide, check:
- Django documentation: https://docs.djangoproject.com/
- Next.js documentation: https://nextjs.org/docs
- Project-specific error messages in the terminal

