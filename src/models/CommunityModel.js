import mongoose from "mongoose";

const CommunitySchema = new mongoose.Schema({
    communityName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId], // Array of ObjectId
        ref: 'User' // Reference to the User model
    }
    ,
    status: {
        type: String,
        default: "blocked"
    },
    contact: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    AssignId: {
        type: String,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    description: {
        type: String,
        required: true,
    },
    joiningDate: {
        type: Date,
        default: Date.now,
    },
    approved: {
        type: String,
        enum: ["approved", "pending", "rejected"],
        default: 'pending'
    },
    image: {
        type: String,
        default: "/uploads/placeholder.png",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
    },
}, { timestamps: true });

const Community = mongoose.model('Community', CommunitySchema);

export default Community;
