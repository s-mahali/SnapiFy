import { useEffect } from "react";
import { API_URL } from "@/api";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "@/redux/slicers/chatSlice";

const useGetAllMessages = () => {
  const dispatch = useDispatch();
  const {targetUser} = useSelector(store => store.chat);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/message/all/${targetUser?._id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setMessages(res.data.message));
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
  }, [targetUser]);
};

export default useGetAllMessages;
