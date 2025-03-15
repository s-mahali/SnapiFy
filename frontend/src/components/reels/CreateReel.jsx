import { API_URL } from "@/api";
import { readFileAsDataURI } from "@/lib/utils";
import {  addReel } from "@/redux/slicers/reelSlice";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Loader2 } from "lucide-react";
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
    <>
      
        <DialogHeader className="space-y-1.5 text-center font-semibold text-lg sm:text-left">
          Create new Reel
        </DialogHeader>
        <DialogTitle className="text-md text-slate-400">
          Share a video with your followers
        </DialogTitle>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={userData?.profilePic} alt={userData?.username} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{userData?.username}</h1>
            <span className="text-xs text-gray-500">{userData?.bio} ...</span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-2 border-slate-500"
          placeholder="add a caption"
        />

        {videoPreview && (
          <div className="w-full h-[300px] flex items-center justify-center">
            <video
              src={videoPreview}
              className="w-full h-full object-cover rounded-md"
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
        <Button
          className="w-fit mx-auto bg-[#db1a59] hover:bg-[#db1a59]/90 duration-150"
          onClick={() => videoRef.current.click()}
        >
          Select Video from device{" "}
        </Button>

        {videoPreview &&
          (loading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin bg-[#db1a59] hover:bg-[#db1a59]/90 duration 150" />
              Uploading...
            </Button>
          ) : (
            <Button onClick={createReelHandler} type="submit" className="bg-[#db1a59] hover:bg-[#db1a59]/90 duration-150">
              Post Reel
            </Button>
          ))}
      
    </>
  );
};

export default CreateReel;
