import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Db connection
import mongoose from "mongoose";
const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/anonymPoll";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

//Admin Routes
import adminAuthRouter from "./routes/admin/admin.auth.route.js";
app.use("/api/v1/admin", adminAuthRouter);

import studentRouter from "./routes/student/student.route.js";
app.use("/api/v1/student", studentRouter);

import facultyRouter from "./routes/faculty/faculty.route.js";
app.use("/api/v1/faculty", facultyRouter);

import subjectRouter from "./routes/admin/subject.route.js";
app.use("/api/v1/subject", subjectRouter);

import batchRouter from "./routes/admin/batch.route.js";
app.use("/api/v1/batch", batchRouter);

import forumRouter from "./routes/admin/forum.route.js";
app.use("/api/v1/forum", forumRouter);

// Start the server
const baseAddress = process.env.BASEURL || "http://localhost";
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on ${baseAddress}:${port}`);
});
