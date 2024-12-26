import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const notificationSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Admin', // Refers to the Admin model
    required: false, // Optional field
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically adds timestamp
  },
  isRead: {
    type: Boolean,
    default: false, // Helps track if the notification is read or not
  },
});

export default model('Notification', notificationSchema);
