import { studentModel } from "../../models/studentModel.js";
import { generateAnonymId } from "../../util/anonymGenerator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const studentLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const student = await studentModel.find({ username });
    if (!student || student.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    const isPasswordValid = student[0].password === password;
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: student[0]._id, username: student[0].username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      student: {
        id: student[0]._id,
        username: student[0].username,
        anonymId: student[0].anonymId,
        batch: student[0].batch,
      },
      userType: "student",
    });
  } catch (error) {
    console.error("Error during student login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addStudent = async (req, res) => {
  const { username, batch } = req.body;
  try {
    const existingStudent = await studentModel.findOne({ username });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }
    const anonymId = await generateAnonymId();
    // Password must be last 4 digits of username
    const password = username.slice(-4);
    const newStudent = new studentModel({
      username,
      password, // Hash the password
      anonymId,
      batch,
    });
    await newStudent.save();
    res.status(201).json({ message: "Student added successfully" });
  } catch (error) {
    console.error("Error during adding student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentProfile = async (req, res) => {
  const studentId = req.params.id;
  try {
    const student = await studentModel.findById(studentId, "-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({
      id: student._id,
      username: student.username,
      anonymId: student.anonymId,
      batch: student.batch,
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const studentLogout = (req, res) => {
  // Invalidate the token on the client side
  res.status(200).json({ message: "Logout successful" });
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await studentModel.find().populate("batch");
    console.log("Fetched all students:", students);
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching all students:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteStudent = async (req, res) => {
  const studentId = req.params.id;
  try {
    const student = await studentModel.findByIdAndDelete(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getStudentByBatch = async (req, res) => {
  const batchId = req.params.batchId;
  try {
    const students = await studentModel
      .find({ batch: batchId }, "-password")
      .populate("batch");
    if (!students || students.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found for this batch" });
    }
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students by batch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getStudentByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const student = await studentModel
      .findOne({ username }, "-password")
      .populate("batch");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student by username:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateStudent = async (req, res) => {
  const studentId = req.params.id;
  const { username, password, batch } = req.body;

  try {
    const updatedData = { username, batch };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }
    const updatedStudent = await studentModel.findByIdAndUpdate(
      studentId,
      updatedData,
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({
      message: "Student updated successfully",
      student: {
        id: updatedStudent._id,
        username: updatedStudent.username,
        anonymId: updatedStudent.anonymId,
        batch: updatedStudent.batch,
      },
    });
  } catch (error) {
    console.error("Error during updating student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentPassword = async (req, res) => {
  const studentId = req.params.id;
  try {
    const student = await studentModel.findById(studentId, "password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ password: student.password });
  } catch (error) {
    console.error("Error fetching student password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
