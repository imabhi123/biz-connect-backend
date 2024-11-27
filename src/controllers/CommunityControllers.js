import Community from '../models/CommunityModel.js'; // Adjust the path as per your structure
import { validationResult } from 'express-validator';

// Create a new community
export const createCommunity = async (req, res) => {
    console.log(req.body)
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
        } = req.body;

        const newCommunity = new Community({
            communityName,
            email,
            contact,
            designation,
            AssignId,
            description,
            image,
            creator,
        });

        const savedCommunity = await newCommunity.save();
        res.status(201).json(savedCommunity);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Get all communities
export const getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find().populate('creator', 'name email');
        res.status(200).json({communities:communities,message:'all communities fetched successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Get a single community by ID
export const getCommunityById = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id).populate('creator', 'name email');
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
        const updatedCommunity = await Community.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedCommunity) {
            return res.status(404).json({ message: 'Community not found' });
        }

        res.status(200).json(updatedCommunity);
    } catch (error) {
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
