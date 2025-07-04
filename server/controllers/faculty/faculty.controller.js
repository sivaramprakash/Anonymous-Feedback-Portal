import { facultyModel } from "../../models/facultyModel.js";
import jwt from "jsonwebtoken";

export const facultyLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const faculty = await facultyModel.findOne({ username, password });
    if (!faculty) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const isPasswordValid = faculty.password === password; // In a real application, you should hash the password and compare hashes
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: faculty._id, username: faculty.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      faculty: {
        id: faculty._id,
        name: faculty.name,
        username: faculty.username,
        handlingSubjects: faculty.handlingSubjects,
        batches: faculty.batches,
      },
      userType: "faculty",
    });
  } catch (error) {
    console.error("Error during faculty login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const addFaculty = async (req, res) => {
  const { username, password, name } = req.body;

  try {
    const existingFaculty = await facultyModel.findOne({ username });
    if (existingFaculty) {
      return res.status(400).json({ message: "Faculty already exists" });
    }
    const newFaculty = new facultyModel({
      username,
      password,
      name, // In a real application, you should hash the password
    });
    await newFaculty.save();
    res.status(201).json({ message: "Faculty added successfully" });
  } catch (error) {
    console.error("Error during adding faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getFaculty = async (req, res) => {
  const username = req.params.username;

  try {
    const faculty = await facultyModel.findOne({ username });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json({
      id: faculty._id,
      username: faculty.username,
      name: faculty.name,
      handlingSubjects: faculty.handlingSubjects,
      batches: faculty.batches,
    });
  } catch (error) {
    console.error("Error during fetching faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllFaculty = async (req, res) => {
  try {
    const faculties = await facultyModel.find();
    res.status(200).json(faculties);
  } catch (error) {
    console.error("Error during fetching all faculties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateFaculty = async (req, res) => {
  const facultyId = req.params.id;
  const { username, password, name } = req.body;

  try {
    const updatedFaculty = await facultyModel.findByIdAndUpdate(
      facultyId,
      { username, password, name }, // In a real application, you should hash the password
      { new: true }
    );
    if (!updatedFaculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json({
      message: "Faculty updated successfully",
      faculty: updatedFaculty,
    });
  } catch (error) {
    console.error("Error during updating faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteFaculty = async (req, res) => {
  const facultyId = req.params.id;

  try {
    const deletedFaculty = await facultyModel.findByIdAndDelete(facultyId);
    if (!deletedFaculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("Error during deleting faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const facultyLogout = (req, res) => {
  // Invalidate the token on the client side
  res.status(200).json({ message: "Logout successful" });
};

export const addSubjectToFaculty = async (req, res) => {
  const { facultyId, subjectId } = req.body;

  try {
    const faculty = await facultyModel.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    if (faculty.handlingSubjects.includes(subjectId)) {
      return res
        .status(400)
        .json({ message: "Subject already assigned to faculty" });
    }
    faculty.handlingSubjects.push(subjectId);
    await faculty.save();
    res.status(200).json({ message: "Subject added to faculty successfully" });
  } catch (error) {
    console.error("Error during adding subject to faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const removeSubjectFromFaculty = async (req, res) => {
  const { facultyId, subjectId } = req.body;

  try {
    const faculty = await facultyModel.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    if (!faculty.handlingSubjects.includes(subjectId)) {
      return res
        .status(400)
        .json({ message: "Subject not assigned to faculty" });
    }
    faculty.handlingSubjects = faculty.handlingSubjects.filter(
      (id) => id.toString() !== subjectId
    );
    await faculty.save();
    res
      .status(200)
      .json({ message: "Subject removed from faculty successfully" });
  } catch (error) {
    console.error("Error during removing subject from faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const addBatchToFaculty = async (req, res) => {
  const { facultyId, batchId } = req.body;

  try {
    const faculty = await facultyModel.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    if (faculty.batches.includes(batchId)) {
      return res
        .status(400)
        .json({ message: "Batch already assigned to faculty" });
    }
    faculty.batches.push(batchId);
    await faculty.save();
    res.status(200).json({ message: "Batch added to faculty successfully" });
  } catch (error) {
    console.error("Error during adding batch to faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const removeBatchFromFaculty = async (req, res) => {
  const { facultyId, batchId } = req.body;

  try {
    const faculty = await facultyModel.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    if (!faculty.batches.includes(batchId)) {
      return res.status(400).json({ message: "Batch not assigned to faculty" });
    }
    faculty.batches = faculty.batches.filter((id) => id.toString() !== batchId);
    await faculty.save();
    res
      .status(200)
      .json({ message: "Batch removed from faculty successfully" });
  } catch (error) {
    console.error("Error during removing batch from faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFaucultyPassword = async (req, res) => {
  const { username } = req.params;

  try {
    const faculty = await facultyModel.findOne(
      { username },
      { password: 1, _id: 0 }
    );
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json({ password: faculty.password });
  } catch (error) {
    console.error("Error during fetching faculty password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
