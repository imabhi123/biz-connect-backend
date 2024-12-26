// models/BannerImage.js
import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    imageBase64: { type: String, required: true } // Store base64 string directly
});

const bannerImageSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
        unique: true // Ensure only one entry per page
    },
    images: [imageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }  
});

const BannerImage = mongoose.model('BannerImage', bannerImageSchema);

export default BannerImage;
