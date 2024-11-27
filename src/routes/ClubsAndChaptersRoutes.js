import express from 'express';
import {
    getAllChapters,
    getChapterById,
    createChapter,
    updateChapter,
    deleteChapter,
} from '../controllers/ClubsAndChaptersControllers.js';

const router = express.Router();

// Route to get all chapters
router.get('/', async (req, res) => {
    await getAllChapters(req, res);
});

// Route to get a chapter by ID
router.get('/:id', async (req, res) => {
    await getChapterById(req, res);
});

// Route to create a new chapter
router.post('/', async (req, res) => {
    await createChapter(req, res);
});

// Route to update a chapter by ID
router.put('/:id', async (req, res) => {
    await updateChapter(req, res);
});

// Route to delete a chapter by ID
router.delete('/:id', async (req, res) => {
    await deleteChapter(req, res);
});

export default router;
