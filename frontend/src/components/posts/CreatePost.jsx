import React, { useState, useRef } from "react";
import { DialogTitle, DialogHeader } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { readFileAsDataURI } from "@/lib/utils";
import { Loader2 } from "lucide-react";
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
    <>
      <DialogTitle className="text-md text-slate-300">
        Post something crazzy{" "}
      </DialogTitle>

      <div>
        <Avatar>
          <AvatarImage src={userData?.profilePic} alt="balaji" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-semibold text-xs text-slate-100">{userData?.username}</h1>
          <span className="text-xs text-slate-200">{userData?.bio} ...</span>
        </div>
      </div>
      <Textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="focus-visible:ring-transparent border border-slate-500"
        placeholder="What's on your mind?"
      />
      {imagePreview && (
        <div className="w-full h-[300px] flex items-center justify-center">
          <img
            src={imagePreview}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      )}
      <input
        ref={imageRef}
        type="file"
        className="hidden "
        onChange={fileChangeHandler}
      />
      <Button
        className="w-fit mx-auto bg-[#db1a59] hover:bg-[#db1a59]/90 duration-150"
        onClick={() => imageRef.current.click()}
      >
        select from computer
      </Button>
      {imagePreview &&
        (loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin bg-[#db1a59] hover:bg-[#db1a59]/90 duration-150" />
          </Button>
        ) : (
          <Button onClick={createPostHandler} type="submit" className="bg-[#db1a59] hover:bg-[#db1a59]/90 duration-150">
            post
          </Button>
        ))}
    </>
  );
};

export default CreatePost;
