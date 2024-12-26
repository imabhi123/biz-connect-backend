import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
cloudinary.config({
    cloud_name: "dnzqoglrs",
    api_key: "242552266216188",
    api_secret: "dJoHVyKmY-lQg9247Jy-w4u7vrc"
});

/**
 * Upload a base64 string directly to Cloudinary
 * @param {string} base64String - The base64 string to upload
 * @returns {Promise<object|null>} - The Cloudinary upload response or null if an error occurs
 */
const uploadOnCloudinary = async (base64String, type = 'image') => {
    try {
        if (!base64String) {
            throw new Error('Base64 string is missing');
        }

        let uploadOptions = {};
        if (type === 'image') {
            const regex = /^data:image\/(png|jpeg|jpg);base64,/;
            if (!regex.test(base64String)) {
                throw new Error('Invalid image format. Ensure the string includes the correct data URL prefix.');
            }
            uploadOptions = {
                overwrite: true,
                invalidate: true,
                width: 810,
                height: 456,
                crop: "fill",
            };
        } else if (type === 'pdf') {
            if (!base64String.startsWith('data:application/pdf;base64,')) {
                throw new Error('Invalid PDF format. Ensure the string includes the correct data URL prefix.');
            }
            uploadOptions = {
                resource_type: "auto", // Automatically determines the type
                format: "pdf",
                public_id: `news-pdfs/${Date.now()}`,
                use_filename: true,
                unique_filename: false, // Keeps the filename as provided
                overwrite: true,
                access_mode: 'public',
            };
        }

        const response = await cloudinary.uploader.upload(base64String, uploadOptions);

        console.log('Upload successful:', {
            url: response.url,
            public_id: response.public_id
        });

        return response;

    } catch (error) {
        console.error('Cloudinary Error:', {
            message: error.message || 'Unknown error',
            name: error.name,
            status: error.http_code || 'N/A'
        });
        throw error;
    }
};



export { uploadOnCloudinary };