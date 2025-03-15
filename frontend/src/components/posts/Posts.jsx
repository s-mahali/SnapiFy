import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";


const Posts = ({post}) => {
  
  return (
    <>
     <Post key={post?._id} post={post}/>
    </>
  );
};

export default Posts;
