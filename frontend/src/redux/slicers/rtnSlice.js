//rtn -> real time notification
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    likeNotification:[]
}

const rtnSlice = createSlice({
    name: "rtn",
    initialState,
    reducers: {
        setLikeNotification(state, action) {
           if(action.payload.type === 'like'){
               state.likeNotification.push(action.payload);
           }
        },

        setLikeDefault(state){
            state.likeNotification = [];
        }
    }
});
export const { setLikeNotification, setLikeDefault } = rtnSlice.actions;
export default rtnSlice.reducer;