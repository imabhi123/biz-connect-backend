import mongoose from 'mongoose';

const CommunitySchema = new mongoose.Schema({
    communityName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
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
    description:{
        type:String,
        required:true
    },
    joiningDate:{
        type:Date,
        default:Date.now
    },
    image: {
        type: String,
        default: "/uploads/placeholder.png",
    },
}, { timestamps: true });

const Community = mongoose.model('Community', CommunitySchema);

export default Community;
