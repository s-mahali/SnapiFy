import React, { useState, useRef } from "react";
import { DialogTitle, DialogHeader } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { readFileAsDataURI } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../redux/slicers/postSlice";

const CreatePost = ({ setOpen }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const imageRef = useRef();
  const userData = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataURI = await readFileAsDataURI(file);
      setImagePreview(dataURI);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFile(null);
  };

  const createPostHandler = async () => {
    if (!caption.trim()) {
      toast.error("caption cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("postPic", file);

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/post/addpost`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setPosts([res.data.posts, ...posts]));
        setCaption("");
        setImagePreview(null);
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
      <DialogTitle className="text-md text-slate-300 mb-4">
        Post something crazzy{" "}
      </DialogTitle>

      <div className="flex items-center gap-3 mb-4">
        <Avatar>
          <AvatarImage src={userData?.profilePic} alt="balaji" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-semibold text-xs text-slate-100">{userData?.username}</h1>
          <span className="text-xs text-slate-200">{userData?.bio ? `${userData.bio.substring(0, 30)}...` : ""}</span>
        </div>
      </div>
      
      <Textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="focus-visible:ring-transparent border border-slate-500 mb-4"
        placeholder="What's on your mind?"
      />
      
      {imagePreview && (
        <div className="relative mb-4 max-h-[200px] overflow-hidden rounded-md">
          <button 
            onClick={removeImage}
            className="absolute top-2 right-2 bg-black/70 p-1 rounded-full hover:bg-black/90"
          >
            <X size={16} className="text-white" />
          </button>
          <img
            src={imagePreview}
            className="w-full object-contain rounded-md"
            style={{ maxHeight: "200px" }}
          />
        </div>
      )}
      
      <input
        ref={imageRef}
        type="file"
        className="hidden"
        onChange={fileChangeHandler}
        accept="image/*"
      />
      
      <div className="flex items-center justify-between mt-4">
        <Button
          className="bg-[#db1a59] hover:bg-[#db1a59]/90 duration-150"
          onClick={() => imageRef.current.click()}
          size="sm"
        >
          Select image
        </Button>
        
        {loading ? (
          <Button disabled className="bg-[#db1a59] hover:bg-[#db1a59]/90 duration-150">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Posting...
          </Button>
        ) : (
          <Button 
            onClick={createPostHandler} 
            type="submit" 
            className="bg-[#db1a59] hover:bg-[#db1a59]/90 duration-150"
            disabled={!caption.trim()}
          >
            Post
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreatePost;