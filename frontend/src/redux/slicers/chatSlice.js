import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    targetUser: null,
    onlineUsers: [],
    messages: [],
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setTargetUser(state, action) {
            state.targetUser = action.payload;
        },
        setOnlineUsers(state, action) {
            state.onlineUsers = action.payload;
        },
        setMessages(state, action) {
            state.messages = action.payload;
        },
    }
});

export const { setTargetUser, setOnlineUsers, setMessages } = chatSlice.actions;
export default chatSlice.reducer;