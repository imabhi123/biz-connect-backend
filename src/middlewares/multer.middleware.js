import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/videos"); // Directory to store videos
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File filter to accept only video files
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".mp4" || ext === ".avi" || ext === ".mov" || ext === ".mkv") {
        cb(null, true);
    } else {
        cb(new Error("Only video files are allowed"), false);
    }
};

// Multer instance
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit size to 50MB
    fileFilter,
});

export default upload;
