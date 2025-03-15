import React, { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AtSign, ChevronDown, Plus, RotateCcw } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import { Badge } from "../ui/badge";
import { useFollowSystem } from "@/hooks/useFollowSystem";
import { Loader2 } from "lucide-react";

function ProfileHeader() {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const { user, profile } = useSelector((store) => store.auth);

  const isLoggedInUserProfile = user?._id === profile?._id;
  const {
    isFollowing,
    handleFollowToggle,
    followerCount,
    followingCount,
    isLoading,
  } = useFollowSystem(profile?._id);

  return (
    <div className="p-2">
      <div className="max-w-2xl mx-auto space-y-6 p-2 ">
        {/* Profile Section */}
        <div className="flex  items-center justify-center space-x-4">
          <div className="flex flex-start justify-center w-1/3 items-center p-1 mt-2">
            <Avatar className="w-32 h-32 md:w-40 md:h-40">
              <AvatarImage src={profile?.profilePic} alt="Profile picture" />
              <AvatarFallback className="bg-muted">VP</AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-4 text-center  w-2/3">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-semibold">{profile?.username}</h1>
              <Badge className="w-fit" variant="ghost">
                <AtSign className="mr-1 h-4 w-4" />
                {profile?.username}
              </Badge>
            </div>

            {isLoggedInUserProfile ? (
              <div className="flex flex-col gap-2 justify-center sm:flex-row">
                <Link to={"/profile/edit"}>
                  <Button variant="outline">Edit profile</Button>
                </Link>
                <Button variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  View archive
                </Button>
              </div>
            ) : isFollowing ? (
              <div className="flex flex-col gap-2 justify-center sm:flex-row">
                <Link to={`/chat`}>
                <Button variant="outline">Message</Button>
                </Link>
                {isLoading ? (
                  <Button
                    variant="outline"
                    onClick={handleFollowToggle}
                    disabled={isLoading}
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    please wait
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleFollowToggle}
                    disabled={isLoading}
                  >
                    UnFollow
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2 justify-center sm:flex-row">
               {
                 isLoading ? (
                  <Button
                    variant="outline"
                    className="bg-[#db1a59]"
                    onClick={handleFollowToggle}
                    disabled={isLoading}
                  >
                    <Plus className=" h-4 w-4" />
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> please wait
                  </Button>
                  ):(
                  <Button
                    variant="outline"
                    className="bg-[#db1a59]"
                    onClick={handleFollowToggle}
                    disabled={isLoading}
                  >
                    <Plus className=" h-4 w-4" />
                    Follow
                  </Button>
                  )
               }
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-6 justify-center text-sm md:text-base">
              <div className="text-center">
                <div className="font-semibold">{profile?.posts?.length}</div>
                <div className="text-muted-foreground">posts</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{followerCount}</div>
                <div className="text-muted-foreground">followers</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{followingCount}</div>
                <div className="text-muted-foreground">following</div>
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col items-center justify-center gap-2 text-foreground">
              <p className="text-sm md:text-lg">
                {profile?.bio || "bio here....."}
              </p>
              <div className="flex flex-col text-start">
               <span className="text-xs md:text-sm">{" "}</span>
                
              </div>
            </div>
          </div>
        </div>

        {/* New Post Button */}
        <div className="mt-8">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 rounded-lg p-6 "
          >
            <Plus className="h-6 w-6" />
            <span className="text-lg">New</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
