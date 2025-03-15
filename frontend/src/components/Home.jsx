import React from "react";
import Homefeed from "./Homefeed";
import useGetAllPost from "@/hooks/useGetAllpost";
import RightSidebar from "./RightSidebar";
import { Outlet } from "react-router-dom";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import useGetAllreels from "@/hooks/useGetAllreels";
import { useSelector } from "react-redux";
import useAutoLogout from "@/hooks/useAutoLogout";

const Home = () => {
  useGetAllreels();
  useGetAllPost();
  useGetSuggestedUsers();
  useAutoLogout();

  const posts = useSelector((state) => state.post.posts);
  const reels = useSelector((state) => state.reel.reels);

  const combinedFeed = [...posts, ...reels].sort((a,b) => {
         return new Date(b.createdAt) - new Date(a.createdAt);
  });


  return (
    <div className="flex bg-[#18181a]">
      <div className="flex-grow">
        {
          combinedFeed.length === 0 ? (
            <div className="flex justify-center items-center h-[80vh]">
              <p className="text-white text-2xl">No posts to show</p>
            </div>
          ) : 
          (
            <Homefeed feed={combinedFeed} />
          )

        }
       
        <Outlet/>
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;
