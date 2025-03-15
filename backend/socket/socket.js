import {Server} from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
   cors:{
        origin: "https://snapi-fy-soumens-projects-b3e0aae5.vercel.app",
        methods: ["GET", "POST"]
   }
});

const userSocketMap = {}; // this map stores the socket id of the user(userid -> socketid)

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if(userId){
    userSocketMap[userId] = socket.id;
    
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        if(userId){
            delete userSocketMap[userId];
            
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        
    });
});

export {app,server,io};



