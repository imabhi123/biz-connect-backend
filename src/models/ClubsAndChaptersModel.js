import mongoose from 'mongoose';

const ClubChapterSchema = new mongoose.Schema({
    chapterName: {
        type: String,
        required: true,
    },
    clubName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    incharge: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    image: {
        type: String,
        default: "/uploads/placeholder.png",
    },
}, { timestamps: true });

const ClubChapter = mongoose.model('ClubChapter', ClubChapterSchema);

export default ClubChapter;
