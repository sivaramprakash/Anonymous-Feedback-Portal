import { subjectModel } from "../../models/subjectModel.js";

export const addSubject = async (req, res) => {
  const { subjectName, subjectCode, faculty } = req.body;

  try {
    const newSubject = new subjectModel({
      subjectName,
      subjectCode,
      faculty,
    });

    await newSubject.save();
    res.status(201).json({ message: "Subject added successfully", newSubject });
  } catch (error) {
    console.error("Error during adding subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await subjectModel.find().populate("faculty");
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error during fetching subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const subject = await subjectModel.findById(id).populate("faculty");
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(subject);
  } catch (error) {
    console.error("Error during fetching subject by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { subjectName, subjectCode, faculty } = req.body;

  try {
    const updatedSubject = await subjectModel.findByIdAndUpdate(
      id,
      { subjectName, subjectCode, faculty },
      { new: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res
      .status(200)
      .json({ message: "Subject updated successfully", updatedSubject });
  } catch (error) {
    console.error("Error during updating subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteSubject = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSubject = await subjectModel.findByIdAndDelete(id);

    if (!deletedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error during deleting subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getSubjectsByfacultyId = async (req, res) => {
  const { facultyId } = req.params;

  try {
    const subjects = await subjectModel
      .find({ faculty: facultyId })
      .populate("faculty");
    if (subjects.length === 0) {
      return res
        .status(404)
        .json({ message: "No subjects found for this faculty" });
    }
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error during fetching subjects by faculty ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
