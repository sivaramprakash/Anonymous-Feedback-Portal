import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  anonymId: {
    type: String,
    required: true,
    unique: true,
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    required: true,
  },
});

export const studentModel = mongoose.model("Student", studentSchema);
