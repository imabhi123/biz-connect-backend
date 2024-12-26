import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema({
    chapterName: {
        type: String,
        required: true,
    },
    country:{
        type:String,
        required:true,
        default:'IN'
    },
    type:{
        type:String,
        default:'chapter'
    },
    state:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    president: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    },
    vicePresident: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    },
    contactPresiden: {
        type: String,
        required: true,
    },
    contactVicePresident: {
        type: String,
        required: true,
    },
    clubs:{
        type: [mongoose.Types.ObjectId],
        ref: 'Club'
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    images: {
        type: [String],
        default: ["http://res.cloudinary.com/dnzqoglrs/image/upload/v1735016948/fxp9chefvbko7ec2ovly.jpg"],
    },
}, { timestamps: true });

const Chapter = mongoose.model('Chapter', ChapterSchema);

export default Chapter;
