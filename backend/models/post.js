import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: "",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,

    },
    image: {
        type: String,
        required: true,
    },
    likes: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ],
        
    

},{timestamps: true});

const Post = mongoose.model("Post", postSchema);

export default Post;


