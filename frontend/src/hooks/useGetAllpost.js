import { useEffect } from "react";
import { API_URL } from "@/api";
import { useDispatch } from "react-redux";
import { setPosts } from "../redux/slicers/postSlice";
import axios from "axios";

const useGetAllPost = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/post/all`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, [dispatch]);
};

export default useGetAllPost;
