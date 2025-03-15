import store from "@/redux/store";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { setTargetUser } from "@/redux/slicers/chatSlice";

const ChatUserList = () => {
  const { suggestedUsers, user } = useSelector(store => store.auth);
  const { onlineUsers } = useSelector(store => store.chat);
  

  const dispatch = useDispatch();
  return (
    <>
      <section className="w-full my-8">
        <h2 className="pl-2 text-lg font-semibold">{
          user?.username}</h2>
      </section>
      <hr className="" />

      <section className="w-full flex flex-col gap-2  mt-3 pl-2">
        {suggestedUsers.map((suggestedUser) => {
          const isOnline = onlineUsers.includes(suggestedUser?._id);
          return (
          <div
            key={suggestedUser?._id}
            className="flex items-center gap-3"
            onClick={() => dispatch(setTargetUser(suggestedUser))}
            
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={suggestedUser?.profilePic} alt="post_image" className="cursor-pointer" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold cursor-pointer">{suggestedUser?.username}</h4>
              <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'} `}>{isOnline ? 'online' : 'offline'}</span>
              
            </div>
          </div>
          );
        })}
      </section>
    </>
  );
};

export default ChatUserList;
