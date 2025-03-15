import Comment from "../models/comment.js";
import Reel from "../models/reels.model.js";
import User from "../models/user.js";
import { getReceiverSocketId,io } from "../socket/socket.js";
import cloudinary from "../utils/cloudinary.js";


export const addReel = async (req, res) => {
  const { caption } = req.body;
  const video = req.file;
  const author = req.id;

  try {
    // Check if file and caption are present
    if (!video) {
      return res.status(400).json({ message: "File is required" });
    }
    if (!caption || caption.trim() === "") {
      return res.status(400).json({ message: "Caption is required" });
    }

    // Check if the user exists
    const user = await User.findById(author);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const fileSizeInMB = video.size/(1024*1024);
    if(fileSizeInMB > 50){
       return res.status(413).json({ message: "File size too large" });
    }

    


    // Upload the video to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        {
          resource_type: "video",
          folder: "reels",
        },
        async (error, result) => {
          if (error) {
            console.error("Error uploading video to Cloudinary:", error);
            return res
              .status(500)
              .json({ message: "Error uploading video to Cloudinary" });
          }

          try {
            // Create a new reel
            const newReel = await Reel.create({
              caption,
              author,
              video: result.secure_url,
            });

            // Add the reel to the user's reels array
            user.reels.push(newReel._id);
            await user.save();

            // Populate the author field
            await newReel.populate({
              path: "author",
              select: "-password -posts -following -followers",
            });

            res.status(201).json({
              message: "Reel uploaded successfully",
              reel: newReel,
              success: true,
            });
          } catch (err) {
            // Rollback: Delete the uploaded video from Cloudinary if document creation fails
            await cloudinary.uploader.destroy(result.public_id, {
              resource_type: "video",
            });
            console.error("Error creating reel document:", err);
            res.status(500).json({ message: "Error creating reel document" });
          }
        }
      )
      .end(video.buffer);
  } catch (err) {
    console.error("Error adding reel:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReel = async (req, res) => {
  const { reelId } = req.params;
  const author = req.id;
  try {
    const reel = await Reel.findById(reelId);
    if (!reel) {
      return res
        .status(404)
        .json({ message: "Reel not found", success: false });
    }
    const owner = reel.author.toString();
    if (owner !== author) {
      return res.status(403).json({
        message: "You are not authorized to delete this reel",
        success: false,
      });
    }

    //Extract the publicId of video from the cloudinary url
    const publicId = reel.video.split("/").pop().split(".")[0];
    //delete the reel from cloudinary
    await cloudinary.uploader.destroy(`reels/${publicId}`, {
      resource_type: "video",
    });

    //delete the reel from the mongodb
    await Reel.findByIdAndDelete(reelId);
    //delete the reel from the user's reels array
    await User.findByIdAndUpdate(author, { $pull: { reels: reelId } });

    return res
      .status(200)
      .json({ message: "Reel deleted successfully", success: true });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const updateReel = async (req, res) => {
  const { reelId } = req.params;
  const { caption } = req.body;
  const video = req.file;
  const author = req.id;
  try {
    if (!caption?.trim() || !video) {
      return res
        .status(400)
        .json({ message: "Caption and video are required", success: false });
    }

    if (!author) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const reel = await Reel.findById(reelId);
    if (!reel) {
      return res
        .status(404)
        .json({ message: "Reel not found", success: false });
    }
    const owner = reel.author.toString();
    if (owner !== author) {
      return res.status(403).json({
        message: "You are not authorized to update this reel",
        success: false,
      });
    }

    //delete the old video from cloudinary
    const publicId = reel.video.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`reels/${publicId}`, {
      resource_type: "video",
    });

    //upload the new video to cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        {
          resource_type: "video",
          folder: "reels",
        },
        async (error, result) => {
          if (error) {
            console.error("Error uploading video to Cloudinary:", error);
            return res.status(500).json({
              message: "Error uploading video to Cloudinary",
              success: false,
            });
          }

          try {
            // Update the reel document
            const updatedReel = await Reel.findByIdAndUpdate(
              reelId,
              {
                caption,
                video: result.secure_url,
              },
              { new: true } // return the updated document
            ).populate({
              path: "author",
              select: "-password -posts -following -followers",
            });

            res.status(201).json({
              message: "Reel updated successfully",
              reel: updatedReel,
              success: true,
            });
          } catch (err) {
            // Rollback: Delete the uploaded video from Cloudinary if document creation fails
            await cloudinary.uploader.destroy(result.public_id, {
              resource_type: "video",
            });
            console.error("Error creating reel document:", err);
            res.status(500).json({
              message: "Error creating reel document",
              success: false,
            });
          }
        }
      )
      .end(video.buffer);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getReels = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; //pagination
  try {
    const reels = await Reel.find()
      .sort({ createdAt: -1 }) // newest reels first
      .skip((page - 1) * limit) //pagination: skip previous pages
      .limit(Number(limit)) // pagination: limit reels per page
      .populate({
        path: "author",
        select: "username profilePic",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePic" },
      });
    return res
      .status(200)
      .json({ reels, success: true, message: "Reels fetched successfully" });
  } catch (err) {
    console.error("Error in getReels", err.message);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
};

export const getReelById = async (req, res) => {
  const { reelId } = req.params;
  try {
    const reel = await Reel.findById(reelId);
    if (!reel) {
      return res
        .status(404)
        .json({ message: "Reel not found", success: false });
    }
    await reel.populate({
      path: "author",
      select: "username profilePicture",
    });
    return res
      .status(200)
      .json({ reel, success: true, message: "Reel fetched successfully" });
  } catch (err) {
    console.error("Error in getReelById", err.message);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
};

//get all reels based of user
export const getReelsByUser = async (req, res) => {
  const userId = req.id;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const reels = await Reel.find({
      author: userId,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      });
    return res
      .status(200)
      .json({ reels, success: true, message: "Reels fetched successfully" });
  } catch (err) {
    console.error("Error in getReelsByUser", err.message);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
};

//views increment
export const incrementViews = async (req, res) => {
  const { reelId } = req.params;
  try {
    const reel = await Reel.findByIdAndUpdate(
      reelId,
      {
        $inc: { views: 1 },
      },
      { new: true }
    );
    if (!reel) {
      return res
        .status(404)
        .json({ message: "Reel not found", success: false });
    }
    return res
      .status(200)
      .json({ reel, success: true, message: "Views incremented" });
  } catch (err) {
    console.error("Error in incrementViews", err.message);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
};

//like/unlike a reel
export const toggleLike = async (req, res) => {
  const userId = req.id;
  const { reelId } = req.params;
  
  try {
    const reel = await Reel.findById(reelId);
    const user = await User.findById(userId);
    if (!reel) {
      return res
        .status(404)
        .json({ message: "Reel not found", success: false });
    }
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const isLiked = reel.likes.includes(userId);
    const update = isLiked ? "$pull" : "$addToSet";
    const updatedReel = await Reel.findByIdAndUpdate(
      reelId,
      { [update]: { likes: userId } },
      { new: true }
    );

    //send notification to the author of the reel
    const reelOwnerId = reel.author.toString();
    const likeKarneWalaKaId = userId;
    if(!isLiked && (reelOwnerId !== likeKarneWalaKaId)){
       const notify = {
                 type: "like",
                 sender: likeKarneWalaKaId,
                 receiver: reelOwnerId,
                 userDetails: user,
                 reelId,
                 message: `${user.username} liked your reel`,
               };
               const reelOwnerSocketId = getReceiverSocketId(reelOwnerId);
               io.to(reelOwnerSocketId).emit("notify", notify);
    }

    return res
      .status(200)
      .json({
        reel: updatedReel,
        likes: updatedReel.likes.length,
        success: true,
        message: "Like toggled",
      });
  } catch (err) {
    console.error("Error in toggleLike", err.message);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
};

export const commentOnReel = async (req, res) => {
  const userId = req.id;
  const { reelId } = req.params;
  const { text } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    if (!text || text.trim() === "") {
      return res
        .status(400)
        .json({ message: "Comment cannot be empty", success: false });
    }
    const reel = await Reel.findById(reelId);
    if (!reel) {
      return res
        .status(404)
        .json({ message: "Reel not found", success: false });
    }
    const comment = await Comment.create({
      text,
      author: userId,
      reel: reelId,
    });
    await comment.populate({ path: "author", select: "username profilePic" });
    reel.comments.push(comment._id);
    await reel.save();
    return res
      .status(201)
      .json({ comment, message: "Comment added", success: true });
  } catch (err) {
    console.error("Error in commentOnReel", err.message);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
};

export const isBookmarked = async (req, res) => {
  const userId = req.id;
  const { reelId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const reel = await Reel.findById(reelId);
    if (!reel) {
      return res
        .status(404)
        .json({ message: "Reel not found", success: false });
    }
    const isBookmarked = user.reelBookmarks.includes(reelId);
    if (isBookmarked) {
      await User.findByIdAndUpdate(userId, {
        $pull: { reelBookmarks: reelId },
      });
      return res
        .status(200)
        .json({ message: "Reel removed from bookmarks", success: true });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { reelBookmarks: reelId },
      });
      return res.status(200).json({ message: "Reel Saved", success: true });
    }
  } catch (err) {
    console.error("Error in isBookmarked", err.message);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
};
