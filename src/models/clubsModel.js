import mongoose from 'mongoose';

const ClubSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    clubName: {
        type: String,
        required: true,
    },
    type:{
        type:String,
        default:'club'
    },
    country:{
        type:String,
        required:true,
        default:'IN'
    },
    state:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    chapter:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chapter'
    },
    president:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Community'
    },
    vicePresident:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Community'
    },
    contactPresiden: {
        type: String,
        required: true,
    },
    contactVicePresident:{
        type: String,
        required: true,
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

const Club = mongoose.model('Club', ClubSchema);

export default Club;
