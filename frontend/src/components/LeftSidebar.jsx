import React, { useState } from "react";
import {
  Film,
  Heart,
  Home,
  LogOut,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { FaFacebookMessenger } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { api } from "@/api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setStatus } from "../redux/slicers/authSlice";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { setLikeDefault } from "@/redux/slicers/rtnSlice";
import CreateDialog from "../utils/CreateDialog";



const LeftSidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.user);
  const { likeNotification } = useSelector((store) => store.rtn);
  const [showNotification, setShowNotification] = useState(true);

  const handleLogout = async () => {
    try {
      const res = await api.post("/user/logout");
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setStatus(false));
        

        

        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "something went wrong");
    }
  };

  const sidebarItems = [
    {
      icon: <Home />,
      text: "Home",
    },
    {
      icon: <Search />,
      text: "Search",
    },
    {
      icon: <TrendingUp />,
      text: "Explore",
    },
    {
      icon: <FaFacebookMessenger size={22} />,
      text: "Messages",
    },
    {
      icon: <Heart />,
      text: "Notifications",
    },
    {
      icon: <Film/>,
      text: "Reels",
    },
    {
      icon: <PlusSquare />,
      text: "Create",
    },
    {
      icon: (
        <Avatar className="h-6 w-6">
          <AvatarImage
            src={userData?.profilePic || "https://github.com/shadcn.png"}
            alt="balaji"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    {
      icon: <LogOut />,
      text: "Logout",
    },
  ];

  const handleSidebar = (textType) => {
    if (textType === "Logout") {
      handleLogout();
    }

    if (textType === "Create") {
      setOpen(true);
    }

    if (textType === "Profile") {
      navigate(`/profile/${userData?._id}`);
    }
    
    if(textType === "Reels"){
      navigate("/reels")
    }

    if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
    if (textType === "Notifications") {
      setTimeout(() => {
        setShowNotification(false);
        dispatch(setLikeDefault());
      }, 5000);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 z-10 px-4 border-r  w-[16%] h-screen bg-[#18181a]">
        <div className="flex flex-col">
          <h1 className="my-8 pl-3 text-xl font-bold text-[#db1a59]">SNapify</h1>
          <div className="flex flex-col lg:items-start items-center ">
            {sidebarItems.map((item, index) => (
              <div
                onClick={() => handleSidebar(item.text)}
                key={index}
                className="flex items-center gap-3 relative text-slate-100 hover:bg-gray-700 cursor-pointer rounded-lg p-3 my-3"
              >
                {item.icon}
                <span className="hidden lg:block text-slate-100">{item.text}</span>
                {item.text === "Notifications" &&
                  likeNotification.length > 0 &&
                  showNotification && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                        >
                          {likeNotification.length}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div>
                          {likeNotification.length === 0 ? (
                            <p>No Notifications</p>
                          ) : (
                            likeNotification.map((notification) => (
                              <div
                                key={notification?.sender}
                                className="flex items-center gap-2 my-2"
                              >
                                <Avatar>
                                  <AvatarImage
                                    src={notification.userDetails?.profilePic}
                                  />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-sm text-slate-100">
                                  {notification?.message}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <CreateDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default LeftSidebar;
