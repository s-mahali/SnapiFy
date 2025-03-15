import { useEffect } from "react";
import { setAuthUser } from "@/redux/slicers/authSlice";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";

const useAutoLogout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
        if(token){
            try{
                const decodedToken = jwtDecode(token);
                const expirationTime = decodedToken.exp*1000;
                const currentTime = new Date().getTime();

                const timeLeft = expirationTime - currentTime;

                if(timeLeft > 0){
                    const timeoutId = setTimeout(() => {
                        dispatch(setAuthUser(null));
                    }, timeLeft);

                    return () => clearTimeout(timeoutId);
                    
                } else {
                    dispatch(setAuthUser(null));
                }
            }catch(err){
                console.err("error decoding token", err);
                dispatch(setAuthUser(null));
            }
        }
    }, [dispatch]);
};

export default useAutoLogout;