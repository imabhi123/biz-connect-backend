import express from 'express';
import {
    getAllChapters,
    getChapterById,
    createChapter,
    updateChapter,
    deleteChapter,
    findChaptersByLocation
} from '../controllers/chapterController.js';

const router = express.Router();

// Get all chapters
router.get('/', getAllChapters);

// Get a chapter by ID
router.get('/:id', getChapterById);

// Create a new chapter
router.post('/', createChapter);

// Update a chapter by ID
router.put('/:id', updateChapter);
router.get('/find-chapters/by-location', findChaptersByLocation);
// Delete a chapter by ID
router.delete('/:id', deleteChapter);

export default router;
