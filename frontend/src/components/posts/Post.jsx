import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React, { useRef, useState } from "react";
import { Dialog } from "../ui/dialog";
import { DialogContent, DialogTrigger } from "../ui/dialog";
import {
  Heart,
  MoreHorizontal,
  HeartHandshake,
  Bookmark,
  MessageCircle,
  Send,
  BookmarkCheck,
} from "lucide-react";
import { Button } from "../ui/button";
import CommentDialog from "./CommentDialog";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/api";
import {setPosts, setSelectedPost, updatedPost } from "../../redux/slicers/postSlice";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { useToggleLike } from "@/hooks/useToggleLike";
import { Skeleton } from "../ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const Post = ({ post }) => {
  const user = useSelector((state) => state.auth.user);
  const posts = useSelector((state) => state.post.posts);
  const author = user?.username === post?.author?.username;

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookMarked, setIsBookMarked] = useState(user?.postBookmarks?.includes(post?._id) || false);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();
  const toggleLike = useToggleLike();

  const liked = post.likes.includes(user?._id) || false;
  const likeCount = post.likes.length || 0;

  const imageRef = useRef(null);
  const textHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim() !== "") {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  //like and dislike post
  const handleLike = async() => {
     await toggleLike(post?._id, "post");
     const action = liked ? "dislike" : "like";
   
    //updating post data
    const updatedPostData = {
      ...post,
      likes: liked ? post.likes.filter((id) => id !== user?._id) : [...post.likes, user?._id],
    };
    dispatch(updatedPost(updatedPostData));
    toast.success(`Post ${action}d`);
  }

  

  //comment on post
  const commentHandler = async () => {
    try {
      const postId = post?._id;
      const res = await axios.post(
        `${API_URL}/post/comment/${postId}`,
        { text },
        {
          headers: { "content-type": "application/json" },

          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        

        const updatedPostData = posts.map((p) =>
          p._id === postId ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));

        setText("");
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "something went wrong");
    }
  };

  //delete post
  const deletePostHandler = async () => {
    try {
      const postId = post?._id;

      const res = await axios.delete(`${API_URL}/post/deletepost/${postId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        
        const updatedPost = posts.filter((p) => p._id !== postId);
        dispatch(setPosts(updatedPost));

        toast.success(res.data.message);
        setOpen(false);
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "something went wrong");
    }
  };

  const bookMarksHandler = async() => {
    try{
      const postId =  post?._id;
      const res = await axios.get(`${API_URL}/post/bookmark/${postId}`,{
        withCredentials:true
      });
      if(res.data.success){
        setIsBookMarked(!isBookMarked);
        toast.success(res.data.message);
      }
    }catch(err){
      toast.error(err.response?.data?.message || "something went wrong");
  }
};

  return (
    <div className="my-6 w-full max-w-md mx-auto bg-[#18181a] rounded-lg shadow-sm overflow-hidden ">
      <div className="flex items-center justify-between p-3 ">
       
      <Link
          to={`/profile/${post?.author._id}`}
          className="flex items-center gap-2 hover:opacity-90 trsnsistion-opacity"
        >
          <Avatar className="h-8 w-8 border border-gray-200">
            <AvatarImage src={post?.author.profilePic} /> {/* Add a src */}
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
              <h1 className="font-medium text-sm">{post?.author?.username}</h1>
              {author && <Badge variant="secondary" className="text-xs py-0 px-2">You</Badge>}
            </div>
        </Link>
        

       
        <Dialog className="flex flex-col justify-center items-center">
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col gap-2 max-w-xs mx-auto p-0 overflow-hidden">
            <div className="p-4 flex flex-col gap-2 w-full">
              <Button
                variant="ghost"
                className="justify-start text-sm font-normal w-full"
              >
                Unfollow
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-sm font-normal w-full"
              >
                Add to favorites
              </Button>
              {user?._id === post?.author?._id ? (
                <Button
                  variant="ghost"
                  className="justify-start text-sm font-normal w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={deletePostHandler}
                >
                  Delete
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="justify-start text-sm font-normal w-full"
                >
                  Report
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative rounded-md">
        {isLoading && (
          <Skeleton className="w-full aspect-ratio" />
        )}
      <img
        ref={imageRef}
        onLoad={handleImageLoad}
        className=" w-full aspect-square object-cover rounded-md"
        src={post?.image}
        style={{ display: isLoading ? 'none' : 'block' }}
        alt="balaji"
      />
      </div>

      <div className="mt-3"> 
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {liked ? (
              <HeartHandshake
                size={22}
                className="cursor-pointer text-red-600  hover:text-gray-600"
                onClick={handleLike}
              />
            ) : (
              <Heart
                size={22}
                className="cursor-pointer hover:text-gray-600"
                onClick={handleLike}
              />
            )}
            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              className="cursor-pointer hover:text-gray-600"
              size={22}
            />
            <Send className="cursor-pointer hover:text-gray-600" />
          </div>
         <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {post?.createdAt &&
            formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            })}
          </span>
          {
            isBookMarked ? (
              <BookmarkCheck
              size={22}
              className="cursor-pointer hover:text-gray-600"
              onClick={bookMarksHandler}
              />
            ) : (
              <Bookmark
              size={22}
              className="cursor-pointer hover:text-gray-600"
              onClick={bookMarksHandler}
              />
            )
         }
         </div>
        </div>
      </div>
      <span className="font-medium block mb-2">
        {likeCount} likes
      </span>
      <p>
        <span className="font-medium mr-2">{post?.author?.username}</span>
        {post.caption}
      </p>
      {post.comments.length > 0 && (
        <span
        onClick={() => {
          dispatch(setSelectedPost(post));
          setOpen(true);
        }}
         
          className="text-slate-300 cursor-pointer"
        >
          view all {post?.comments?.length} comments
        </span>
      )}
      <CommentDialog open={open} setOpen={setOpen}  />

      <div className="flex items-center px-3 py-2 border-t border-slate-300">
        <input
          type="text"
          value={text}
          placeholder="Add a comment..."
          className="w-full outline-none text-sm py-1 bg-inherit"
          onChange={textHandler}
          
          
        />
        {text.trim() && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-500 hover:text-blue-600 font-medium"
            onClick={commentHandler}
          >
            Post
          </Button>
        )}
      </div>
    </div>
  );
};

export default Post;
