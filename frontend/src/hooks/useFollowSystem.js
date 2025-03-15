import { API_URL } from "@/api";
import { updateFollowStatus } from "@/redux/slicers/authSlice";
import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export const useFollowSystem = (profileId) => {
  const { user, profile } = useSelector((store) => store.auth);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.following && profileId) {
      setIsFollowing(user.following.includes(profileId));
    }
  }, [user, profileId]);

  const handleFollowToggle = async () => {
    if (!user || !profileId) {
      toast.error("You need to login to follow someone");
      
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/user/followOrunfollow/${profileId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        const newIsFollowing = !isFollowing;
        
        setIsFollowing(newIsFollowing);
        dispatch(
          updateFollowStatus({
            isFollowing: newIsFollowing,
            targetUserId: profileId,
          })
        );
        toast.success(res.data.message);
      }
    } catch (err) {
      
      toast.error(err.response?.data?.message || "something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFollowing,
    handleFollowToggle,
    followerCount: profile?.followers?.length || 0,
    followingCount: profile?.following?.length || 0,
    isLoading,
  };
};
