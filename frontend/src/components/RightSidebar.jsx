import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";


const RightSidebar = () => {
  const user = useSelector((state) => state.auth.user);
 
  
  return (
    <div className="hidden w-[22%] mx-5  my-8 lg:block bg-[#18181a]">
      <div className=" w-full flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 p-1">
          <Link to={`/profile/${user?._id}`}>
            <Avatar>
              <AvatarImage src={user?.profilePic} alt="post_image" /> 
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="font-semibold text-sm text-slate-100">
              <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
            </h1>
            <span className=" text-sm text-slate-200">
              {user?.bio || "Bio here..."}
            </span>
          </div>
        </div>
        <SuggestedUsers/>
      </div>
    </div>
  );
};

export default RightSidebar;
