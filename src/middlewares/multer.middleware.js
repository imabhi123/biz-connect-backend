import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/media"); // Directory to store media files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File filter to accept both image and video files
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".mp4", ".avi", ".mov", ".mkv", ".jpg", ".jpeg", ".png", ".gif"];
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only image and video files are allowed"), false);
    }
};

// Multer instance
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit size to 50MB
    fileFilter,
});

export default upload;
