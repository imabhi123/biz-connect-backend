import Reel from "../models/ReelsModel.js";

// Create a new Reel
export const createReel = async (req, res) => {
    const { description, creator } = req.body;

    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ message: "Video file is required" });
    }

    const videoPath = req.file.path; // Multer stores the file path in `req.file`

    try {
        const reel = new Reel({ videoPath, description, creator });
        await reel.save();
        res.status(201).json({ message: "Reel created successfully", reel });
    } catch (error) {
        res.status(500).json({ message: "Failed to create reel", error: error.message });
    }
};

// Fetch all Reels
export const getAllReels = async (req, res) => {
    try {
        const reels = await Reel.find().populate("creator", "name email"); // Assuming Admin model has name and email
        res.status(200).json(reels);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reels", error: error.message });
    }
};

// Fetch a Reel by ID
export const getReelById = async (req, res) => {
    const { id } = req.params;

    try {
        const reel = await Reel.findById(id).populate("creator", "name email");
        if (!reel) {
            return res.status(404).json({ message: "Reel not found" });
        }
        res.status(200).json(reel);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reel", error: error.message });
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
