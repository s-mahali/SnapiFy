import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
// import dotenv from "dotenv";
// dotenv.config();




export const register = async(req, res) => {
    try{
       const { username, email, password } = req.body;
       if(!username || !email || !password){
           return res.status(401).json({ message: "All fields are required", success: false });
       }
       if(email.indexOf("@") === -1 || email.indexOf(".") === -1){
           return res.status(401).json({ message: "Invalid email", success: false });
       }
       const userExists = await User.findOne({ email });
       if(userExists){
           return res.status(401).json({ message: "User already exists", success: false });
       }
       const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword });
       return res.status(201).json({ message: "User registered successfully", success: true});
    }catch(error){
        console.log(error.message);
        return res.status(500).json({ error: "internal server error" });
    }
}

export const login = async(req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(401).json({ message: "All fields are required", success: false });
        }
        
        let user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({ message: "user not found with this email", success: false });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ message: "Incorrect email or password", success: false });
        }
        const token =  jwt.sign({userId: user._id}, process.env.JWT_SECRET,{expiresIn: '3d'});
        console.log("env", process.env.JWT_SECRET);
         
        const populatedPosts = await User.findById(user._id).populate({
            path: 'posts',
            select: "-__v",
            match:{author: user._id},
        });

        const populatedReels = await User.findById(user._id).populate({
            path: 'reels',
            select: "-__v",
            match:{author: user._id},
        });

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts,
            reels: populatedReels

        }

        

        return res.cookie("token", token, {httpOnly:true, sameSite:'none', secure: true, maxAge: 3*24*60*60*1000}).json({
            message:`welcome back ${user.username}`,
            success: true,
            user
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({ error: "internal server error" });
    }
}

export const logout = async (_, res) => {
    try{
         return res.cookie("token","",{maxAge:0}).json({
            message: "logged out successfully",
            success: true
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({ error: "internal server error" });
    }
}