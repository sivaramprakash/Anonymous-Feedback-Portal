import { batchModel } from "../../models/batchModel.js";
import { subjectModel } from "../../models/subjectModel.js";

export const addBatch = async (req, res) => {
  const { batchName, batchDuration, subjects } = req.body;

  try {
    const newBatch = new batchModel({
      batchName,
      batchDuration,
      subjects,
    });

    await newBatch.save();
    res.status(201).json({ message: "Batch added successfully", newBatch });
  } catch (error) {
    console.error("Error during adding batch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllBatches = async (req, res) => {
  try {
    const batches = await batchModel.find();
    res.status(200).json(batches);
  } catch (error) {
    console.error("Error during fetching batches:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getBatchById = async (req, res) => {
  const { id } = req.params;

  try {
    const batch = await batchModel.findById(id);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    res.status(200).json(batch);
  } catch (error) {
    console.error("Error during fetching batch by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateBatch = async (req, res) => {
  const { id } = req.params;
  const { batchName, batchDuration, subjects } = req.body;

  try {
    const updatedBatch = await batchModel.findByIdAndUpdate(
      id,
      { batchName, batchDuration, subjects },
      { new: true }
    );

    if (!updatedBatch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res
      .status(200)
      .json({ message: "Batch updated successfully", updatedBatch });
  } catch (error) {
    console.error("Error during updating batch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteBatch = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBatch = await batchModel.findByIdAndDelete(id);

    if (!deletedBatch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json({ message: "Batch deleted successfully" });
  } catch (error) {
    console.error("Error during deleting batch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Faculty -> Subjects -> Batches

export const getBatchByFaculty = async (req, res) => {
  const facultyId = req.params.id;

  try {
    // Step 1: Find subject IDs handled by this faculty
    const subjects = await subjectModel
      .find({ faculty: facultyId })
      .select("_id");
    const subjectIds = subjects.map((s) => s._id);

    // Step 2: Find batches that include any of these subject IDs
    const batches = await batchModel.find({ subjects: { $in: subjectIds } });

    if (batches.length === 0) {
      return res
        .status(404)
        .json({ message: "No batches found for this faculty" });
    }

    res.status(200).json(batches);
  } catch (error) {
    console.error("Error fetching batches by faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
