const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// Middleware: Check if user is authenticated
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Not logged in" });
};
// Get all tasks for logged-in user
router.get("/", isLoggedIn, async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user._id });
  res.json(tasks);
});

// Create new task (assign user)
router.post("/", isLoggedIn, async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    description: req.body.description || "",
    status: "pending",
    createdBy: req.user._id,
  });
  res.json(task);
});
// Update task (only if belongs to user)
router.put("/:id", isLoggedIn, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    req.body,
    { new: true }
  );
  res.json(task);
});
// Delete task (only if belongs to user)
router.delete("/:id", isLoggedIn, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
  res.json({ message: "Task deleted" });
});

module.exports = router;
