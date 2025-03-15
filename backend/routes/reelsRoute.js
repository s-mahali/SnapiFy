import express from "express";
import { addReel, commentOnReel, deleteReel, getReelById, getReels, getReelsByUser, incrementViews, isBookmarked, toggleLike, updateReel } from "../controller/reels.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/multer.js";

export const reelsRoute = express.Router();

reelsRoute.post("/addreel", isAuthenticated, upload.single("video"), addReel)
reelsRoute.delete("/deletereel/:reelId", isAuthenticated, deleteReel)
reelsRoute.put("/updatereel/:reelId", isAuthenticated, upload.single("video"), updateReel)
reelsRoute.get("/getreels", getReels)
reelsRoute.get("/getreel/:reelId", isAuthenticated, getReelById)
reelsRoute.get("/getreelsbyuser", isAuthenticated, getReelsByUser)
reelsRoute.get("/incrementviews/:reelId", isAuthenticated, incrementViews)
reelsRoute.patch("/like/:reelId", isAuthenticated, toggleLike)
reelsRoute.post("/comment/:reelId", isAuthenticated, commentOnReel)
reelsRoute.get("/rbookmark/:reelId", isAuthenticated, isBookmarked)

