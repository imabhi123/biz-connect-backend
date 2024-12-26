// Controller file
import Reel from "../models/ReelsModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create a new Reel
export const createReel = async (req, res) => {
    const { videoUrl, thumbnailUrl, title, description, category, type, creator } = req.body;

    // Validate required fields
    if (!videoUrl || !title || !type) {
        return res.status(400).json({ message: "Video URL, title, and type are required." });
    }

    try {
        // Upload thumbnail to Cloudinary if it exists
        let uploadedThumbnail = null;
        if (thumbnailUrl) {
            if (!thumbnailUrl.startsWith("data:image")) {
                return res.status(400).json({ message: "Invalid image format for thumbnail" });
            }

            const uploadResponse = await uploadOnCloudinary(thumbnailUrl);
            uploadedThumbnail = uploadResponse.url;
        }

        // Create a new reel entry
        const reel = new Reel({
            videoUrl,
            thumbnailUrl: uploadedThumbnail, // Save the Cloudinary URL of the thumbnail
            title,
            description,
            category,
            type,
            creator,
        });

        await reel.save();
        res.status(201).json({ message: "Reel created successfully", reel });
    } catch (error) {
        res.status(500).json({ message: "Failed to create reel", error: error.message });
    }
};
// Update feedback for a Reel
export const updateReelFeedback = async (req, res) => {
    const { reelId } = req.body; // Reel ID from request body
    const { action } = req.body; // Action ('like' or 'dislike')

    // Validate action
    if (!['like', 'dislike'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action. Use "like" or "dislike".' });
    }

    try {
        const reel = await Reel.findById(reelId);
        if (!reel) {
            return res.status(404).json({ message: 'Reel not found.' });
        }

        // Update feedback count
        if (action === 'like') {
            reel.likes += 1;
        } else if (action === 'dislike') {
            reel.likes = Math.max(0, reel.likes - 1); // Prevent negative likes
        }

        await reel.save();
        res.status(200).json({ message: `Reel ${action}d successfully.`, reel });
    } catch (error) {
        res.status(500).json({ message: "Failed to update feedback", error: error.message });
    }
};

// Fetch all Reels
export const getAllReels = async (req, res) => {
    try {
        const reels = await Reel.find().populate("creator", "username email"); // Assuming Admin model has username and email
        res.status(200).json(reels);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reels", error: error.message });
    }
};

// Fetch a Reel by ID
export const getReelById = async (req, res) => {
    const { id } = req.params;

    try {
        const reel = await Reel.findById(id).populate("creator", "username email");
        if (!reel) {
            return res.status(404).json({ message: "Reel not found" });
        }
        res.status(200).json(reel);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reel", error: error.message });
    }
};

// Update a Reel
export const updateReel = async (req, res) => {
    const { id } = req.params;
    const { videoUrl, thumbnailUrl, title, description, category, type } = req.body;

    try {
        let uploadedThumbnail = thumbnailUrl;

        // Handle thumbnail processing
        if (thumbnailUrl) {
            if (thumbnailUrl.startsWith("data:image")) {
                // If the thumbnail is in base64 format, upload it to Cloudinary
                const uploadResponse = await uploadOnCloudinary(thumbnailUrl);
                if (!uploadResponse) {
                    return res.status(400).json({ message: "Failed to upload thumbnail" });
                }
                uploadedThumbnail = uploadResponse.url; // Update with the Cloudinary URL
            } else if (!thumbnailUrl.startsWith("http")) {
                // If the thumbnail format is invalid, return an error
                return res.status(400).json({ message: "Invalid thumbnail format" });
            }
            // If the thumbnail is a valid URL, use it as is
        }

        // Find and update the reel
        const reel = await Reel.findByIdAndUpdate(
            id,
            {
                videoUrl,
                thumbnailUrl: uploadedThumbnail, // Use the processed or existing thumbnail URL
                title,
                description,
                category,
                type
            },
            { new: true, runValidators: true }
        );

        if (!reel) {
            return res.status(404).json({ message: "Reel not found" });
        }

        res.status(200).json({ message: "Reel updated successfully", reel });
    } catch (error) {
        console.error("Error updating reel:", error);
        res.status(500).json({ message: "Failed to update reel", error: error.message });
    }
};


// Delete a Reel
export const deleteReel = async (req, res) => {
    const { id } = req.params;

    try {
        const reel = await Reel.findByIdAndDelete(id);
        if (!reel) {
            return res.status(404).json({ message: "Reel not found" });
        }
        res.status(200).json({ message: "Reel deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete reel", error: error.message });
    }
};
