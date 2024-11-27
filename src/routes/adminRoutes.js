import { Router } from "express";
import { getAllUsers, getProfile,  loginAdmin, updateProfile } from "../controllers/adminController.js";

const router = Router();

router.route("/login").post(loginAdmin);
router.route("/profile").post(getProfile);
router.route("/profile/update").put(updateProfile);
router.route('/get-all-users').get(getAllUsers);

export default router;
