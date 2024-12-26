import Club from '../models/clubsModel.js';
import Community from '../models/CommunityModel.js';
import { User } from '../models/userModel.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// Get all clubs
export const getAllClubs = async (req, res) => {
    try {
        const clubs = await Club.find()
            .populate('chapter')
            .populate('president', 'communityName email contact designation image') // Populates president details
            .populate('vicePresident', 'communityName email contact designation image');
        res.status(200).json(clubs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get club by ID
export const getClubById = async (req, res) => {
    const { id } = req.params;
    try {
        const club = await Club.findById(id)
            .populate('chapter')
            .populate('president')
            .populate('vicePresident')
            .populate('creator');
        console.log(club)
        if (!club) return res.status(404).json({ error: "Club not found" });
        res.status(200).json(club);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const findClubsByLocation = async (req, res) => {
    const { country, state, city } = req.query;
    console.log(req.query)

    try {
        // Validate input
        if (!country || !state || !city) {
            return res.status(400).json({
                success: false,
                message: "Please provide country, state, and city."
            });
        }

        // Find clubs based on location
        const clubs = await Club.find({ country, state, city });

        // Check if any clubs were found
        if (clubs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No clubs found for the specified location."
            });
        }

        // Return found clubs
        return res.status(200).json({
            success: true,
            data: clubs
        });
    } catch (error) {
        // Handle errors
        console.error("Error finding clubs:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving clubs.",
            error: error.message
        });
    }
};

// Create a new club
export const createClub = async (req, res) => {
    const {
        Name,
        clubName,
        country,
        city,
        state,
        chapter,
        president,
        vicePresident,
        contactPresiden,
        contactVicePresident,
        creator,
        images,
    } = req.body;

    try {
        let imageUrls = [];

        // Handle images processing
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

        // Create a new club
        const newClub = new Club({
            Name,
            clubName,
            country,
            city,
            state,
            chapter,
            president,
            vicePresident,
            contactPresiden,
            contactVicePresident,
            creator,
            images: imageUrls,
        });

        const savedClub = await newClub.save();

        // Ensure the creator's clubs array includes the new club ID
        await User.findByIdAndUpdate(creator, { $addToSet: { clubs: savedClub._id } });

        let presidentDetails = null;
        let vicePresidentDetails = null;

        // Ensure the president's clubs array includes the new club ID
        if (president) {
            const presidentCommunity = await Community.findById(president);
            if (!presidentCommunity) {
                return res.status(404).json({ error: "Community for the president not found" });
            }

            await User.findByIdAndUpdate(presidentCommunity.user, { $addToSet: { clubs: savedClub._id } });
            presidentDetails = await User.findById(presidentCommunity.user);
        }

        // Ensure the vice president's clubs array includes the new club ID
        if (vicePresident) {
            const vicePresidentCommunity = await Community.findById(vicePresident);
            if (!vicePresidentCommunity) {
                return res.status(404).json({ error: "Community for the vice president not found" });
            }

            await User.findByIdAndUpdate(vicePresidentCommunity.user, { $addToSet: { clubs: savedClub._id } });
            vicePresidentDetails = await User.findById(vicePresidentCommunity.user);
        }

        res.status(201).json({
            data: savedClub,
            pres: presidentDetails,
            vicepres: vicePresidentDetails,
        });
    } catch (error) {
        console.error("Error creating club:", error);
        res.status(500).json({ error: error.message });
    }
};


// Update a club
export const updateClub = async (req, res) => {
    const { id } = req.params;
    const updates = { ...req.body };
    console.log(updates)

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

        // Update the club
        const updatedClub = await Club.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!updatedClub) {
            return res.status(404).json({ error: "Club not found" });
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
                $addToSet: { clubs: id }
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
                $addToSet: { clubs: id}
            });
        
            // Retrieve the updated vice president details (if needed later)
            vicePresident = await User.findById(communityForVicePresident?.user);
        }
        
        console.log(vicePresident,presidentt)

        res.status(200).json({data:updatedClub, pres:presidentt, vicepres:vicePresident});
    } catch (error) {
        console.error("Error updating club:", error);
        res.status(500).json({ error: error.message });
    }
};


// Delete a club
export const deleteClub = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedClub = await Club.findByIdAndDelete(id);
        if (!deletedClub) return res.status(404).json({ error: "Club not found" });
        res.status(200).json({ message: "Club deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
