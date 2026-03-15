# 🌿 HabitMinder

**A modern, full-stack habit tracking dashboard with classy aesthetics and powerful analytics.**

---

## ✨ Features

- **Classy Mint & Slate UI**: Beautifully designed custom theme with soft off-white cards and mint green accents.
- **Native Light/Dark Mode**: Fully supports seamless toggling between a crisp light mode and a deep, immersive dark mode.
- **Dynamic Grid Tracker**: A GitHub-style monthly grid to instantly log your habit completions with a single click.
- **Interactive Analytics**: View comprehensive performance data including Monthly Success Rates, Completion by Habit (Bar Charts), Daily Trends (Line Graphs), and Target Goals (Donut Charts).
- **Time Travel**: Effortlessly browse through your habit history by sliding between past and future months.
- **Secure Authentication**: Fully encrypted password storage and JWT-based user sessions so your tracking remains private.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React.js + Vite
- **Styling**: Tailwind CSS
- **Charting**: Chart.js + `react-chartjs-2`
- **Routing**: `react-router-dom`
- **Icons**: `lucide-react`
- **Dates**: `date-fns`

### Backend
- **Server**: Node.js & Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: `jsonwebtoken` & `bcryptjs`
- **Middleware**: `cors` & `multer`

---

## 🛠️ Local Development Setup

To run HabitMinder locally, you only need Node.js installed on your machine. You **do not** need to install MongoDB locally; you can simply create a free cloud database using MongoDB Atlas.

### 1. Backend Configuration
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the server dependencies:
   ```bash
   npm install
   ```
3. Set your environment variables in `backend/.env` (Create this file if it doesn't exist):
   ```env
   MONGO_URI=mongodb+srv://<your-username>:<your-password>@cluster0...
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   ```
4. Optional: Seed the database to test the UI immediately with dummy data!
   ```bash
   node seed.js
   ```
   *(This creates a user `demo@example.com` with password `password123`)*
5. Start the API server:
   ```bash
   node server.js
   ```

### 2. Frontend Configuration
1. Open a new terminal tab and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the client dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Check the terminal for your local port (usually **`http://localhost:5173`**) and open it in your browser!

---

## ☁️ Deployment Instructions

### Deploying the Backend
1. **Host**: Use a platform like **Render**, **Railway**, or **Heroku**.
2. **Database**: Use exactly the same string as your MongoDB Atlas cluster (`MONGO_URI`).
3. **Environment**: Input your `MONGO_URI`, `JWT_SECRET`, and define `PORT` in your hosting provider's variables block. Wait for the deploy to finish and copy your live backend URL.

### Deploying the Frontend
1. Navigate to the `frontend/` folder in your codebase.
2. In all files utilizing `axios` (like `HabitGrid.jsx`, `Analytics.jsx`, `Login.jsx`), you'll need to update the base URL from `http://localhost:5000/api` to your newly deployed live backend URL.
3. Push your repository to GitHub.
4. Import the `frontend` directory specifically into **Vercel** or **Netlify**.
5. The platform will automatically detect the Vite build settings (`npm run build`). Once approved, your Habit Tracker will be accessible globally!

---

## 👤 Author

**Zeeshan Shaikh**

- Email: <shaikhzeeshan7554@gmail.com>

---

*Built to keep you on track.*
