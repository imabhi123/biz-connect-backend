import mongoose from 'mongoose';

const BusinessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status:{
        type:String,
        default:'Pending',
        enum:['Approved','Rejected','Pending']
    },
    role: {
      type: String,
      enum: ['member'],
      default: 'member',
    },
    step: {
      type: Number,
      default: 1,
    },

    // Step 1: Business Details
    businessName: {
      type: String,
    },
    pincode: {
      type: String,
    },
    address: {
      type: String,
    },
    areaName: {
      type: String,
    },
    landmark: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },

    // Step 2: Contact Details
    personName: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    whatsappNumber: {
      type: String,
    },
    email: {
      type: String,
    },

    // Step 3: Business Hours
    businessHours: {
      days: {
        type: [String],
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        default: [],
      },
      openingTime: {
        type: String,
      },
      closingTime: {
        type: String,
      },
    },

    // Step 4: Categories
    categories: {
      type: [String],
      default: [],
    },

    // Step 5: Business Description
    description: {
      type: String,
    },
    
    // Step 6: Images
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Business = mongoose.model('Business', BusinessSchema);
export default Business;
