import React, { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";
import {
  Heart,
  HeartHandshake,
  MessageCircle,
  Send,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "@/api";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, updatedPost } from "../../redux/slicers/postSlice";
import { useToggleLike } from "@/hooks/useToggleLike";
import { formatDistanceToNow } from "date-fns";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const user = useSelector((state) => state.auth.user);
  const selectedPost = useSelector((state) => state.post.selectedPost);
  const posts = useSelector((state) => state.post.posts);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  const liked = selectedPost?.likes.includes(user?._id) || false;
  const likeCount = selectedPost?.likes.length || 0;

  const toggleLike = useToggleLike();
  const handleLike = async () => {
    await toggleLike(selectedPost?._id, "post");
    const action = liked ? "dislike" : "like";
    
    const updatedPostData = {
      ...selectedPost,
      likes: liked
        ? selectedPost.likes.filter(id => id !== user._id)
        : [...selectedPost.likes, user._id],
    };
    dispatch(updatedPost(updatedPostData));
    toast.success(`Post ${action}d`);
  };

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim() !== "") {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const commentHandler = async () => {
    try {
      const postId = selectedPost?._id;
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-[1100px] p-0 h-[600px] overflow-hidden"
      >
        <div className="flex h-full bg-[#18181a]">
          {/* Left side - Image */}
          <div className="w-3/5  flex items-center justify-center">
            <img
              src={selectedPost?.image}
              alt="post"
              className="max-w-full max-h-[600px] object-contain"
            />
          </div>

          {/* Right side - Comments and interactions */}
          <div className="w-2/5 flex flex-col bg-[#1e1e1f]">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to={"/profile"}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedPost?.author?.profilePic} />
                    <AvatarFallback>
                      {selectedPost?.author?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Link className="font-semibold text-sm hover:text-gray-500">
                  {selectedPost?.author?.username}
                </Link>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="h-5 w-5 cursor-pointer hover:text-gray-500" />
                </DialogTrigger>
                <DialogContent className="flex flex-col gap-2 p-0">
                  <Button variant="ghost" className="text-red-500 hover:text-red-600 font-semibold">
                    Unfollow
                  </Button>
                  <Button variant="ghost">Add to favorites</Button>
                  <Button variant="ghost">Cancel</Button>
                </DialogContent>
              </Dialog>
            </div>

            {/* Comments section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Caption */}
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={selectedPost?.author?.profilePic} />
                  <AvatarFallback>
                    {selectedPost?.author?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-semibold text-sm mr-2">
                    {selectedPost?.author?.username}
                  </span>
                  <span className="text-sm">{selectedPost?.caption}</span>
                </div>
              </div>

              {/* Comments */}
              {comment.map((c) => (
                <div key={c._id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={c?.author?.profilePic} />
                    <AvatarFallback>
                      {c?.author?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-semibold text-sm mr-2">
                      {c?.author?.username}
                    </span>
                    <p className="text-md">{c.text}</p>
                    <span className="text-xs text-gray-700">
                      { c.createdAt &&
                      formatDistanceToNow(new Date(c.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions section */}
            <div className="border-t p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  {liked ? (
                    <HeartHandshake
                      onClick={handleLike}
                      className="h-6 w-6 text-red-500 cursor-pointer"
                    />
                  ) : (
                    <Heart
                      onClick={handleLike}
                      className="h-6 w-6 hover:text-gray-500 cursor-pointer"
                    />
                  )}
                  <MessageCircle className="h-6 w-6 hover:text-gray-500 cursor-pointer" />
                  <Send className="h-6 w-6 hover:text-gray-500 cursor-pointer" />
                </div>
                
              </div>
              
              <div className="space-y-1">
                <p className="font-semibold text-sm">{likeCount} likes</p>
                <p className="text-xs text-gray-500">
                 posted { selectedPost?.createdAt &&
                 formatDistanceToNow(new Date(selectedPost?.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              {/* Comment input */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  className="flex-1 bg-transparent border-none focus-visible:ring-0 p-1 text-sm"
                  placeholder="Add a comment..."
                  value={text}
                  onChange={changeEventHandler}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={commentHandler}
                  disabled={!text.trim()}
                  className="text-[#db1a59] hover:text-[#db1a58] font-semibold"
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;