import express from 'express';
import { 
    createReel, 
    getAllReels, 
    getReelById, 
    updateReel, 
    deleteReel, 
    updateReelFeedback
} from '../controllers/BizReelsControllers.js';

const router = express.Router();

// Define routes for reels
router.post('/', createReel);
router.post('/feedback', updateReelFeedback); // Updated feedback route
router.get('/', getAllReels);
router.get('/:id', getReelById);
router.put('/:id', updateReel);
router.delete('/:id', deleteReel);

export default router;