require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { setupSocket } = require("./services/socketService");

const app = express();

// ✅ Trust Railway’s proxy (for secure cookies, Google OAuth)
app.set("trust proxy", 1); // Required for Railway HTTPS

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ CORS setup (allow frontend from Vercel)
app.use(cors({
  origin: "https://to-do-full-stack-zeta.vercel.app", // your Vercel frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // allow cookies to be sent
}));

// ✅ Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || "my-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,            // ensures cookies only sent over HTTPS
    sameSite: "none",        // required for cross-origin (Vercel + Railway)
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Log every incoming request (for debugging)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("✅ Todo Task API is running. Use /api endpoints.");
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ Health check route
app.get("/ping", (req, res) => {
  res.send("✅ Backend is live!");
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

module.exports = app;
