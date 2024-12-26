import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // Store the image as a Base64 string
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    newsPdf:{
      type: String,
      required: true,
      
    },
    category: {
      type: String,
      required: true,
      enum: ['All', 'General', 'Health', 'Sports', 'Technology', 'Hot News'],
      default: 'All'
    },
    newstype: {
      type: String,
      required: true,
      enum: ['Regular', 'HotNews', 'Breaking', 'Featured'],
      default: 'Regular'
    },
    author: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    dateAndTime: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true
  }
);

const News = mongoose.model("News", NewsSchema);

export default News;