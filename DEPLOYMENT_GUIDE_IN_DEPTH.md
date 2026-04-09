# 100% FREE In-Depth Deployment Guide 🚀

I have carefully curated this guide so that you can deploy your entire full-stack application to the internet **100% for free** without ever needing to pull out a credit card! 

We will use the best modern **Generous Free-Tier platforms**:
1. **Database:** TiDB Serverless (100% Free MySQL, No Credit Card)
2. **Backend:** Render (Free Python API Tier, No Credit Card)
3. **Frontend:** Vercel (Free React Edge Tier, No Credit Card)

---

## 🛠️ Step 1: Deploying the Database for Free (TiDB Cloud)
You need a database running on a cloud server so your Live app can save data.

1. Go to **[TiDB Cloud](https://tidbcloud.com/)** and sign up for a free account.
2. Click **Create Cluster** and select the **Serverless (Free)** tier.
3. Once the database finishes booting up, click **Connect**.
4. Change the connect parameter to **Django/Python** or simply click **Connection String**.
5. Copy the entire `mysql://user:password@gateway.tidbcloud.com:4000/db` URL it generates.
6. Keep this copied string safe! You will paste this into Render in Step 2.

---

## 🐍 Step 2: Deploying the Django Backend for Free (Render)
Render is an amazing platform with a permanent Free Tier for hosting Python servers. I have already configured your codebase so that it automatically sets up Production parameters when Render hosts it!

1. **Commit to GitHub**: Upload this entire `web_project` folder to a GitHub repository.
2. Go to **[Render.com](https://render.com/)**, sign up strictly with the **Free Account**.
3. Click **New** -> **Web Service**.
4. Authorize and select your GitHub repository.
5. In the Render configuration, enter the following details:
   - **Name**: `studygenie-backend`
   - **Root Directory**: `backend` *(Extremely important!)*
   - **Environment**: Python 3
   - **Instance Type**: **Free ($0/month)**
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
   - **Start Command**: `gunicorn core_project.wsgi:application`
6. Scroll down to **Environment Variables** and securely attach the keys:
   - Key: `DATABASE_URL` -> Value: *(Paste your TiDB MySQL connection string from Step 1!)*
   - Key: `GEMINI_API_KEY` -> Value: *(Paste your Google Gemini API key!)*
7. Click **Create Web Service**.

Wait a few minutes. Because it is a free tier server, it may take 2-4 minutes to compile the first time. Once it's done, Render will give you a live URL like `https://studygenie-backend.onrender.com`. 

---

## ⚛️ Step 3: Deploying the React Frontend for Free (Vercel)
Vercel is the ultimate free hosting platform for React.

Before deploying, we strictly need to tell our React code to talk to your live Render backend instead of localhost!
1. Open `frontend/src/services/api.js` on your computer.
2. Change the `baseURL` inside the file:
   ```javascript
   const api = axios.create({
     // Paste your real Render URL here! Format MUST end in /api/
     baseURL: 'https://studygenie-backend.onrender.com/api/', 
   });
   ```
3. Commit this change and push it up to GitHub.
4. Go to **[Vercel.com](https://vercel.com/)** and sign up for the Hobby (Free) tier.
5. Click **Add New** -> **Project**.
6. Import your `web_project` repository.
7. Important: In the configuration screen, change the **Root Directory** to `frontend`.
8. Vercel will automatically detect that you are using **Vite**.
9. Click **Deploy**!

Within seconds, Vercel will build your React application and give you your Live Domain URL forever for free! 

---

### 🎉 Summary!
By using **TiDB Serverless**, **Render**, and **Vercel**, your AI study application is now permanently live on the internet, secure, and costing you exactly **$0.00**. You can share the Vercel link with your friends on their phones or laptops right now!
