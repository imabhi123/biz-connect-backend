import express from 'express';
import {
  saveBusinessData,
  deleteBusinessById,
  getBusinessById,
  updateBusinessById,
  getSingleBusinessById,
  getAllBusinesses,
  getAllBusinessesByUser
  
} from '../controllers/businessController.js';

const router = express.Router();

/**
 * @route POST /api/business
 * @desc Save or update business data
 * @access Public
 */
router.post('/', saveBusinessData);
router.get('/', getAllBusinesses);

router.get('/user/:userId', getAllBusinessesByUser);
router.delete('/:id', deleteBusinessById);
router.put('/:id', updateBusinessById);
router.get('/:id', getSingleBusinessById);

export default router;
