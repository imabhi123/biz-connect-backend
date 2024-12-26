import express from 'express';
import { 
    getAllClubs, 
    getClubById, 
    createClub, 
    updateClub, 
    deleteClub, 
    findClubsByLocation
} from '../controllers/clubControllers.js';

const router = express.Router();

// Get all clubs
router.get('/', getAllClubs);

// Get a club by ID
router.get('/:id', getClubById);

// Create a new club
router.post('/', createClub);

// Update a club by ID
router.put('/:id', updateClub);
router.get('/find-clubs/by-location', findClubsByLocation);

// Delete a club by ID
router.delete('/:id', deleteClub);

export default router;
