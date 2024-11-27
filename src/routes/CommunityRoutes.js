import express from 'express';
import {
    createCommunity,
    getAllCommunities,
    getCommunityById,
    updateCommunity,
    deleteCommunity,
} from '../controllers/CommunityControllers.js'; // Adjust the path as per your structure

import { communityValidationRules } from '../middlewares/validator.js';

const router = express.Router();

// Create a new community
router.post('/', createCommunity);

// Get all communities
router.get('/', getAllCommunities);

// Get a single community by ID
router.get('/:id', getCommunityById);

// Update a community
router.put('/:id', communityValidationRules, updateCommunity);

// Delete a community
router.delete('/:id', deleteCommunity);

export default router;
