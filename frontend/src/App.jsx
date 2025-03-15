import React, { useEffect } from "react";
import SignupForm from "./components/SignupForm";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "../src/pages/Profile";
import EditProfilePage from "./pages/EditProfilePage";
import ChatPage from "./pages/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/slicers/socketSlice";
import { setOnlineUsers } from "./redux/slicers/chatSlice";
import { setLikeNotification } from "./redux/slicers/rtnSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Reels from "./pages/Reels";


const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: "/",
        element: <ProtectedRoutes><Home /></ProtectedRoutes>,
      },
      {
        path: "/profile/:id",
        element: <ProtectedRoutes><Profile /></ProtectedRoutes>,
      },
      {
        path: "/profile/edit",
        element: <ProtectedRoutes><EditProfilePage /></ProtectedRoutes>,
      },
      {
        path: "/chat",
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>,
      },
      {
        path:"/reels",
        element:<ProtectedRoutes><Reels/></ProtectedRoutes>
      }
    ],
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/signup",
    element: <SignupForm />,
  },
]);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  },[])



  const { user } = useSelector((store) => store.auth);
  const {socket} = useSelector(store => store.socketio);
  useEffect(() => {
    if (user) {
      const socketio = io("https://snapify-mn87.onrender.com/api/v1", {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));
      //listen all the events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
        
      });
      
      socketio.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification));
      });
      socketio.on('notify',(notify)=>{
        dispatch(setLikeNotification(notify));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    }else if(socket){
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
};

export default App;
