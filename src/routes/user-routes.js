import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserProfileWithAssociations, googleLoginUser, googleRegisterUser, loginUser, logoutUser, purchasePlan, refreshAccessToken, registerUser, updateAccountDetails, updateProfile, updateUserprofilePicture } from "../controllers/user-controller.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
  registerUser
);
router.route("/google-register").post(
  googleRegisterUser
);

router.route("/login").post(loginUser);
router.route("/get-profile").post(getUserProfileWithAssociations);
router.route("/google-login").post(googleLoginUser);

//secured routes
router.route('/logout').post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(changeCurrentPassword);
router.route("/purchase-plan").post(purchasePlan);
router.route("/current-user").get(verifyJWT,getCurrentUser);
router.route("/update-details").patch(verifyJWT,updateAccountDetails);
router.route("/update-profile").post(updateProfile);


router.route("/profilePicture").post(updateUserprofilePicture);
router.route('/name').get((req,res)=>{
res.json({name:'abhisehkkk'})
})


export default router;
