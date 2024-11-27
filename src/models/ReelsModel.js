// models/Reel.js
import mongoose from "mongoose";

const reelSchema = new mongoose.Schema({
    videoPath: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 250,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Admin'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Reel = mongoose.model("Reel", reelSchema);

export default Reel;
