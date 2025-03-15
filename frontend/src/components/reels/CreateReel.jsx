import { API_URL } from "@/api";
import { readFileAsDataURI } from "@/lib/utils";
import { addReel } from "@/redux/slicers/reelSlice";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const CreateReel = ({ setOpen }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const videoRef = useRef();
  const userData = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  
  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataURI = await readFileAsDataURI(file);
      setVideoPreview(dataURI);
    }
  };

  const removeVideo = () => {
    setVideoPreview(null);
    setFile(null);
  };

  const createReelHandler = async () => {
    if (!caption?.trim()) {
      toast.error("caption cannot be empty");
      return;
    }
    const formData = new FormData();
    formData.append("caption", caption);
    if (videoPreview) formData.append("video", file);

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/reel/addreel`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res?.data.message);
        dispatch(addReel([res?.data.reel])); // add the new reel to the store
        setCaption("");
        setVideoPreview(null);
        setFile(null);
      }
    } catch (err) {
      if (err.response?.status === 413) {
        toast.error("file size too large");
      } else {
        toast.error(err.response?.data?.message || "something went wrong");
      }
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <DialogHeader className="space-y-1.5 text-center font-semibold text-lg sm:text-left mb-4">
        Create new Reel
      </DialogHeader>
      <DialogTitle className="text-md text-slate-400 mb-3">
        Share a video with your followers
      </DialogTitle>
      
      <div className="flex items-center gap-3 mb-4">
        <Avatar>
          <AvatarImage src={userData?.profilePic} alt={userData?.username} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-semibold text-xs">{userData?.username}</h1>
          <span className="text-xs text-gray-500">
            {userData?.bio ? `${userData.bio.substring(0, 30)}...` : ""}
          </span>
        </div>
      </div>
      
      <Textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="focus-visible:ring-transparent border border-slate-500 mb-4"
        placeholder="Add a caption"
      />

      {videoPreview && (
        <div className="relative mb-4 max-h-[220px] overflow-hidden rounded-md">
          <button 
            onClick={removeVideo}
            className="absolute top-2 right-2 bg-black/70 p-1 rounded-full hover:bg-black/90 z-10"
          >
            <X size={16} className="text-white" />
          </button>
          <video
            src={videoPreview}
            className="w-full rounded-md"
            style={{ maxHeight: "220px" }}
            controls
          />
        </div>
      )}

      <input
        ref={videoRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={fileChangeHandler}
      />
      
      <div className="flex items-center justify-between mt-4">
        <Button
          className="bg-[#db1a59] hover:bg-[#db1a59]/90 duration-150"
          onClick={() => videoRef.current.click()}
          size="sm"
        >
          Select video
        </Button>
        
        {videoPreview && (
          loading ? (
            <Button disabled className="bg-[#db1a59] hover:bg-[#db1a59]/90 duration-150">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Uploading...
            </Button>
          ) : (
            <Button 
              onClick={createReelHandler} 
              type="submit" 
              className="bg-[#db1a59] hover:bg-[#db1a59]/90 duration-150"
              disabled={!caption.trim()}
            >
              Post Reel
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default CreateReel;