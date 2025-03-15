import Comment from "../models/comment.js";
import Post from "../models/post.js";
import User from "../models/user.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res
        .status(401)
        .json({ message: "Image is required", success: false });
    }
    //image upload
    const optimizeImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", "mp4", { quality: 80 })
      .toBuffer();

    //buffer to datauri
    const fileUri = `data:image/jpeg;base64,${optimizeImageBuffer.toString(
      "base64"
    )}`;

    const clodinaryResponse = await cloudinary.uploader.upload(fileUri);
    const newPost = await Post.create({
      caption,
      image: clodinaryResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(newPost._id);
      await user.save();
    }

    await newPost.populate({ path: "author", select: "-password" });
    return res
      .status(201)
      .json({
        posts: newPost,
        success: true,
        message: "post added successfully",
      });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePic" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePic" },
      });

    return res.status(200).json({ posts, success: true });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePic" })
      .populate({
        path: " comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username,profilePic" },
      });

    return res.status(200).json({ posts, success: true });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "internal server error" });
  }
};




export const toggleLike = async (req, res) => {
  try {
    const likeKarnewalaUserKaId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "post not found", success: false });
    }

    const user = await User.findById(likeKarnewalaUserKaId).select("-password");

    //likelogic here

    const isLiked = post.likes.includes(likeKarnewalaUserKaId);
    const update = isLiked ? "$pull" : "$addToSet";
    
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { [update]: { likes: likeKarnewalaUserKaId } },
      { new: true }
    )
    const postOwnerId = post.author.toString();
    if (postOwnerId !== likeKarnewalaUserKaId) {
      //send notification to post owner
      if(!isLiked){
        const notification = {
          type: "like",
          sender: likeKarnewalaUserKaId,
          receiver: postOwnerId,
          userDetails: user,
          postId,
          message: `${user.username} liked your post`,
        };
        const postOwnerSocketId = getReceiverSocketId(postOwnerId);
        io.to(postOwnerSocketId).emit("notification", notification);
      }
      
     }
    return res
      .status(200)
      .json({ message: "post liked successfully", success: true, likes: updatedPost.likes.length });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "internal server error" });
  }
};




// export const disLikePost = async (req, res) => {
//   try {
//     const likeKarnewalaUserKaId = req.id;
//     const postId = req.params.id;
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res
//         .status(404)
//         .json({ message: "post not found", success: false });
//     }

//     //likelogic here

//     await post.updateOne({ $pull: { likes: likeKarnewalaUserKaId } });
//     await post.save();
//     //implement socket.io for real time notification
//     const user = await User.findById(likeKarnewalaUserKaId).select(
//       "username profilePic"
//     );
//     const postOwnerId = post.author.toString();
//     if (postOwnerId !== likeKarnewalaUserKaId) {
//       //send notification to post owner
//       const notification = {
//         type: "dislike",
//         sender: likeKarnewalaUserKaId,
//         receiver: postOwnerId,
//         userDetails: user,
//         postId,
//         message: `${user.username} disliked your post`,
//       };
//       const postOwnerSocketId = getReceiverSocketId(postOwnerId);
//       if (postOwnerSocketId) {
//         io.to(postOwnerSocketId).emit("notification", notification);
        
//       }
//     }

//     return res.status(200).json({ message: "post disliked", success: true });
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).json({ error: "internal server error" });
//   }
// };

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const commentKarneWalaKaId = req.id;

    const post = await Post.findById(postId);
    if (!text) {
      return res
        .status(400)
        .json({ message: "text is required", success: false });
    }
    if (!post) {
      return res
        .status(404)
        .json({ message: "post not found", success: false });
    }

    const comment = await Comment.create({
      text,
      author: commentKarneWalaKaId,
      post: postId,
    });

    await comment.populate({ path: "author", select: "username profilePic" });
    post.comments.push(comment._id);
    await post.save();
    return res
      .status(201)
      .json({ comment, message: "comment added", success: true });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    // Check if comment exists first
    if (!comment) {
      return res
        .status(404)
        .json({ message: "comment not found", success: false });
    }
    const postId = comment.post.toString();
    const authorId = comment.author.toString();

    //check if the logged in user is the author of the comment
    if (authorId !== req.id) {
      return res.status(403).json({ message: "access denied", success: false });
    }
    // Find post and check if it exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Associated post not found",
        success: false,
      });
    }
    // Delete comment first
    await Comment.findByIdAndDelete(commentId);
    // Remove comment reference from post
    post.comments = post.comments.filter((id) => id.toString() !== commentId);
    await post.save();
    return res.status(200).json({ message: "comment deleted", success: true });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "post not found", success: false });
    }
    const comments = await Comment.find({ post: postId })
      .populate({ path: "author", select: "username profilePic" })
      .sort({ createdAt: -1 });
    if (!comments) {
      return res
        .status(404)
        .json({ message: "comments not found", success: false });
    }
    return res.status(200).json({ comments, success: true });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "post not found", success: false });
    }
    //check if the logged in user is the author of the post
    if (post.author.toString() !== authorId) {
      return res.status(403).json({ message: "access denied", success: false });
    }

    await Post.findByIdAndDelete(postId);
    //remove the post from user docs also
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    //delete all comments of the post
    await Comment.deleteMany({ post: postId });
    return res.status(200).json({ message: "post deleted", success: true });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    const authorId = post.author.toString();
    if (authorId !== req.id) {
      return res.status(403).json({
        message: "Access denied",
        success: false,
      });
    }

    // Get caption from request or keep existing
    const caption = req.body.caption || post.caption;

    let imageUrl = post.image; // Keep existing image by default

    // Only process new image if one was uploaded
    if (req.file) {
      // Image optimization
      const optimizedImageBuffer = await sharp(req.file.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      // Convert buffer to data URI
      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
        "base64"
      )}`;

      // Upload to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(fileUri);
      imageUrl = cloudinaryResponse.secure_url;
    }

    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        caption,
        image: imageUrl,
      },
      { new: true } // Return updated document
    ).populate("author", "-password");

    return res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const bookMarksPost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "user not found", success: false });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "post not found", success: false });
    }

    const isBookmarked = user.postBookmarks.includes(postId);
    if (isBookmarked) {
      //if already bookmarked, then remove it
      await User.findByIdAndUpdate(userId, {
        $pull: { postBookmarks: postId },
      });
      return res.status(200).json({ message: "post unsaved", success: true });
    } else {
      // if not bookmarked, then add it
      await User.findByIdAndUpdate(userId, {
        $addToSet: { postBookmarks: postId },
      });
    }

    return res
      .status(200)
      .json({ message: "post saved successfully", success: true, bmPost:postId});
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "internal server error" });
  }
};
