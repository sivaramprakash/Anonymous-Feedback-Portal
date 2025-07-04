import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true,
    },
    subjectCode: {
        type: String,
        required: true,
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
        required: true,
    },
});

export const subjectModel = mongoose.model("Subject", subjectSchema);