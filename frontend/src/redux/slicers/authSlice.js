import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  status: false,
  profile: null,
  suggestedUsers:[],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.status = true;
    },
    setStatus: (state) => {
      state.status = false;
    },
    setProfileUser: (state, action) => {
      state.profile = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    updateFollowStatus:(state, action) => {
      const {isFollowing, targetUserId} = action.payload;
      if(isFollowing){
        state.user.following.push(targetUserId);
      }else{
        state.user.following = state.user.following.filter((id) => id !== targetUserId);
      }

      if(state.profile && state.profile._id === targetUserId){
         if(isFollowing){
          state.profile.followers.push(state.user._id);
         }else{
          state.profile.followers = state.profile.followers.filter((id) => id !== state.user._id);
         }
      }
    }
  },
});
export const { setAuthUser, setProfileUser,setSuggestedUsers,updateFollowStatus,setStatus} = authSlice.actions;
export default authSlice.reducer;
