import React, { useEffect, useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "@/api";
import { setMessages, setTargetUser } from "@/redux/slicers/chatSlice";
import useGetAllMessages from "@/hooks/useGetAllMessages";
import useGetRTM from "@/hooks/useGetRTM";
import { formatDistanceToNow } from "date-fns";

const UsersChatbox = () => {
  useGetAllMessages();
  useGetRTM();
  const [text, setText] = useState("");
  const { targetUser, messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { onlineUsers } = useSelector(store => store.chat);
  const isOnline = onlineUsers.includes(targetUser?._id);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessageHandler = async (e, id) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await axios.post(
        `${API_URL}/message/send/${id}`,
        { message: text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        
        dispatch(setMessages([...messages, res.data.message]));
        setText("");
      }
    } catch (err) {
     
      throw err;
    }
  };

  

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-screen flex-col bg-[#121212]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-800 p-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={targetUser?.profilePic} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-sm font-medium text-white">
            {targetUser?.username}
          </h2>
          {
            isOnline ? <span className="text-xs text-green-500">online</span> : <span className="text-xs text-slate-500">active recently</span>
          }
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message?._id}
              className={cn(
                "flex flex-col gap-1",
                message.sender === user?._id ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                  message.sender === user?._id
                    ? "bg-blue-500 text-white"
                    : "bg-zinc-800 text-white"
                )}
              >
                {message.message}
              </div>
              <span className="text-xs text-zinc-500">
                {message.createdAt &&
                  formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                  })}
              </span>
            </div>
          ))}
          {/* This empty div is our scroll target */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Chat Input Placeholder */}
      <form
        onSubmit={(e) => sendMessageHandler(e, targetUser?._id)}
        className="relative border-t border-zinc-800 p-4"
      >
        <input
          className="h-10 rounded-full bg-zinc-800/50 w-full pl-5 text-white text-sm placeholder:text-white focus-visible:ring-transparent"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button type="submit">
          <SendHorizonal
            size={22}
            className="absolute top-1/2 right-10 -translate-y-1/2 text-white hover:text-zinc-300 cursor-pointer"
          />
        </button>
      </form>
    </div>
  );
};

export default UsersChatbox;