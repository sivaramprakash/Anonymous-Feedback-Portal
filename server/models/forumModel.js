// This is an anonymous feedback portel
import mongoose from "mongoose";

const forumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    messages: [
      {
        message: {
          type: String,
          required: true,
          trim: true,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        replies: [
          {
            reply: {
              type: String,
              required: true,
            },
            createdBy: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Student",
              required: true,
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        like: [
          {
            student: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Student",
            },
          },
        ],
        dislike: [
          {
            student: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Student",
            },
          },
        ],
        approval: {
          type: String,
          enum: ["PENDING", "APPROVED", "REJECTED"],
          default: "PENDING",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const forumModel = mongoose.model("Forum", forumSchema);

export default forumModel;
