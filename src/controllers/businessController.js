import Business from '../models/businessModel.js'; // Adjust path as needed
import { uploadOnCloudinary } from '../utils/cloudinary.js';

/**
 * Validate step-specific data
 * @param {Object} data
 * @param {Number} step
 * @returns {Object} { valid, message }
 */
const validateStepData = (data, step) => {
  switch (step) {
    case 1:
      if (!data.businessName || !data.pincode || !data.city || !data.state) {
        return { valid: false, message: 'Missing required fields for step 1.' };
      }
      break;
    case 2:
      if (!data.personName || !data.mobileNumber || !data.email) {
        return { valid: false, message: 'Missing required fields for step 2.' };
      }
      break;
    case 3:
      if (!data.businessHours) {
        return { valid: false, message: 'Missing required fields for step 3.' };
      }
      break;
    case 4:
      if (!data.categories || !Array.isArray(data.categories)) {
        return { valid: false, message: 'Categories must be an array for step 4.' };
      }
      break;
    case 5:
      if (!data.description) {
        return { valid: false, message: 'Missing description for step 5.' };
      }
      break;
    case 6:
      if (!data.images || !Array.isArray(data.images)) {
        return { valid: false, message: 'Images must be an array for step 6.' };
      }
      break;
    default:
      return { valid: false, message: 'Invalid step.' };
  }
  return { valid: true };
};

/**
 * Create or Update Business Data
 * @param {Object} req
 * @param {Object} res
 */

export const saveBusinessData = async (req, res) => {
  const { userId, step, _id } = req.body;

  if (!userId || !step) {
    return res.status(400).json({ message: 'User ID and Step are required.' });
  }

  const { valid, message } = validateStepData(req.body, step);
  if (!valid) {
    return res.status(400).json({ message });
  }

  try {
    let imageUrls = [];

    // Handle image uploads for step 6
    if (step === 6 && req.body.images) {
      const imagePromises = req.body.images.map(async (image) => {
        if (image.startsWith('data:image')) {
          const uploadResponse = await uploadOnCloudinary(image);
          if (!uploadResponse) throw new Error('Failed to upload image');
          return uploadResponse.url;
        } else if (!image.startsWith('http')) {
          throw new Error('Invalid image format');
        }
        return image; // Keep existing valid URLs
      });

      imageUrls = await Promise.all(imagePromises);
      req.body.images = imageUrls; // Replace images with uploaded URLs
    }

    if (_id) {
      // Update existing business
      const updatedBusiness = await Business.findByIdAndUpdate(
        _id,
        { $set: req.body },
        { new: true } // Return the updated document
      );

      if (!updatedBusiness) {
        return res.status(404).json({ message: 'Business not found.' });
      }

      return res.status(200).json({
        message: `Business data for step ${step} has been updated.`,
        data: updatedBusiness,
      });
    } else {
      // Create a new business
      const newBusiness = new Business(req.body);
      await newBusiness.save();

      return res.status(201).json({
        message: `New business data for step ${step} has been created.`,
        data: newBusiness,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * Get All Businesses by User ID
 * @param {Object} req
 * @param {Object} res
 */
export const getAllBusinessesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const businesses = await Business.find({ userId: userId });

    if (!businesses.length) {
      return res.status(404).json({ message: 'No businesses found for the user.' });
    }

    res.status(200).json({ data: businesses });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * Get a Single Business by ID
 * @param {Object} req
 * @param {Object} res
 */
export const getBusinessById = async (req, res) => {
  const { userId } = req.params;

  try {
    const business = await Business.find({ userId });

    if (!business) {
      return res.status(404).json({ message: 'Business not found.' });
    }

    res.status(200).json({ data: business });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * Delete a Business by ID
 * @param {Object} req
 * @param {Object} res
 */
export const deleteBusinessById = async (req, res) => {
  const { userId } = req.params;

  try {
    const business = await Business.findByIdAndDelete(userId);

    if (!business) {
      return res.status(404).json({ message: 'Business not found.' });
    }

    res.status(200).json({ message: 'Business deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * Update a Single Business by ID
 * @param {Object} req
 * @param {Object} res
 */
export const updateBusinessById = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  try {
    // Handle image uploads
    if (updateData.images && Array.isArray(updateData.images)) {
      const imagePromises = updateData.images.map(async (image) => {
        if (image.startsWith('data:image')) {
          const uploadResponse = await uploadOnCloudinary(image);
          if (!uploadResponse) throw new Error('Failed to upload image');
          return uploadResponse.url;
        } else if (!image.startsWith('http')) {
          throw new Error('Invalid image format');
        }
        return image; // Keep existing valid URLs
      });

      updateData.images = await Promise.all(imagePromises);
    }

    // Find and update the business
    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    if (!updatedBusiness) {
      return res.status(404).json({ message: 'Business not found.' });
    }

    res.status(200).json({
      message: 'Business updated successfully.',
      data: updatedBusiness,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
* Get a Single Business by ID
* @param {Object} req
* @param {Object} res
*/
export const getSingleBusinessById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the business by ID
    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({ message: 'Business not found.' });
    }

    res.status(200).json({
      message: 'Business retrieved successfully.',
      data: business,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find();
    res.status(200).json({
      message: 'Businesses retrieved successfully.',
      data: businesses,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
