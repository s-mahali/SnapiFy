import express from "express";
import {
  addComment,
  addNewPost,
  bookMarksPost,
  deleteComment,
  deletePost,
  getAllPosts,
  getCommentsOfPost,
  getUserPost,
  toggleLike,
  updatePost,
} from "../controller/post.js";

import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router
  .route("/addpost")
  .post(isAuthenticated, upload.single("postPic"), addNewPost);
router
  .route("/updatepost/:id")
  .put(isAuthenticated, upload.single("postPic"), updatePost);
router.route("/deletepost/:id").delete(isAuthenticated, deletePost);
router.route("/all").get(isAuthenticated, getAllPosts);
router.route("/userpost/all").get(isAuthenticated, getUserPost);
router.route("/like/:id").patch(isAuthenticated, toggleLike);
// router.route("/dislike/:id").get(isAuthenticated, disLikePost);
router.route("/comment/:id").post(isAuthenticated, addComment);
router.route("/comment/all/:id").get(isAuthenticated, getCommentsOfPost);
router.route("/deletecomment/:id").delete(isAuthenticated, deleteComment);
router.route("/bookmark/:id").get(isAuthenticated, bookMarksPost);

export default router;
