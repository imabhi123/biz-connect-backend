import News from "../models/NewsModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Get all news items with optional filtering and pagination
const getAllNews = async (req, res) => {
  const { page = 1, limit = 10, category, newstype } = req.query;
  try {
    // Build filter object based on query parameters
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (newstype) filter.newstype = newstype;

    const news = await News.find(filter)
      .sort({ dateAndTime: -1 }) // Sort by date, newest first
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await News.countDocuments(filter);

    res.status(200).json({
      data: news,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching news items",
      error: error.message
    });
  }
};



// Create a new news item
const createNews = async (req, res) => {
  const {
    title,
    description,
    category,
    image,
    imageUrl,
    author,
    source,
    newstype,
    dateAndTime,
    newsPdf
  } = req.body;

  try {
    // Validate required fields
    if (!title || !description || !category || !author || !source || !newstype) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // Handle PDF validation and upload
    let finalPdfUrl = null;
    // if (newsPdf) {
    //   // Check if it's a valid base64 PDF
    //   if (!newsPdf.startsWith("data:application/pdf;base64,")) {
    //     return res.status(400).json({ error: "Invalid PDF format" });
    //   }

    //   // Check PDF size (base64 string length * 0.75 gives approximate size in bytes)
    //   const pdfSize = (newsPdf.length * 0.75) / 1024; // Convert to KB
    //   if (pdfSize > 200) {
    //     return res.status(400).json({ error: "PDF size must be under 200KB" });
    //   }

    //   const uploadResponse = await uploadOnCloudinary(newsPdf, 'pdf');
    //   if (!uploadResponse) {
    //     return res.status(400).json({ error: "Failed to upload PDF" });
    //   }
    //   finalPdfUrl = uploadResponse.url;
    // }

    // Handle image upload (existing logic)
    let finalImageUrl = imageUrl;
    if (!imageUrl && image) {
      if (!image.startsWith("data:image")) {
        return res.status(400).json({ error: "Invalid image format" });
      }

      const uploadResponse = await uploadOnCloudinary(image, 'image');
      if (!uploadResponse) {
        return res.status(400).json({ error: "Failed to upload image" });
      }
      finalImageUrl = uploadResponse.url;
    } else if (!imageUrl) {
      return res.status(400).json({
        message: "Either image or imageUrl must be provided"
      });
    }

    const news = new News({
      title,
      description,
      category,
      image: newsPdf,
      author,
      source,
      newstype,
      dateAndTime: dateAndTime || new Date(),
      newsPdf: newsPdf
    });

    await news.save();
    res.status(201).json({
      message: "News item created successfully",
      news
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating news item",
      error: error.message
    });
  }
};

// Update a news item
const updateNews = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  try {
    // Validate that the news item exists
    const existingNews = await News.findById(id);
    if (!existingNews) {
      return res.status(404).json({
        message: "News item not found"
      });
    }

    // Handle PDF update if provided
    // if (updateData.newsPdf) {
    //   if (!updateData.newsPdf.startsWith("data:application/pdf;base64,")) {
    //     return res.status(400).json({ error: "Invalid PDF format" });
    //   }

    //   // Check PDF size
    //   const pdfSize = (updateData.newsPdf.length * 0.75) / 1024; // Convert to KB
    //   if (pdfSize > 200) {
    //     return res.status(400).json({ error: "PDF size must be under 200KB" });
    //   }

    //   const uploadResponse = await uploadOnCloudinary(updateData.newsPdf, 'pdf');
    //   if (!uploadResponse) {
    //     return res.status(400).json({ error: "Failed to upload PDF" });
    //   }
    //   updateData.newsPdf;
    // }

    // Handle image update (existing logic)
    if (updateData.image) {
      if (updateData.image.startsWith("data:image")) {
        const uploadResponse = await uploadOnCloudinary(updateData.image, 'image');
        if (!uploadResponse) {
          return res.status(400).json({ error: "Failed to upload image" });
        }
        updateData.image = uploadResponse.url;
      } else if (!updateData.image.startsWith("http")) {
        return res.status(400).json({ error: "Invalid image format" });
      }
    }

    // Update the news item
    const updatedNews = await News.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      message: "News item updated successfully",
      news: updatedNews
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating news item",
      error: error.message
    });
  }
};

 

// Delete a news item
const deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNews = await News.findByIdAndDelete(id);
    if (!deletedNews) {
      return res.status(404).json({
        message: "News item not found"
      });
    }

    res.status(200).json({
      message: "News item deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting news item",
      error: error.message
    });
  }
};

// Get a single news item by ID
const getNewsById = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({
        message: "News item not found"
      });
    }

    res.status(200).json({
      data: news
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching news item",
      error: error.message
    });
  }
};

export {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  getNewsById
};