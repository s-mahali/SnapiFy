import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";

//for chatting
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;
    

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // if conversation doesn't exist, create a new conversation
    if(!conversation){
        conversation = await Conversation.create({
            participants: [senderId, receiverId]
        });
    };
    
    const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        message
    });
    if(newMessage){
        conversation.messages.push(newMessage._id);
  }
   await Promise.all([newMessage.save(), conversation.save()]);
   //implement socket.io for real time data transfer
    const receiverSocketId = getReceiverSocketId(receiverId);
    //emit the message to the receiver
    if(receiverSocketId){
         io.to(receiverSocketId).emit("newMessage", newMessage);
    } 
    return res.status(200).json({success: true, message: newMessage });

   
   } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessage = async(req,res) => {
  try{
      const senderId = req.id;
      const receiverId = req.params.id;
      const conversation = await Conversation.findOne({
         participants:{$all:[senderId, receiverId]}
      }).populate('messages');
      if(!conversation){
        return res.status(200).json({success: true, message:[]});
      }
      return res.status(200).json({success: true, message: conversation?.messages});
  }catch(err){
     console.log(err);
     return res.status(500).json({ message: "Internal server error" });
  }
}
