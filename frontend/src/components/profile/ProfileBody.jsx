import { Heart, MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const ProfileBody = () => {
  const userProfile = useSelector((state) => state.auth.profile);
  const [activeTab, setActiveTab] = useState("posts");
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts"
      ? userProfile?.posts
      : activeTab === "saved"
      ? userProfile?.postBookmarks
      : activeTab === "reels"
      ? userProfile?.reels
      : [];

  return (
    <div className="border-t border-gray-200">
      <div className="flex items-center justify-center gap-10 text-sm">
        <span
          className={`py-3 cursor-pointer ${
            activeTab === "posts"
              ? "text-black font-semibold"
              : "text-gray-500 font-normal"
          }`}
          onClick={() => handleTabChange("posts")}
        >
          POSTS
        </span>
        <span
          className={`py-3 cursor-pointer ${
            activeTab === "saved"
              ? "text-black font-semibold"
              : "text-gray-500 font-normal"
          }`}
          onClick={() => handleTabChange("saved")}
        >
          SAVED
        </span>
        <span
          className={`py-3 cursor-pointer ${
            activeTab === "reels"
              ? "text-black font-semibold"
              : "text-gray-500 font-normal"
          }`}
          onClick={() => handleTabChange("reels")}
        >
          REELS
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {displayedPost && displayedPost.map((post) => (
          <div key={post?._id} className="relative group cursor-pointer">
            <img
              src={post.image}
              alt="postimg"
              className="rounded-sm  w-full aspect-square object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm">
              <div className="flex items-center text-white space-x-4">
                <button className="flex items-center gap-2 hover:text-gray-300">
                  <Heart />
                  <span>{post?.likes?.length}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-gray-300">
                  <MessageCircle />
                  <span>{post?.comments?.length}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileBody;
