import Chapter from '../models/chaptersModel.js';
import Community from '../models/CommunityModel.js';
import { User } from '../models/userModel.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// Get all chapters
export const getAllChapters = async (req, res) => {
    try {
        const chapters = await Chapter.find({})
            .populate('president', 'communityName email contact designation image') // Populates president details
            .populate('vicePresident', 'communityName email contact designation image'); // Populates vicePresident details

        res.status(200).json(chapters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get chapter by ID
export const getChapterById = async (req, res) => {
    const { id } = req.params;
    try {
        const chapter = await Chapter.findById(id)
            .populate('president')
            .populate('vicePresident')
            .populate('creator');
        if (!chapter) return res.status(404).json({ error: "Chapter not found" });
        res.status(200).json(chapter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new chapter
export const createChapter = async (req, res) => {
    const {
        chapterName,
        Name,
        country,
        city,
        state,
        clubs,
        president,
        vicePresident,
        contactPresiden,
        contactVicePresident,
        creator,
        images,
    } = req.body;

    try {
        let imageUrls = [];

        // Handle image processing
        if (images && images.length > 0) {
            for (const image of images) {
                if (image.startsWith("data:image")) {
                    // If the image is in base64 format, upload it to Cloudinary
                    const uploadResponse = await uploadOnCloudinary(image);
                    if (!uploadResponse) {
                        return res.status(400).json({ error: "Failed to upload one or more images" });
                    }
                    imageUrls.push(uploadResponse.url);
                } else if (image.startsWith("http")) {
                    // If the image is a valid URL, use it as is
                    imageUrls.push(image);
                } else {
                    // If the image format is invalid, return an error
                    return res.status(400).json({ error: "Invalid image format" });
                }
            }
        }

        // Create a new chapter
        const newChapter = new Chapter({
            chapterName,
            Name,
            country,
            city,
            state,
            clubs,
            president,
            vicePresident,
            contactPresiden,
            contactVicePresident,
            creator,
            images: imageUrls,
        });

        const savedChapter = await newChapter.save();

        // Ensure the creator's chapters array includes the new chapter ID
        await User.findByIdAndUpdate(creator, { $addToSet: { chapters: savedChapter._id } });

        let presidentDetails = null;
        let vicePresidentDetails = null;

        // Ensure the president's chapters array includes the new chapter ID
        if (president) {
            const presidentCommunity = await Community.findById(president);
            if (!presidentCommunity) {
                return res.status(404).json({ error: "Community for the president not found" });
            }

            await User.findByIdAndUpdate(presidentCommunity.user, { $addToSet: { chapters: savedChapter._id } });
            presidentDetails = await User.findById(presidentCommunity.user);
        }

        // Ensure the vice president's chapters array includes the new chapter ID
        if (vicePresident) {
            const vicePresidentCommunity = await Community.findById(vicePresident);
            if (!vicePresidentCommunity) {
                return res.status(404).json({ error: "Community for the vice president not found" });
            }

            await User.findByIdAndUpdate(vicePresidentCommunity.user, { $addToSet: { chapters: savedChapter._id } });
            vicePresidentDetails = await User.findById(vicePresidentCommunity.user);
        }

        res.status(201).json({
            data: savedChapter,
            pres: presidentDetails,
            vicepres: vicePresidentDetails,
        });
    } catch (error) {
        console.error("Error creating chapter:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update a chapter
export const updateChapter = async (req, res) => {
    const { id } = req.params;
    const updates = { ...req.body };

    try {
        // Handle images processing
        if (updates.images && updates.images.length > 0) {
            let imageUrls = [];
            for (const image of updates.images) {
                if (image.startsWith("data:image")) {
                    // If the image is in base64 format, upload it to Cloudinary
                    const uploadResponse = await uploadOnCloudinary(image);
                    if (!uploadResponse) {
                        return res.status(400).json({ error: "Failed to upload one or more images" });
                    }
                    imageUrls.push(uploadResponse.url);
                } else if (image.startsWith("http")) {
                    // If the image is a valid URL, use it as is
                    imageUrls.push(image);
                } else {
                    // If the image format is invalid, return an error
                    return res.status(400).json({ error: "Invalid image format" });
                }
            }
            updates.images = imageUrls; // Update with the processed image URLs
        }

        // Update the chapter
        const updatedChapter = await Chapter.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedChapter) {
            return res.status(404).json({ error: "Chapter not found" });
        }

        // Ensure the chapter ID is added to the user's chapters array
        if (updates.creator) {
            await User.findByIdAndUpdate(updates.creator, { $addToSet: { chapters: id } });
        }

        let presidentt = null;
        let vicePresident = null;
        // Ensure the club ID is added to the user's clubs array
        if (updates.president) {
            // Fetch the Community document associated with the president
            const communityForPresident = await Community.findById(updates.president);
        
            if (!communityForPresident) {
                return res.status(404).json({ error: "Community for the president not found" });
            }
        
            // Update the president's clubs array with the Community ID
            await User.findByIdAndUpdate(communityForPresident.user, {
                $addToSet: { chapters: id }
            });
        
            // Retrieve the updated president details (if needed later)
            presidentt = await User.findById(communityForPresident.user);
        }
        
        if (updates.vicePresident) {
            // Fetch the Community document associated with the vice president
            const communityForVicePresident = await Community.findById( updates.vicePresident );
        
            if (!communityForVicePresident) {
                return res.status(404).json({ error: "Community for the vice president not found" });
            }
        
            // Update the vice president's clubs array with the Community ID
            await User.findByIdAndUpdate(communityForVicePresident?.user, {
                $addToSet: { chapters: id}
            });
        
            // Retrieve the updated vice president details (if needed later)
            vicePresident = await User.findById(communityForVicePresident?.user);
        }
        
        console.log(vicePresident,presidentt)

        res.status(200).json({data:updateChapter, pres:presidentt, vicepres:vicePresident});
    } catch (error) {
        console.error("Error updating chapter:", error);
        res.status(500).json({ error: error.message });
    }
};


export const findChaptersByLocation = async (req, res) => {
    const { country, state, city } = req.query;

    try {
        // Validate input
        if (!country || !state || !city) {
            return res.status(400).json({
                success: false,
                message: "Please provide country, state, and city."
            });
        }

        // Find chapters based on location
        const chapters = await Chapter.find({ country, state, city });

        // Check if any chapters were found
        if (chapters.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No chapters found for the specified location."
            });
        }

        // Return found chapters
        return res.status(200).json({
            success: true,
            data: chapters
        });
    } catch (error) {
        // Handle errors
        console.error("Error finding chapters:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving chapters.",
            error: error.message
        });
    }
};


// Delete a chapter
export const deleteChapter = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedChapter = await Chapter.findByIdAndDelete(id);
        if (!deletedChapter) return res.status(404).json({ error: "Chapter not found" });
        res.status(200).json({ message: "Chapter deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
