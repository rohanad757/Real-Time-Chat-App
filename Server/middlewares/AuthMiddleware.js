import jwt from 'jsonwebtoken';

export const authenticateUser = async (req , res , next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json("Unauthenticated");
        };
        const decoded = jwt.verify(token , process.env.JWT_KEY);
        if(!decoded){
            return res.status(401).json("Unauthenticated");
        };
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(500).json("Internal Server Error");
    }
};