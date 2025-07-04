import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
    batchName:{
        type: String,
        required: true,
    },
    batchDuration: {
        type: String,
        required: true,
    },
    subjects: {
        type: [String],
        required: true,
    },
});
export const batchModel = mongoose.model("Batch", batchSchema);