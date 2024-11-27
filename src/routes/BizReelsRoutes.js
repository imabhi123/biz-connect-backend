import express from "express";
import { body, param } from "express-validator";
import {
    createReel,
    getAllReels,
    getReelById,
    deleteReel,
} from "../controllers/BizReelsControllers.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

// Create Reel Route (with Multer for video uploads)
router.post(
    "/",
    upload.single("video"), // Handle single file upload with field name "video"
    [
        body("description")
            .notEmpty()
            .withMessage("Description is required")
            .isLength({ max: 250 })
            .withMessage("Description cannot exceed 250 characters"),
        body("creator").notEmpty().withMessage("Creator is required"),
    ],
    createReel
);

// Fetch all Reels Route
router.get("/", getAllReels);

// Fetch a Reel by ID Route
router.get(
    "/:id",
    [param("id").isMongoId().withMessage("Invalid Reel ID")],
    getReelById
);

// Delete Reel Route
router.delete(
    "/:id",
    [param("id").isMongoId().withMessage("Invalid Reel ID")],
    deleteReel
);

export default router;
