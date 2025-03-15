import { useEffect } from "react";
import { API_URL } from "@/api";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "../redux/slicers/authSlice";
import axios from "axios";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/suggested`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.suggestedUsers));
        }
      } catch (err) {
        throw err;
      }
    };
    fetchSuggestedUsers();
  }, []);
};

export default useGetSuggestedUsers;
