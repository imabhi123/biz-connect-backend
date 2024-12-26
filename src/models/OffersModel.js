import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true, // Base64 string or URL of the image
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
