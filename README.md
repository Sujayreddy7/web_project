# StudyGenie AI - Personalized Learning Assistant

StudyGenie AI is a full-stack application built with React, Django REST Framework, MySQL, and LangChain.

## Project Structure
```
web_project/
├── backend/          # Django REST API & LangChain Integration
│   ├── api/          # Application for APIs, Models, Views, Services
│   ├── core_project/ # Django project settings
│   └── venv/         # Python Virtual Environment
└── frontend/         # React.js UI built with Vite
    ├── src/
    │   ├── components/ # Reusable UI pieces
    │   ├── pages/      # Route pages (Dashboard, Notes, etc)
    │   ├── services/   # Axios API hookups
    │   └── ...
    └── ...
```

---

## 🛠️ Step-by-Step Setup Instructions (Local Development)

### 1. Database Setup (MySQL)
Ensure you have MySQL installed locally. You need to create a database named `studygenie_db`.
1. Open your MySQL command line or Workbench.
2. Run this command:
   ```sql
   CREATE DATABASE studygenie_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
*(Note: If your MySQL root user has a password, update `PASSWORD` inside `backend/core_project/settings.py` -> `DATABASES`.)*

### 2. Backend Setup (Django + LangChain)
1. Open up VS Code and open a terminal inside the **`backend`** folder.
2. Activate your virtual environment:
   - **Windows:** `.\venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`
3. Install dependencies (if you haven't already):
   ```bash
   pip install django djangorestframework mysqlclient langchain langchain-openai python-dotenv django-cors-headers
   ```
4. Perform database migrations to create the tables in your MySQL DB:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
5. Set your OpenAI API Key as an environment variable in your terminal (or put it in a `.env` file!):
   - **Windows:** `set OPENAI_API_KEY=your_api_key_here`
6. Run the local backend server:
   ```bash
   python manage.py runserver
   ```
   The backend API will run on `http://127.0.0.1:8000/`.

### 3. Frontend Setup (React)
1. Open a new terminal tab in VS Code and change directory to **`frontend`**.
2. Install the node modules:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173/`. Open this in your browser!

---

## 🔗 API Endpoints List

### Core Endpoints
- **Notes:** 
  - `GET /api/notes/` - List Notes
  - `POST /api/notes/` - Create Note
- **Tasks:**
  - `GET /api/tasks/` - List Tasks
  - `POST /api/tasks/` - Create Task
  - `PATCH /api/tasks/<id>/` - Update Task completion
- **Goals:**
  - `GET /api/goals/` - List Goals
  - `POST /api/goals/` - Create Goal
  - `PATCH /api/goals/<id>/` - Update Goal completion
- **Study Plans:**
  - `GET /api/study-plans/` - List Saved Study Plans
  - `POST /api/study-plans/` - Save a new Study Plan

### AI Endpoints
- `POST /api/ai/summarize/` - Summarize Note (Requires JSON body: `{"content": "..."}`)
- `POST /api/ai/ask/` - Q&A on Notes (Requires JSON body: `{"content": "...", "question": "..."}`)
- `POST /api/ai/plan/` - Generate AI Plan (Requires JSON body: `{"subjects": [...], "deadline": "..."}`)

---

## 🚀 Deployment Steps

### 1. Database (PlanetScale)
1. Create a PlanetScale account.
2. Create a new database. 
3. Go to "Dashboard" -> "Connect" and get the connection credentials (Host, Username, Password).
4. Update these credentials in your Django `settings.py` (or better, use `python-dotenv` to inject them on production).

### 2. Backend (Render)
1. Push your `backend` directory to a GitHub repository.
2. Create an account on Render.com and select "New Web Service".
3. Authorize GitHub and select your repository.
4. Set the Root Directory to `backend` (if you pushed the whole folder).
5. Build Command: `pip install -r requirements.txt && python manage.py migrate`
6. Start Command: `gunicorn core_project.wsgi:application`
7. Add Environment Variables in Render: 
   - `OPENAI_API_KEY` = `<your key>`
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD` (mapping to your PlanetScale db)

### 3. Frontend (Vercel)
1. Push your `frontend` directory to a GitHub repository.
2. Create an account on Vercel.com.
3. Import your frontend repository.
4. Framework Preset will be automatically detected as **Vite**.
5. Before clicking Deploy, make sure your React app's API Base URL points to the live Render Backend URL instead of `localhost`. You can do this by setting an environment variable in Vercel `VITE_API_URL` and using it in `api.js`.
6. Click Deploy!
