const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true, trim: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Newsletter.comments",
    }, // subcomments
  },
  { timestamps: true }
);

// Deep Dive subdocument schema
const DeepDiveSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    picture: { type: String, required: true }, // expected to be a URL or path
    pdf: { type: String, required: true }, // expected to be a URL or path
  },
  { _id: false }
);

// Validator to ensure no more than 4 deep dives
function deepDiveArrayLimit(val) {
  return !Array.isArray(val) || val.length <= 4;
}

const NewsletterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    picture: { type: String }, // optional thumbnail/image
    pdf: { type: String }, // optional newsletter PDF
    deepDives: {
      type: [DeepDiveSchema],
      validate: [deepDiveArrayLimit, "Deep dives cannot exceed 3 items"],
    },
    includedUsers: [{ type: String }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "published"],
      default: "draft",
    },
    scheduledAt: { type: Date },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Newsletter", NewsletterSchema);