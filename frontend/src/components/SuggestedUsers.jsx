import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";


const SuggestedUsers = () => {
  const suggestedUsers = useSelector((state) => state.auth.suggestedUsers);

  return (
    <div className=" my-1  w-[80%] p-2">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-slate-100">Suggested for you</h1>
        <span className="font-medium cursor-pointer text-[#db1a59]">See All</span>
      </div>
      {suggestedUsers.map((user) => (
        <div key={user._id} className="flex items-center justify-between my-5">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${user?._id}`}>
              <Avatar>
                <AvatarImage src={user?.profilePic} alt="post_image" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <h1 className="font-semibold text-sm text-slate-200">
                <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
              </h1>
              <span className="text-slate-200 text-sm">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
           <Link to={`/profile/${user?._id}`}>
           <span className="font-xs cursor-pointer text-slate-200">view</span>
           </Link>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUsers;
