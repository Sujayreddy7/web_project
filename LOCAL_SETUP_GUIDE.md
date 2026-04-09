# Local Setup Guide for StudyGenie AI 🚀

If you have downloaded this project as a ZIP file, follow these precise steps to get it running on your local computer from scratch!

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- **Python 3.10+**: Make sure Python is in your system PATH.
- **Node.js (v18+)**: Needed to run the frontend Vite server.
- **MySQL**: The database server running locally on your machine on port `3306`. (e.g. MySQL Workbench).

---

## 🛠️ Step 1: Database Setup (MySQL)
The backend is hardcoded to connect to a local MySQL instance. 

1. Open MySQL Workbench or your MySQL Command Line.
2. Create a new database specifically for this project by running:
   ```sql
   CREATE DATABASE studygenie_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Open `backend/core_project/settings.py` and modify the **DATABASES** block (around line 80). Change `'PASSWORD': 'your_local_password'` to match whatever password you use for your `root` MySQL user on your personal computer!

---

## 🐍 Step 2: Backend Setup (Django + LangChain)

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd path\to\your\unzipped\folder\web_project\backend
   ```

2. Create a fresh Python virtual environment so dependencies don't clash:
   - **Windows:** `python -m venv venv`
   - **Mac/Linux:** `python3 -m venv venv`

3. Activate the virtual environment:
   - **Windows:** `.\venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`

4. Install all the required Python libraries using the requirements file:
   ```bash
   pip install -r requirements.txt
   ```

5. **AI Setup (Mandatory):** 
   - Get a free Google Gemini key from [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Create a file named `.env` right next to `manage.py` inside the `backend` folder.
   - Paste the following exactly into the `.env` file:
     ```env
     GEMINI_API_KEY=your_copied_api_key_here
     ```

6. Migrate the Database. This generates all the tables (Users, Notes, Tasks) inside the MySQL database you created in Step 1:
   ```bash
   python manage.py migrate
   ```

7. Start the backend server!
   ```bash
   python manage.py runserver
   ```
   *(Keep this terminal open! The backend API is now alive at `http://127.0.0.1:8000/`)*

---

## ⚛️ Step 3: Frontend Setup (React + Vite)

1. Open a **brand new terminal window** (do not close the backend one).
2. Navigate into the `frontend` folder:
   ```bash
   cd path\to\your\unzipped\folder\web_project\frontend
   ```

3. Install all the Node/React packages:
   ```bash
   npm install
   ```

4. Cross-Origin Check: If you open `frontend/src/services/api.js`, notice on line 4 that the `baseURL` expects the backend to be running on `http://localhost:8000/api/`. Leave this exactly as-is!

5. Run the frontend development server:
   ```bash
   npm run dev
   ```

---

## 🎉 Step 4: Run the App!
If you've followed the steps properly, Vite will output a local link (usually `http://localhost:5173/`).

1. Open your browser and go to `http://localhost:5173/`.
2. Because the app has **secure JWT Authentication**, you will be bounced to the Login screen.
3. Click "Register" to create a local username and password.
4. Sign in, and you're good to go! Your AI Study Assistant is fully operational!
