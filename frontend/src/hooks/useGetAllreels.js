import { useEffect } from "react";
import { API_URL } from "@/api";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setReels } from "@/redux/slicers/reelSlice";

const useGetAllreels = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get(`${API_URL}/reel/getreels`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setReels(res.data.reels));

        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchReels();
  }, [dispatch]);
};

export default useGetAllreels;
