import mongoose from "mongoose";

const reelSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: "",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,

    },
    video: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
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
        
    

},{timestamps: true, autoIndex: true});

const Reel = mongoose.model("Reel", reelSchema);

export default Reel;


