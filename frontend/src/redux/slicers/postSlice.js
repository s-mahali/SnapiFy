import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    selectedPost: null,
    
};

const postSlice = createSlice ({
   name: "post",
   initialState,
   reducers:{
     setPosts:(state, action) => {
        state.posts = action.payload;
     },
       setSelectedPost: (state, action) => {
         state.selectedPost = action.payload;
       },
       toggleLike: (state, action) => {
         const {postId, userId} = action.payload;
         const post = state.posts.find((post) => post._id === postId);
         if(post){
          const isLiked = post.likes.includes(userId);
          if(isLiked){
            post.likes = post.likes.filter((id) => id !== userId);
         }
         else{
            post.likes.push(userId);
         }
       }
      },

      updatedPost: (state, action) =>  {
         const updatedPost = action.payload;
         const index = state.posts.findIndex((post) => post._id === updatedPost._id);
         if(index !== -1){
            state.posts[index] = updatedPost;
         }
       },
       
   }
});

export const { setPosts, setSelectedPost,toggleLike,updatedPost } = postSlice.actions;
export default postSlice.reducer;