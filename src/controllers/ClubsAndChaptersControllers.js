import ClubChapter from '../models/ClubsAndChaptersModel.js';
import mongoose from 'mongoose';

// Get all club chapters
export const getAllChapters = async (req, res) => {
    try {
        const chapters = await ClubChapter.find().populate('creator', 'name email');
        res.status(200).json(chapters);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get a single club chapter by ID
export const getChapterById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Club Chapter ID' });
    }

    try {
        const chapter = await ClubChapter.findById(id).populate('creator', 'name email');
        if (!chapter) {
            return res.status(404).json({ message: 'Club Chapter not found' });
        }
        res.status(200).json(chapter);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Create a new club chapter
export const createChapter = async (req, res) => {
    const { chapterName, clubName, location, incharge, contact, creator, image } = req.body;

    // Validate required fields
    if (!chapterName || !clubName || !location || !incharge || !contact) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    try {
        const newChapter = new ClubChapter({
            chapterName,
            clubName,
            location,
            incharge,
            contact,
            creator,
            image,
        });

        const savedChapter = await newChapter.save();
        res.status(201).json(savedChapter);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create Club Chapter', error: error.message });
    }
};

// Update a club chapter by ID
export const updateChapter = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Club Chapter ID' });
    }

    try {
        const updatedChapter = await ClubChapter.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedChapter) {
            return res.status(404).json({ message: 'Club Chapter not found' });
        }

        res.status(200).json(updatedChapter);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update Club Chapter', error: error.message });
    }
};

// Delete a club chapter by ID
export const deleteChapter = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Club Chapter ID' });
    }

    try {
        const deletedChapter = await ClubChapter.findByIdAndDelete(id);

        if (!deletedChapter) {
            return res.status(404).json({ message: 'Club Chapter not found' });
        }

        res.status(200).json({ message: 'Club Chapter deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
