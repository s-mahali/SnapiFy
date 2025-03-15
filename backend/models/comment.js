import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null,
        
    },
    reel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reel",
        default: null,
        
    },
}, { timestamps: true });

commentSchema.pre("validate", function(next) {
    if (!this.post && !this.reel) {
        next(new Error("Comment must be on a post or reel"));
    } else {
        next();
    }
});




const Comment = mongoose.model("Comment", commentSchema);

export default Comment;