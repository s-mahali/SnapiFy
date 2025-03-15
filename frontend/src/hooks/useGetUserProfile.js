import { useEffect } from "react";
import { API_URL } from "@/api";
import { useDispatch } from "react-redux";
import { setProfileUser } from "../redux/slicers/authSlice";
import axios from "axios";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/profile/${userId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setProfileUser(res.data.user));
        }
      } catch (err) {
        throw err;
      }
    };
    fetchProfile();
  }, [userId]);
};

export default useGetUserProfile;
