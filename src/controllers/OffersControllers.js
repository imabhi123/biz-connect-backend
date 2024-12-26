import Offer from '../models/OffersModel.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// Create a new offer
export const createOffer = async (req, res) => {
  const { title, image, creator, description } = req.body;

  if (!title || !image || !creator || !description) {
    return res.status(400).json({ message: 'All fields are required: title, image, creator.' });
  }

  try {
    let imageUrl = null;

    // If image is provided, upload it to Cloudinary
    if (image) {
      if (!image.startsWith("data:image")) {
        return res.status(400).json({ error: "Invalid image format" });
      }

      const uploadResponse = await uploadOnCloudinary(image);
      if (!uploadResponse) {
        return res.status(400).json({ error: "Failed to upload image" });
      }
      imageUrl = uploadResponse.url;
    }

    // Create the new offer with the Cloudinary image URL
    const newOffer = new Offer({ title, image: imageUrl, creator, description });
    await newOffer.save();

    res.status(201).json({ message: 'Offer created successfully', offer: newOffer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create offer', error: error.message });
  }
};


// Get all offers
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().populate('creator', 'name email');
    if (offers.length === 0) {
      return res.status(404).json({ message: 'No offers found' });
    }
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch offers', error: error.message });
  }
};

// Get a single offer by ID
export const getOfferById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Offer ID is required' });
  }

  try {
    const offer = await Offer.findById(id).populate('creator', 'name email');
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch offer', error: error.message });
  }
};

// Update an offer by ID
export const updateOffer = async (req, res) => {
  const { id } = req.params;
  const { title, image, description } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Offer ID is required' });
  }

  if (!title && !image && !description) {
    return res.status(400).json({ message: 'At least one field (title, image, or description) is required to update.' });
  }

  try {
    let updatedImage = image;

    // Handle image processing
    if (image) {
      if (image.startsWith("data:image")) {
        // If the image is in base64 format, upload it to Cloudinary
        const uploadResponse = await uploadOnCloudinary(image);
        if (!uploadResponse) {
          return res.status(400).json({ error: "Failed to upload image" });
        }
        updatedImage = uploadResponse.url; // Update with the Cloudinary URL
      } else if (!image.startsWith("http")) {
        // If the image format is invalid, return an error
        return res.status(400).json({ error: "Invalid image format" });
      }
      // If the image is a valid URL, use it as is
    }

    // Update the offer with the new data
    const updatedOffer = await Offer.findByIdAndUpdate(
      id,
      {
        title,
        image: updatedImage, // Use the processed or existing image URL
        description,
      },
      { new: true, runValidators: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.status(200).json({ message: 'Offer updated successfully', offer: updatedOffer });
  } catch (error) {
    console.error("Error updating offer:", error);
    res.status(500).json({ message: 'Failed to update offer', error: error.message });
  }
};

// Delete an offer by ID
export const deleteOffer = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Offer ID is required' });
  }

  try {
    const deletedOffer = await Offer.findByIdAndDelete(id);
    if (!deletedOffer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.status(200).json({ message: 'Offer deleted successfully', offer: deletedOffer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete offer', error: error.message });
  }
};
