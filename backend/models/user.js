import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  reels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reel",
    }
  ],
  postBookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  reelBookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reel",
    },
  ]
},{timestamps:true});

//update password method 
// userSchema.pre("save", async function (next){
//   //hash the password only if it has been modified
//   const user = this;
//   if(!user.isModified("password")) return next();
//   try{
//           //hash password generate
//           const salt = await bcrypt.genSalt(10);
//           const hashPassword = await bcrypt.hash(user.password, salt);
//           //override the plain text password with the hashed one
//           user.password = hashPassword;
//           next();

//   }catch(error){
//     return next(err);
//   }
// })


// //function to compare password
// userSchema.methods.comparePassword = async function(candidatePassword){
//   try{
//     // // use bcrypt to compare the provided password with the hashed one in the database
//     const isMatch = await bcrypt.compare(candidatePassword, this.password);
//     return isMatch;
//   }catch(error){
//     console.log(error);
//     return false;
//   }
// }

const User = mongoose.model("User", userSchema);

export default User;
