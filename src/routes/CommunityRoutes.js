import express from 'express';
import {
    createCommunity,
    getAllCommunities,
    getCommunityById,
    updateCommunity,
    deleteCommunity,
    getUnapprovedCommunities,
    updateApprovalStatus,
    removeMemberFromCommunity,
    toggleCommunityStatus,
    addMemberToCommunity,
} from '../controllers/CommunityControllers.js'; // Adjust the path as per your structure

import { communityValidationRules } from '../middlewares/validator.js';

const router = express.Router();

// Create a new community
router.post('/', createCommunity);

// Get all communities
router.get('/', getAllCommunities);

router.get('/get-unapproved', getUnapprovedCommunities);

router.patch('/update-approval-status/:id', updateApprovalStatus);

// Get a single community by ID
router.get('/:id', getCommunityById);

// Update a community
router.put('/:id', communityValidationRules, updateCommunity);

// Delete a community
router.delete('/:id', deleteCommunity);
router.post("/add-member", addMemberToCommunity);
router.post("/toggle-status", toggleCommunityStatus);
router.post("/remove-member", removeMemberFromCommunity);


export default router;
