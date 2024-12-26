import mongoose from 'mongoose';

const ReelSchema = new mongoose.Schema(
  {
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 400,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    uploadTime: {
      type: String,
      default: "Just now",
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["short", "long"], // Allows only "short" or "long"
      required: true,
      default: "long", // Default to "long" video
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // Reference to the 'Admin' model
      required: true,
    },
  },
  {
    timestamps: true, // Adds 'createdAt' and 'updatedAt' automatically
  }
);

const Reel = mongoose.model("Reel", ReelSchema);

export default Reel;
