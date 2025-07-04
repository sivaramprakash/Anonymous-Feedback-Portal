import express from "express";
import {
  addFaculty,
  deleteFaculty,
  facultyLogout,
  getAllFaculty,
  getFaculty,
  facultyLogin,
  updateFaculty,
  getFaucultyPassword,
} from "../../controllers/faculty/faculty.controller.js";

const facultyRouter = express.Router();

facultyRouter.post("/login", facultyLogin);
facultyRouter.post("/addFaculty", addFaculty);
facultyRouter.get("/getFaculty/:username", getFaculty);
facultyRouter.get("/getAllFaculty", getAllFaculty);
facultyRouter.put("/updateFaculty/:id", updateFaculty);
facultyRouter.delete("/deleteFaculty/:id", deleteFaculty);
facultyRouter.post("/logout", facultyLogout);
facultyRouter.get("/getFacultyPassword/:username", getFaucultyPassword);

export default facultyRouter;
