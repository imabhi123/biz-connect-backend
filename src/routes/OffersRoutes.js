import express from 'express';
import {
  createOffer,
  getOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
} from '../controllers/OffersControllers.js';

const router = express.Router();

// Route for creating an offer
router.post('/', async (req, res) => {
  try {
    await createOffer(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Route for fetching all offers
router.get('/', async (req, res) => {
  try {
    await getOffers(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Route for fetching a single offer by ID
router.get('/:id', async (req, res) => {
  try {
    await getOfferById(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Route for updating an offer by ID
router.put('/:id', async (req, res) => {
  try {
    await updateOffer(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Route for deleting an offer by ID
router.delete('/:id', async (req, res) => {
  try {
    await deleteOffer(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

export default router;
