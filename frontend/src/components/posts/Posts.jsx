import React from "react";
import Post from "./Post";



const Posts = ({post}) => {
  
  return (
    <>
     <Post key={post?._id} post={post}/>
    </>
  );
};

export default Posts;
