const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      id: { type: Number, required: true },
      email: { type: String, required: true },
    },
    likes: [
      {
        userid: { type: Number, required: true },
        email: { type: String, required: true },
      },
    ],
    comments: [
      {
        user: { type: String },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

mongoose.model("Post", postSchema);
