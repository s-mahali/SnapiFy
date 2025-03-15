import { API_URL } from "@/api";
import { useToggleLike } from "@/hooks/useToggleLike";
import { setReels, updatedReel } from "@/redux/slicers/reelSlice";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  Heart,
  HeartHandshake,
  MessageCircle,
  MoreHorizontal,
  Pause,
  Play,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { formatDistanceToNow } from "date-fns";


const ReelDialogu = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  const selectedReel = useSelector((state) => state.reel.selectedReel);
  const reels = useSelector((state) => state.reel.reels);
  const dispatch = useDispatch();
  const [comment, setComment] = useState([]);
  
  const [views, setViews] = useState(selectedReel?.views);

  const liked = selectedReel?.likes.includes(user?._id) || false;
  const likeCount = selectedReel?.likes.length || 0;

  const toggleLike = useToggleLike();
  const handleLike = async () => {
    await toggleLike(selectedReel?._id, "reel");
    const action = liked ? "dislike" : "like";

    const updatedReelData = {
      ...selectedReel,
      likes: liked
        ? selectedReel.likes.filter((id) => id !== user._id)
        : [...selectedReel.likes, user._id],
    };
    dispatch(updatedReel(updatedReelData));
    toast.success(`Reel ${action}d`);
  };

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

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() !== "" ? inputText : "");
  };

  useEffect(() => {
       setComment(selectedReel?.comments);
  },[selectedReel])

  const commentHandler = async () => {
    try {
      const reelId = selectedReel?._id;
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

        const updatedReelData = reels.map((p) =>
          p._id === reelId ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setReels(updatedReelData));
        setText("");
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "something went wrong");
    }
  };

  const incrementViews = async () => {
    const reelId = selectedReel?._id;
    try {
      const res = await axios.get(`${API_URL}/reel/incrementViews/${reelId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setViews(views + 1);
        dispatch(updatedReel({ ...selectedReel, views: views + 1 }));
      }
    } catch (err) {
      console.error("error incrementing views", err);
    }
  };

  return (
    <Dialog open={open} setOpen={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-[1100px] p-0 h-[80vh] max-h-screen overflow-hidden"
      >
        <div className="flex h-full">
          {/* Left side - video */}
          <div className="w-3/5 bg-[#18181a] flex items-center justify-center relative h-[80vh]">
            <video
              ref={videoRef}
              src={selectedReel?.video}
              className="h-full w-full object-cover"
              loop
              muted={isMuted}
              autoPlay
            />
            {/* Video controls */}
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

          {/* Right side - comments and interactions */}
          <div className="w-2/5 flex flex-col bg-[#1e1e1f] h-[80vh]">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to={"/profile"}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedReel?.author?.profilePic} />
                    <AvatarFallback>
                      {selectedReel?.author?.username[0]}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Link className="font-semibold text-sm hover:text-gray-500">
                  {selectedReel?.author?.username}
                </Link>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="h-5 w-5 cursor-pointer hover:text-gray-500" />
                </DialogTrigger>
                <DialogContent className="flex flex-col gap-2 p-0">
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 font-semibold"
                  >
                    Unfollow
                  </Button>
                  <Button variant="ghost">Report</Button>
                  <Button variant="ghost">Cancel</Button>
                </DialogContent>
              </Dialog>
            </div>

            {/* Comments section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Caption */}
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={selectedReel?.author?.profilePic} />
                  <AvatarFallback>
                    {selectedReel?.author?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-semibold text-sm mr-2">
                    {selectedReel?.author?.username}
                  </span>
                  <span className="text-sm">{selectedReel?.caption}</span>
                </div>
              </div>

              {/* Comments */}
              {comment?.map((c) => (
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
                      {c?.createdAt &&
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
                  Posted{" "}
                  { selectedReel?.createdAt && formatDistanceToNow(new Date(selectedReel?.createdAt), {
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

export default ReelDialogu;