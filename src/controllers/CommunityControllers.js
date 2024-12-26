import Community from '../models/CommunityModel.js'; // Adjust the path as per your structure
import { validationResult } from 'express-validator';
import { User } from '../models/userModel.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// Create a new community
export const createCommunity = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            communityName,
            email,
            contact,
            designation,
            AssignId,
            description,
            image,
            creator,
            approved
        } = req.body;

        let imageUrl = null;

        // Validate base64 image before uploading to Cloudinary
        if (image && !image.startsWith("data:image")) {
            return res.status(400).json({ error: "Invalid image format" });
        }

        // Upload the image to Cloudinary if provided
        if (image) {
            const uploadResponse = await uploadOnCloudinary(image);
            if (!uploadResponse) {
                return res.status(400).json({ error: "Failed to upload image" });
            }
            imageUrl = uploadResponse.url;
        }

        // Check if a user with the provided email already exists
        let existingUser = await User.findOne({ email });
        if (!existingUser) {
            // Create a new user for the community member
            const password = "Default@123"; // Default password
            existingUser = new User({
                email,
                fullName: communityName,
                image: imageUrl,
                mobile: contact,
                role: "member",
                password, // Hashing will be handled by the pre-save hook in the User model
            });
            await existingUser.save();
        }
        else{
            existingUser.role = 'member';
        }

        // Create the community entry
        const newCommunity = new Community({
            communityName,
            email,
            contact,
            designation,
            AssignId,
            description,
            image: imageUrl, // Use the Cloudinary URL here
            creator,
            approved,
            user: existingUser._id, // Link the user to the community
        });

        const savedCommunity = await newCommunity.save();
        res.status(201).json({
            community: savedCommunity,
            user: existingUser, // Optionally return the user object as well
        });
    } catch (error) {
        console.error("Error creating community:", error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Get all communities
export const getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find().populate("members").populate("creator").populate("user").exec();

        res.status(200).json({
            message: "Communities retrieved successfully",
            communities,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a single community by ID
export const getCommunityById = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id).populate('creator', 'name email').populate("user").exec();
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        res.status(200).json(community);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Update a community
export const updateCommunity = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { image } = req.body;
        let imageUrl = null;

        // Handle image processing
        if (image) {
            if (image.startsWith("data:image")) {
                // If the image is in base64 format, upload it to Cloudinary
                const uploadResponse = await uploadOnCloudinary(image);
                if (!uploadResponse) {
                    return res.status(400).json({ error: "Failed to upload image" });
                }
                imageUrl = uploadResponse.url; // Store the uploaded image URL
            } else if (image.startsWith("http")) {
                // If the image is already a valid URL, use it directly
                imageUrl = image;
            } else {
                // If the image format is invalid, return an error
                return res.status(400).json({ error: "Invalid image format" });
            }
        }

        // Prepare the update data
        const updates = { ...req.body };
        if (imageUrl) {
            updates.image = imageUrl; // Use the processed image URL
        }

        // Update the community
        const updatedCommunity = await Community.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedCommunity) {
            return res.status(404).json({ message: 'Community not found' });
        }

        res.status(200).json(updatedCommunity);
    } catch (error) {
        console.error('Error updating community:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Delete a community
export const deleteCommunity = async (req, res) => {
    try {
        const deletedCommunity = await Community.findByIdAndDelete(req.params.id);
        if (!deletedCommunity) {
            return res.status(404).json({ message: 'Community not found' });
        }
        res.status(200).json({ message: 'Community deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

export const getUnapprovedCommunities = async (req, res) => {
    try {
        // Find all communities where `approved` is false
        const unapprovedCommunities = await Community.find({ approved: "pending" })
            .populate("creator", "email fullName") // Populate creator info if needed
            .populate("user", "email fullName"); // Populate user info if needed

        res.status(200).json({
            success: true,
            count: unapprovedCommunities.length,
            data: unapprovedCommunities,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const updateApprovalStatus = async (req, res) => {
    const { id } = req.params; // Community ID from URL params
    const { approved } = req.body; // New approval status from request body

    try {
        // Check if the community exists
        const community = await Community.findById(id);
        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found",
            });
        }

        // Update the approval status
        community.approved = approved;
        community.status = 'active';
        const updatedCommunity = await community.save();

        res.status(200).json({
            success: true,
            message: `Community ${approved ? "approved" : "disapproved"} successfully`,
            data: updatedCommunity,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const addMemberToCommunity = async (req, res) => {
    const { communityId, userId } = req.body; // Assuming these are passed in the request body

    try {
        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        // Check if the user is already a member
        if (community.members.includes(userId)) {
            return res.status(400).json({ message: "User is already a member" });
        }

        // Add the user to the members array
        community.members.push(userId);
        await community.save();

        res.status(200).json({ message: "Member added successfully", community });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Toggle community status
export const toggleCommunityStatus = async (req, res) => {
    const { communityId } = req.body; // Assuming the community ID is passed in the request body

    try {
        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        // Toggle the status
        community.status = community.status === "blocked" ? "active" : "blocked";
        await community.save();

        res.status(200).json({ message: "Community status updated successfully", community });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Remove a member from a community
export const removeMemberFromCommunity = async (req, res) => {
    const { communityId, userId } = req.body; // Assuming these are passed in the request body

    try {
        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        // Check if the user is a member
        if (!community.members.includes(userId)) {
            return res.status(400).json({ message: "User is not a member of the community" });
        }

        // Remove the user from the members array
        console.log(community)
        community.members = community.members.filter(memberId => memberId.toString() !== userId);
        await community.save();

        res.status(200).json({ message: "Member removed successfully", community });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
 