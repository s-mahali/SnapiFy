import express from 'express';
import { register,login,logout } from '../controller/auth.js';
import { editProfile, followOrunfollow, getProfile, getSuggestedUsers } from '../controller/profile.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { upload } from '../middlewares/multer.js';


const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/profile/:id").get(isAuthenticated, getProfile);
router.route("/profile/edit").put(isAuthenticated,upload.single("profilePic"), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followOrunfollow/:id').post(isAuthenticated, followOrunfollow);

export default router;