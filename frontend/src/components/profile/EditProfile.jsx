import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/api";
import { setAuthUser } from "../../redux/slicers/authSlice";

const EditProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const imageRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    username: user?.username || "",
    profilePic: user?.profilePic || "",
    bio: user?.bio || "",
    gender: user?.gender || "",
  });

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePic: file });
    }
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    if (input.username.trim() === "")
      return toast.error("username cannot be empty");
    if (input.bio.trim() === "") return toast.error("bio cannot be empty");
    if (input.profilePic) {
      formData.append("profilePic", input.profilePic);
    }
    formData.append("username", input.username);
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    try {
      setLoading(true);
      const res = await axios.put(`${API_URL}/user/profile/edit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
         const updatedUserData = {
          ...user,
          username: res.data.user?.username,
          profilePic: res.data.user?.profilePic,
          bio: res.data.user?.bio,
          gender: res.data.user?.gender,
         };
         dispatch(setAuthUser(updatedUserData));
        }
          toast.success(res.data.message);
          navigate(`/profile/${user?._id}`);
         
      }catch(err){
          throw err;
      }finally {
       setLoading(false);
      }
    };

    const cancelEdit = () => {
      navigate(`/profile/${user?._id}`);
  }


  return (
    <div>
      <section className="flex flex-col gap-6">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center bg-gray-400 rounded-lg p-1 justify-between">
          <div className="flex items-center gap-3">
            <div>
              <Avatar>
                <AvatarImage src={user?.profilePic} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="font-semibold text-sm">{user?.username}</h3>

              <span className="text-gray-600 text-sm">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>

          <input
            type="file"
            ref={imageRef}
            className="hidden"
            onChange={fileChangeHandler}
          />
          <Button className="h-9" onClick={() => imageRef?.current.click()}>
            Change Photo
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <Label>Username</Label>
            <Input
              type="text"
              value={input.username}
              onChange={(e) => setInput({ ...input, username: e.target.value })}
              className="focus-visible:ring-transparent bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
             focus:ring-blue-500 focus:border-blue-500  
              w-full p-2.5"
            />
          </div>

          <div>
            <h1 className="font-semibold text-xl mb-2">Bio</h1>
            <Textarea
              value={input.bio}
              onChange={(e) => setInput({ ...input, bio: e.target.value })}
              className="focus-visible:ring-transparent bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
             focus:ring-blue-500 focus:border-blue-500  
              w-full p-2.5"
            />
          </div>

          <Select
            defaultValue={input.gender}
            onValueChange={selectChangeHandler}
          >
            <SelectTrigger className="focus-visible:ring-transparent w-[180px]">
              <SelectValue placeholder="Select a Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Gender</SelectLabel>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="flex flex-row-reverse gap-2  border">
            {loading ? (
              <Button>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                please wait
              </Button>
            ) : (
              <Button onClick={editProfileHandler}>Save Changes</Button>
            )}
            <Button onClick={cancelEdit}
            variant="ghost">Cancel</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
