import { Admin } from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    // Verify the refresh token
    const decoded = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find admin by ID
    const admin = await Admin.findById(decoded._id);
    if (!admin || admin.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate a new access token
    const newAccessToken = admin.generateAccessToken();

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh token error: ", error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};


export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Find admin by username
    let admin = await Admin.findOne({ username });
    console.log(admin)
    // If admin doesn't exist, create a new admin
    if (!admin) {
      return res
        .status(404)
        .json({ message: "Admin not found" });
    }

    // If admin exists, check if the password is correct
    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens for existing admin
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    // Save the refresh token to the admin document in the database
    admin.refreshToken = refreshToken;
    console.log(admin, '--->adkfjs');
    await admin.save();
    console.log(admin);

    // Send tokens as a response
    res.status(200).json({
      accessToken,
      refreshToken,
      admin,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changeAdminPassword = async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  // Validate input
  if (!username || !oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Username, old password, and new password are required" });
  }

  try {
    // Find admin by username
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Verify the old password
    const isPasswordValid = await admin.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Update the password
    admin.password = newPassword; // Assuming password hashing is handled in the model's `save` method
    await admin.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleServerError = (res, error, message) => {
  res.status(500).json({ message, error });
};

export const getProfile = async (req, res) => {
  const { token } = req.body;
  console.log(token)

  // Check if the token is provided
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    // Verify the token
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded, 'dflksdf')

    // Find the admin using the ID from the decoded token
    const admin = await Admin.findById(decoded._id);

    // If admin is not found
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Generate a new access token
    const newAccessToken = admin.generateAccessToken();

    // Send the profile details and new token in the response
    res.status(200).json({
      user: admin,
      accessToken: newAccessToken,
      message: "Profile fetched successfully",
    });
  } catch (error) {
    console.error("Profile fetch error: ", error);

    // If token is invalid or expired
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please log in again" });
    }

    // Other errors related to token verification
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const ListUsers = async (req, res) => {

  try {
    // Verify the token
  
  } catch (error) {
    console.error("Profile fetch error: ", error);

    // If token is invalid or expired
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please log in again" });
    }

    // Other errors related to token verification
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      message: "Users retrieved successfully!",
      data: users,
    });
  } catch (error) {

  }
}

export const createAdmin = async (req, res) => {
  const { username, password, fullName, email, mobile, dateOfBirth, bizConnectJoiningDate, gender, designation } = req.body;

  // Validate required fields
  if (!username || !password || !email || !mobile || !dateOfBirth || !gender) {
    return res.status(400).json({ message: "All required fields must be provided" });
  }

  try {
    // Check if the username or email already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }, { mobile }] });
    if (existingAdmin) {
      return res.status(409).json({ message: "Username, email, or mobile already exists" });
    }

    // Create a new admin
    const newAdmin = new Admin({
      username,
      password,
      fullName,
      email,
      mobile,
      dateOfBirth,
      bizConnectJoiningDate,
      gender,
      designation,
    });

    // Save the admin to the database
    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Error creating admin: ", error);
    res.status(500).json({ message: "An error occurred while creating the admin" });
  }
};

export const updateProfile = async (req, res) => {
  const { 
    fullName, 
    email, 
    mobile, 
    gender, 
    dateOfBirth, 
    bizConnectJoiningDate 
  } = req.body;

  // Check if authorization header exists
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Authorization token is required" });
  }

  // Extract token from Authorization header (Bearer token)
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Token is required" });
  }

  try {
    // Verify the token
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find admin by ID
    const admin = await Admin.findById(decoded._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Validate input fields
    const validationErrors = [];
    
    if (!fullName) validationErrors.push("Name is required");
    if (!email) validationErrors.push("Email is required");
    if (!mobile) validationErrors.push("Mobile number is required");
    if (!gender) validationErrors.push("Gender is required");
    if (!dateOfBirth) validationErrors.push("Date of Birth is required");
    if (!bizConnectJoiningDate) validationErrors.push("Biz Network Joining Date is required");

    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }

    // Update fields
    admin.fullName = fullName;
    admin.username = email; // Assuming username is the email field
    admin.mobile = mobile;
    admin.gender = gender;
    admin.dateOfBirth = new Date(dateOfBirth);
    admin.bizConnectJoiningDate = new Date(bizConnectJoiningDate);

    // Save the updated admin
    await admin.save();

    // Prepare response (exclude sensitive information)
    const responseAdmin = {
      _id: admin._id,
      username: admin.username,
      fullName: admin.fullName,
      mobile: admin.mobile,
      gender: admin.gender,
      dateOfBirth: admin.dateOfBirth,
      bizConnectJoiningDate: admin.bizConnectJoiningDate
    };

    res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully", 
      user: responseAdmin 
    });
  } catch (error) {
    console.error("Update error: ", error);
    
    // Handle specific error types
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: "An error occurred while updating the profile" 
    });
  }
};

export const deleteAdmin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    // Verify the token
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find and delete the admin
    const admin = await Admin.findByIdAndDelete(decoded._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Delete error: ", error);
    res.status(500).json({ message: "An error occurred while deleting the admin" });
  }
};


export const toggleVerification = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the verification status
    user.verified = !user.verified;

    // Save the updated user
    await user.save();

    return res.status(200).json({
      message: "User verification status updated successfully",
      verified: user.verified,
    });
  } catch (error) {
    console.error("Error toggling verification status:", error);
    return res.status(500).json({
      message: "An error occurred while updating verification status",
      error: error.message,
    });
  }
};