import jwt from  "jsonwebtoken";

export const isAuthenticated = async(req,res,next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
        req.id = decoded.userId;
        
        next();
    }catch(error){
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({ message: "Session expired, please login again", success: false });
        }
        console.log(error);
        return res.status(500).json({ error: "internal server error" });
    }
}