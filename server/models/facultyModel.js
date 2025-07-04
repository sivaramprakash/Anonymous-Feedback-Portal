import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  handlingSubjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
  batches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
    },
  ],
});

export const facultyModel = mongoose.model("Faculty", facultySchema);
