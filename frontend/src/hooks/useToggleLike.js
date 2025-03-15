import { API_URL } from '@/api';
import { toggleLike as toggleLikePost } from '@/redux/slicers/postSlice';
import { toggleLike as toggleLikeReel } from '@/redux/slicers/reelSlice';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

export const useToggleLike = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.user?._id);

    const toggleLike = useCallback(
        async (id, type) => {
            if(!userId){
                console.error("User not logged in");
                return;
            }

            try{
                const res = await axios.patch(`${API_URL}/${type}/like/${id}`,{},
                {withCredentials:true});
                
                if(res.data.success){
                    //update redux store based on the type
                    switch(type){
                        case "post":
                            dispatch(toggleLikePost({id, userId}));
                            break;
                        case "reel":
                            dispatch(toggleLikeReel({id, userId}));
                            break;
                        default:
                            console.error("Invalid type");
                    }
                }
               
                


            }catch(err){
                console.error("error toggling like",err);
            }
        },[userId,dispatch]
    )
    return toggleLike;
}