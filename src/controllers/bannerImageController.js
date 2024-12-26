// controllers/BannerImageController.js
import BannerImage from '../models/bannerImageModel.js';
import fs from 'fs';
import path from 'path';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const saveBase64Image = (base64Data, uploadPath) => {
    // Remove data URL prefix if present
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
    
    // Generate unique filename
    const filename = `banner-${Date.now()}-${Math.round(Math.random() * 1E9)}.png`;
    const fullPath = path.join(uploadPath, filename);

    // Ensure upload directory exists
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Write file
    fs.writeFileSync(fullPath, base64Image, 'base64');

    return `uploads/banners/${filename}`;
};

export const uploadBanner = async (req, res) => {
    const { page, images } = req.body;

    // Validate input
    if (!page) {
        return res.status(400).json({ message: 'Page name is required.' });
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ message: 'At least one image (as base64) is required.' });
    }

    // Validate image count
    if (images.length > 5) {
        return res.status(400).json({ message: 'Maximum 5 images allowed.' });
    }

    try {
        // Upload images to Cloudinary
        const uploadedImages = [];
        for (let i = 0; i < images.length; i++) {
            if (!images[i].startsWith("data:image")) {
                return res.status(400).json({ error: `Invalid image format for image ${i + 1}` });
            }

            const uploadResponse = await uploadOnCloudinary(images[i]);
            if (!uploadResponse) {
                return res.status(400).json({ error: `Failed to upload image ${i + 1}` });
            }
            uploadedImages.push({ imageBase64: uploadResponse.url });
        }

        // Check if an entry already exists for the page
        const existingBanner = await BannerImage.findOne({ page });

        if (existingBanner) {
            // Replace old images with new ones
            existingBanner.images = uploadedImages;
            await existingBanner.save();

            return res.status(200).json({
                message: 'Banner images updated successfully.',
                banner: existingBanner
            });
        }

        // Create new banner entry
        const banner = new BannerImage({
            page,
            images: uploadedImages
        });
        await banner.save();

        res.status(201).json({
            message: 'Banner images uploaded successfully.',
            banner
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error.',
            error: error.message
        });
    }
};



export const getAllBannerImage = async (req, res) => {
    try {
        const banners = await BannerImage.find({});

        if (!banners || banners.length === 0) {
            return res.status(404).json({ message: 'No banner images found.' });
        }

        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ 
            message: 'Internal server error.', 
            error: error.message 
        });
    }
};

export const getBanner = async (req, res) => {
    const { page } = req.params;

    try {
        const banner = await BannerImage.findOne({ page });

        if (!banner) {
            return res.status(404).json({ message: 'Banner images not found for this page.' });
        }

        res.status(200).json(banner);
    } catch (error) {
        res.status(500).json({ 
            message: 'Internal server error.', 
            error: error.message 
        });
    }
};

export const deleteBanner = async (req, res) => {
    const { page } = req.params;

    try {
        const banner = await BannerImage.findOneAndDelete({ page });

        res.status(200).json({ message: 'Banner images deleted successfully.' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Internal server error.', 
            error: error.message 
        });
    }
};

export default {
    uploadBanner,
    getAllBannerImage,
    getBanner,
    deleteBanner
};