import express from "express";
import {
  addSubject,
  deleteSubject,
  getAllSubjects,
  getSubjectById,
  getSubjectsByfacultyId,
  updateSubject,
} from "../../controllers/admin/subject.controller.js";

const subjectRouter = express.Router();

subjectRouter.get("/getAllSubjects", getAllSubjects);
subjectRouter.post("/createSubject", addSubject);
subjectRouter.put("/updateSubject/:id", updateSubject);
subjectRouter.delete("/deleteSubject/:id", deleteSubject);
subjectRouter.get("/getSubjectById", getSubjectById);
subjectRouter.get("/getSubjectsByfacultyId", getSubjectsByfacultyId);
subjectRouter.get("/getSubjectsByfacultyId/:facultyId", getSubjectsByfacultyId);

export default subjectRouter;
