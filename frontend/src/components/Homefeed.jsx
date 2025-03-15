import React from "react";
import Posts from "./posts/Posts";
import Reels from "@/pages/Reels";

const Homefeed = ({feed}) => {
   return (
    <div className="flex-1 my-8 flex flex-col items-center pl-[20%]">
      {
        feed.map((item) => {
           if(item.image){
              return <Posts key={item._id} post={item} />
           } else if (item.video){
              return <Reels key={item._id} reel={item} />
           }
           return null;
        })
      }
    </div>
   )
  
};

export default Homefeed;
