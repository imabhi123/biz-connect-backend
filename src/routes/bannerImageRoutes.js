// routes/bannerImageRoutes.js
import express from 'express';
import {
    uploadBanner,
    getAllBannerImage,
    getBanner,
    deleteBanner
} from '../controllers/bannerImageController.js';

const router = express.Router();

router.post('/banners/upload', uploadBanner);
router.get('/banners', getAllBannerImage);
router.get('/banners/:page', getBanner);
router.delete('/banners/:page', deleteBanner);

export default router;