# 💪 FitTrack — Full Stack Fitness Tracker

<div align="center">

![FitTrack](https://img.shields.io/badge/FitTrack-Fitness%20Tracker-5DD62C?style=for-the-badge&logo=react&logoColor=white)

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3.4-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?style=flat-square)](https://axios-http.com/)
[![JSON Server](https://img.shields.io/badge/JSON%20Server-0.17.4-FF4136?style=flat-square)](https://github.com/typicode/json-server)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4.3-FF6384?style=flat-square&logo=chartdotjs)](https://www.chartjs.org/)
[![Render](https://img.shields.io/badge/Server-Render-46E3B7?style=flat-square&logo=render)](https://render.com/)

> A full-stack fitness tracking web app — log workouts, track nutrition, visualise progress and crush your goals.

</div>

---

## 📁 Repository Structure

This project is split into two separate folders:

```
📦 Root
├── 📁 fitnessTracker/       ← React frontend (Vite)
└── 📁 fitness-server/       ← JSON Server backend (Node.js)
`|_``
 |_
> Both folders have their own package.json and must be run separately.

---

## 🗄️ fitness-server — JSON Server Backend

### Folder Structure

```
fitness-server/
├── index.js        ← Server entry point
├── db.json         ← Database (users, workouts, nutrition)
├── package.json
└── .gitignore
```

### index.js

```js
//import json server
const jsonServer = require('json-server')

//create server for running json file
const server = jsonServer.create()

//set up route/path for json file
const router = jsonServer.router('db.json')

//create middleware
const middleware = jsonServer.defaults()

//create server port number
const PORT = process.env.PORT || 3000

//use middleware, router, & port to server
server.use(middleware)
server.use(router)

// run server at given port
server.listen(PORT, ()=>{
    console.log("Server Started");
})
```

### db.json

```json
{
  "users": [],
  "workouts": [],
  "nutrition": []
}
```

### REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | Get all users |
| POST | /users | Create new user |
| PUT | /users/1 | Replace user |
| PATCH | /users/1 | Update user fields |
| DELETE | /users/1 | Delete user |
| GET | /workouts | Get all workouts |
| POST | /workouts | Log new workout |
| DELETE | /workouts/:id | Delete workout |
| GET | /nutrition | Get all nutrition logs |
| POST | /nutrition | Add food entry |
| DELETE | /nutrition/:id | Remove food entry |

### Run Locally

```bash
cd fitness-server
npm install
node index.js
# Server Started  →  http://localhost:3000
```

### Deploy to Render

1. Push fitness-server/ to a GitHub repo
2. Go to render.com → New Web Service → Connect repo
3. Set Build Command: npm install  |  Start Command: node index.js
4. Copy your Render URL → update baseURL in axiosInstance.js

---

## ⚛️ fitnessTracker — React Frontend

### Folder Structure

```
fitnessTracker/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                  ← Entry point (BrowserRouter lives here)
    ├── App.jsx                   ← Routes + WorkoutProvider
    ├── index.css                 ← Global dark theme
    ├── api/
    │   ├── axiosInstance.js      ← Axios instance (baseURL + timeout + interceptors)
    │   ├── apiService.js         ← Generic request wrapper
    │   └── allFitnessApi.js      ← userApi, workoutApi, nutritionApi, statsApi
    ├── context/
    │   └── WorkoutContext.jsx    ← Global state (useReducer + async actions)
    ├── data/
    │   ├── Exercises.json        ← 24 exercises
    │   ├── Foods.json            ← 20 foods with macros
    │   └── workouts.json         ← Categories and templates
    ├── components/
    │   ├── Navbar.jsx
    │   ├── StatCard.jsx
    │   ├── WorkoutCard.jsx
    │   ├── WorkoutForm.jsx
    │   ├── ExerciseCard.jsx
    │   └── ProgressChart.jsx
    └── pages/
        ├── Setup.jsx             ← 3-step onboarding
        ├── Home.jsx              ← Dashboard
        ├── Tracker.jsx           ← Log workout
        ├── ExerciseLibrary.jsx   ← Browse exercises
        ├── Progress.jsx          ← Charts + PRs
        ├── History.jsx           ← Workout history
        ├── ViewWorkout.jsx       ← Single workout (/history/:id/view)
        ├── Profile.jsx           ← Profile + BMI
        └── NotFound.jsx          ← 404
```

### API Layer Architecture

```
Component
    ↓
allFitnessApi.js   →   apiService.js   →   axiosInstance.js   →   fitness-server
```

### axiosInstance.js

```js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',  // change to Render URL for production
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error?.response?.status;
    const message = error?.response?.data?.message || error.message;
    console.error(`[Axios] ${status || 'Network Error'}: ${message}`);
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### apiService.js

```js
import axiosInstance from './axiosInstance';

const apiService = async (httpMethod, url, reqBody) => {
  const reqConfig = { method: httpMethod, url, data: reqBody };
  try {
    const response = await axiosInstance(reqConfig);
    return response;
  } catch (err) {
    throw err;
  }
};

export default apiService;
```

### Routes

| Route | Page | Description |
|-------|------|-------------|
| / | Home | Dashboard |
| /tracker | Tracker | Log workout |
| /library | ExerciseLibrary | Browse exercises |
| /progress | Progress | Charts + PRs |
| /history | History | All workouts |
| /history/:id/view | ViewWorkout | Single workout detail |
| /profile | Profile | User profile + BMI |

### Features

- 3-step onboarding (new user wipes old user data automatically)
- 4 animated stat cards — workouts, volume, streak, weekly count
- Weekly goal progress bar + 7-day activity grid
- Bar chart (weekly volume) + line chart (monthly frequency)
- 24-exercise library with category filters + live search
- Dynamic workout logger — sets × reps × weight per exercise
- Nutrition tracker — calories + protein/carbs/fat macros
- Personal Records auto-computed with gold/silver/bronze medals
- BMI calculator with colour-coded gauge
- Full reset → redirects to Setup for next user

### Install & Run

```bash
cd fitnessTracker
npm install
npm run dev
# http://localhost:5173
```

---

## 🚀 Running Both Together

Terminal 1:
```bash
cd fitness-server
node index.js
```

Terminal 2:
```bash
cd fitnessTracker
npm run dev
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | #5DD62C (electric green) |
| Background | #0F0F0F (near black) |
| Display Font | Bebas Neue |
| Body Font | Outfit |

---

## 🐛 Common Issues

| Error | Fix |
|-------|-----|
| Cannot read .filter of undefined | Categories are hardcoded — not from JSON |
| PUT /users/1 → 404 | setupUser() checks existence before PUT |
| Double Router error | BrowserRouter only in main.jsx |
| db.json Expected array | Replace db.json with {"users":[],"workouts":[],"nutrition":[]} |
| forEach on undefined | Pass workouts arg: statsApi.getMonthlyFrequency(workouts) |

---

## 👨‍💻 Author

Abhishek — MERN Stack, Luminar Technolab

---

## 📄 License

MIT — free to use, modify and distribute.

---

<div align="center">
FitTrack — Track Every Rep. Every Set. Every Gain. 💚
</div>
