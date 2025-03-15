import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/api";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import {
  setSelectedReel,
  setReels,
  updatedReel,
} from "@/redux/slicers/reelSlice";
import { useToggleLike } from "@/hooks/useToggleLike";
import ReelDialogu from "./ReelDialogu";

const Reel = ({ reel }) => {
  const user = useSelector((state) => state.auth.user);
  const reels = useSelector((state) => state.reel.reels);
  const author = user?.username === reel?.author?.username;
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [views, setViews] = useState(reel?.views);
  const [isBookMarked, setIsBookMarked] = useState(
    user?.reelBookmarks?.includes(reel?._id) || false
  );
  const [comment, setComment] = useState(reel?.comments);
  const dispatch = useDispatch();
  const videoRef = useRef();

  const toggleReelLike = useToggleLike();

  const liked = reel?.likes?.includes(user?._id) || false;
  const likeCount = reel?.likes?.length || 0;

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const textHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim() !== "") {
      setText(inputText);
    } else {
      setText("");
    }
  };

  //like and dislike reel
  const handleLike = async () => {
    await toggleReelLike(reel?._id, "reel");

    const action = liked ? "dislike" : "like";

    //updating post data
    const updatedReelData = {
      ...reel,
      likes: liked
        ? reel.likes.filter((id) => id !== user?._id)
        : [...reel.likes, user?._id],
    };
    dispatch(updatedReel(updatedReelData));
    toast.success(`Reel ${action}d`);
  };

  //comment on post
  const commentHandler = async () => {
    try {
      const reelId = reel?._id;
      const res = await axios.post(
        `${API_URL}/reel/comment/${reelId}`,
        { text },
        {
          headers: { "content-type": "application/json" },

          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedReelData =
          reels?.map((p) =>
            p._id === reelId ? { ...p, comments: updatedCommentData } : p
          ) || [];

        dispatch(setReels(updatedReelData));

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
      const reelId = reel?._id;

      const res = await axios.delete(`${API_URL}/reel/deletereel/${reelId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        
        const updatedReel = reels.filter((p) => p._id !== reelId);
        dispatch(setReels(updatedReel));

        toast.success(res.data.message);
        setOpen(false);
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "something went wrong");
    }
  };

  const bookMarksHandler = async () => {
    try {
      const reelId = reel?._id;
      const res = await axios.get(`${API_URL}/reel/rbookmark/${reelId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setIsBookMarked(!isBookMarked);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "something went wrong");
    }
  };

  //increment views logic
  const incrementViews = async () => {
    const reelId = reel?._id;
    try {
      const res = await axios.get(`${API_URL}/reel/incrementViews/${reelId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setViews(views + 1);
        dispatch(updatedReel({ ...reel, views: views + 1 }));
      }
    } catch (err) {
      console.error("error incrementing views", err);
    }
  };

  return (
   <div className="my-6 w-full max-w-md mx-auto rouded-lg shadow-sm overflow-hidden ">
     <div className="my-8 w-full max-w-md mx-auto relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 mb-2">
          <Link to={`/profile/${reel?.author?._id}`}>
            <Avatar>
              <AvatarImage src={reel?.author?.profilePic} /> {/* Add a src */}
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex gap-3">
           {
            reel?.author?._id && 
            <Link to={`/profile/${reel?.author?._id}`}>
            <h1 className="cursor-pointer font-semibold">
              {reel?.author?.username}
            </h1>
          </Link>
           }
            {author && <Badge variant={"secondary"}>You</Badge>}
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favorites
            </Button>

            {user?._id === reel?.author?._id ? (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit"
                onClick={deletePostHandler}
              >
                Delete
              </Button>
            ) : (
              <Button variant="ghost" className="cursor-pointer w-fit">
                Report
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative w-full h-[500px] rounded-md overflow-hidden">
        <video
          ref={videoRef}
          src={reel?.video}
          className="h-full w-full object-cover"
          onMouseEnter={() => {
            setIsPlaying(true);
            videoRef.current.play();
            incrementViews();
          }}
          onMouseLeave={() => {
            setIsPlaying(false);
            videoRef.current.pause();
          }}
          muted={isMuted}
          
          loop
        />

        <div className="absolute bottom-4 left-4 flex gap-4">
          <button
            onClick={togglePlay}
            className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white" onClick={incrementViews} />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="h-6 w-6 text-white" />
            ) : (
              <Volume2 className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            {liked ? (
              <HeartHandshake
                size={22}
                className="cursor-pointer text-red-600"
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
                dispatch(setSelectedReel(reel));
                setOpen(true);
              }}
              className="cursor-pointer hover:text-gray-600"
              size={22}
            />
            <Send className="cursor-pointer hover:text-gray-600" />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">
              {reel?.created &&
              formatDistanceToNow(new Date(reel?.createdAt), {
                addSuffix: true,
              })}
            </span>
            {isBookMarked ? (
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
            )}
          </div>
        </div>
      </div>
      <div>
        <span className="ml-1 font-medium block mb-2">{likeCount} likes</span>
        {views > 0 && <span className="font-medium block">{views} views</span>}
      </div>
      <p>
        <span className="font-medium mr-2">{reel?.author?.username}</span>
        {reel?.caption}
      </p>
      {reel?.comments?.length > 0 && (
        <span
        onClick={() => {
          dispatch(setSelectedReel(reel));
          setOpen(true);
        }}
          className="text-slate-300 cursor-pointer"
        >
          view all {reel?.comments?.length} comments
        </span>
      )}
      <ReelDialogu open={open} setOpen={setOpen} />

      <div className="flex items-center mt-2 px-0 py-2 border-t border-slate-300">
        <input
          type="text"
          value={text}
          placeholder="add a comment..."
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
   </div>
  );
};

export default Reel;
