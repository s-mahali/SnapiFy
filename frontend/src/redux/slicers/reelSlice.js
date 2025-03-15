import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reels: [],
    selectedReel: null,
    
};

const reelSlice = createSlice ({
   name: "reel",
   initialState,
   reducers:{
     setReels:(state, action) => {
        state.reels = action.payload;
     },
       setSelectedReel: (state, action) => {
         state.selectedReel = action.payload;
       },

       addReel: (state, action) => {
         state.reels.unshift(action.payload);
       },
      

       toggleLike: (state, action) => {
          const {reelId, userId} = action.payload;
          const reel = state.reels.find((reel) => reel._id === reelId);
          if(reel){
            const isLiked = reel.likes.includes(userId);
            if(isLiked){
              reel.likes = reel.likes.filter((id) => id !== userId);
            }else{
              reel.likes.push(userId);
            }
          }
       },

       updatedReel: (state, action) =>  {
        const updatedReel = action.payload;
        const index = state.reels.findIndex((reel) => reel._id === updatedReel._id);
        if(index !== -1){
           state.reels[index] = updatedReel;
        }
      },

       
   }
});

export const { setReels, setSelectedReel,toggleLike, addReel, updatedReel } = reelSlice.actions;
export default reelSlice.reducer;