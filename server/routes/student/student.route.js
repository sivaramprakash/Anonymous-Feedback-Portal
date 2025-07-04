import express from "express";
import {
  addStudent,
  deleteStudent,
  getAllStudents,
  getStudentByBatch,
  getStudentByUsername,
  getStudentPassword,
  studentLogin,
  studentLogout,
  updateStudent,
} from "../../controllers/student/student.controller.js";

const studentRouter = express.Router();

studentRouter.post("/login", studentLogin);
studentRouter.post("/logout", studentLogout);
studentRouter.post("/addStudent", addStudent);
studentRouter.get("/getStudent:username", getStudentByUsername);
studentRouter.get("/getAllStudents", getAllStudents);
studentRouter.delete("/deleteStudent/:id", deleteStudent);
studentRouter.get("/getStudentByBatch", getStudentByBatch);
studentRouter.put("/updateStudent/:id", updateStudent);
studentRouter.get("/getStudentPassword/:id", getStudentPassword);

export default studentRouter;
