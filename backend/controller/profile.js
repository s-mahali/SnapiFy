import User from "../models/user.js";
import { getDataUri } from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
      .populate({ path: "posts", createdAt: -1 })
      .populate("postBookmarks")
      .populate("reelBookmarks")
      .select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "user not found", success: false });
    }

    return res.status(200).json({ user, success: true, message: "welcome" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender, username } = req.body;
    const profilePic = req.file;
    let cloudinaryResponse;

    if (profilePic) {
      const fileUri = getDataUri(profilePic);
      cloudinaryResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "user not found", success: false });
    }
    bio ? (user.bio = bio) : (user.bio = user.bio);
    gender ? (user.gender = gender) : (user.gender = user.gender);
    username ? (user.username = username) : (user.username = user.username);
    if (profilePic) {
      user.profilePic = cloudinaryResponse.secure_url;
    }

    await user.save();

    return res
      .status(200)
      .json({ message: "profile updated successfully", success: true, user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } })
      .select("-password")
      .limit(25);
    if (!suggestedUsers) {
      return res
        .status(404)
        .json({ message: "currently no suggested users", success: false });
    }
    return res.status(200).json({ suggestedUsers, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const followOrunfollow = async (req, res) => {
  try {
    const userId = req.id; //current user
    const userToFollowId = req.params.id; //user to follow

    if (userId === userToFollowId) {
      return res.status(400).json({
        message: "you can't follow/unfollow yourself",
        success: false,
      });
    }

    let user = await User.findById(userId);
    let userToFollow = await User.findById(userToFollowId);
    if (!user || !userToFollow) {
      return res
        .status(404)
        .json({ message: "user not found", success: false });
    }

    const isFollowing = user.following.includes(userToFollowId);
    if (isFollowing) {
      //unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: userId },
          { $pull: { following: userToFollowId } }
        ),
        User.updateOne(
          { _id: userToFollowId },
          { $pull: { followers: userId } }
        ),
      ]);
      return res
        .status(200)
        .json({ user, message: "unfollowed successfully", success: true });
    } else {
      //follow logic
      await Promise.all([
        User.updateOne(
          { _id: userId },
          { $push: { following: userToFollowId } }
        ),
        User.updateOne(
          { _id: userToFollowId },
          { $push: { followers: userId } }
        ),
      ]);
      return res
        .status(200)
        .json({ user, message: "followed successfully", success: true });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};
