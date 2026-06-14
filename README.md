# CrowdShield - Real-Time Crowd Monitoring & Safety Dashboard

CrowdShield is a full-stack MERN application that allows users to submit incident reports, track hazard details geographically via an interactive map, and receive real-time danger alerts. It features role-based access control, Socket.io broadcasts, custom analytical widgets, and CSV reporting tools.

---

## Project Structure

```text
crowdshield/
├── backend/            # Express & Node.js Backend API
│   ├── config/         # Database configurations
│   ├── controllers/    # API request handlers
│   ├── middleware/     # Auth and role middlewares
│   ├── models/         # Mongoose DB schemas
│   ├── routes/         # REST endpoints routing
│   ├── server.js       # Express + Socket.io Backend boot
│   └── package.json    # Backend dependencies
└── client/             # Vite + React + Tailwind Frontend
    ├── public/         # Static assets
    ├── src/
    │   ├── components/ # Reusable UI widgets (MapView, Sidebar, Navbar)
    │   ├── context/    # State context providers (Auth, Socket, Theme, Toast)
    │   ├── pages/      # Dashboard and Auth view panels
    │   ├── App.jsx     # Route coordinator
    │   ├── index.css   # Styles and animations
    │   └── main.jsx    # Client bootstraper
    └── package.json    # Frontend dependencies
```

---

## Prerequisites

Before running the application, make sure you have:
1. **Node.js** (v18 or above recommended)
2. **npm** (v9 or above)
3. **MongoDB** (Ensure your local MongoDB service is active: `net start MongoDB` on Windows, or `brew services start mongodb-community` on macOS, or connect to a remote MongoDB Atlas database).

---

## Step-by-Step Installation & Booting

Follow these steps to get CrowdShield up and running locally.

### 1. Set Up and Run the Backend Server

Open a terminal window and navigate to the `backend/` directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure your environment:
A default `.env` has been configured with local parameters:
* `PORT=5050`
* `MONGO_URI=mongodb://127.0.0.1:27017/crowdshield`
* `JWT_SECRET=crowdshieldsecretjwtkey123!#%`

If you are using a remote MongoDB Atlas database, edit `backend/.env` and replace `MONGO_URI` with your connection string.

Start the backend:

```bash
# Production mode
npm start

# Development mode (with nodemon auto-restart)
npm run dev
```

The server should start with the log:
`MongoDB Connected: 127.0.0.1`
`Server running on port 5050`

---

### 2. Set Up and Run the Frontend Client

Open a **separate** terminal window and navigate to the `client/` directory:

```bash
cd client
```

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Start the Vite development server:

```bash
npm run dev
```

Vite will boot and display the local URL (usually `http://localhost:5173`). Open this URL in your web browser.

---

## How to Test Roles & Features

To test both role-based dashboards without complex database editing:

1. **First Registered User = Admin**:
   * Open the app in your browser and click **Create free account**.
   * Fill in the register form (name, email, password) and click **Register**.
   * **Note**: The backend is configured to automatically assign the **Admin** role to the first account registered.
   * You will immediately see the administrative dashboard containing analytical charts, mapping, and a link to the **Admin Panel** on the sidebar.

2. **Subsequent Registered Users = Standard Users**:
   * Log out of your admin account.
   * Open a different browser (or an incognito tab) and register a **second account** (with a different email).
   * This second account will receive the default **User** role.
   * On this dashboard, you will only see your own submission stats, community alerts, and a button to **Report Incident**.

3. **Test Real-Time Alerts (Socket.io)**:
   * Keep both browsers open side-by-side (one logged in as Admin, the other logged in as a normal User).
   * In the User browser, navigate to **Report Incident**.
   * Fill out the form, click on the Leaflet map to pin coordinate markers, and select **High** severity. Click **Submit Report**.
   * In the Admin browser (or another logged-in user browser), you will immediately see a **floating toast notification** warning of a new High severity incident!
   * The Admin map will automatically populate the new marker.
   * If you navigate to the **Alerts** page, the incident will be listed in the live websocket activity feed.

4. **Verify Admin Panel Actions**:
   * In the Admin browser, navigate to the **Admin Panel** tab.
   * You will see the User's report in the grid.
   * Change the status dropdown from **Pending** to **In Progress** or **Resolved**.
   * The User's browser will receive a live status modification notification.
   * Click **Export as CSV** in the Admin panel to download the report index sheet as a `.csv` file.