import  "dotenv/config";
import express, { urlencoded } from "express";
import connectDB from "./utils/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"
import { app,server,io } from "./socket/socket.js";
import { reelsRoute } from "./routes/reelsRoute.js";




const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
  return res.status(200).json({
    message: "server is live",
    success: true
  })
})

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
}
app.use(cors(corsOptions));

//routes
app.use("/api/v1/user", userRoutes);
// "http://localhost:3000/api/v1/user"
app.use("/api/v1/post", postRoutes);
// "http://localhost:3000/api/v1/post"
app.use("/api/v1/reel", reelsRoute);
app.use("/api/v1/message", messageRoutes);
// "http://localhost3000/api/v1/message"



server.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});