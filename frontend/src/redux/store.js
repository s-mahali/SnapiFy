import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./slicers/authSlice";
import postSlice from "./slicers/postSlice";
import chatSlice from "./slicers/chatSlice";
import socketSlice from "./slicers/socketSlice";
import rtnSlice from "./slicers/rtnSlice";
import reelSlice from "./slicers/reelSlice";
import {

  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";



const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  reel: reelSlice,
  chat: chatSlice,
  socketio: socketSlice,
  rtn: rtnSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
