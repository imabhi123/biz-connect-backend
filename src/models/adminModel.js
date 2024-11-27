import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // Ensure the username is stored in lowercase
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v); // Validates 10-digit mobile numbers
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    bizConnectJoiningDate: {
      type: Date,
      required: true,
      default: Date.now, // Default to the current date
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"], // Restrict to specific values
      required: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); // Hash password with bcrypt
  next();
});

// Compare password for authentication
adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate access token
adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // Token expiry from env
    }
  );
};

// Generate refresh token
adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // Token expiry from env
    }
  );
};

export const Admin = mongoose.model("Admin", adminSchema);
