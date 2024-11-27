// db.js

import mongoose from 'mongoose';
 

const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URI)
    // Connect to MongoDB using the connection string from the environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: `);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
