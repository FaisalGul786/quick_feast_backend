import jwt from 'jsonwebtoken';
export const auth_check = (req,res, next) => {
    // To grab cookies for a token, use req.cookies if using cookie-parser middleware.
    // Example: If your token is stored under 'token' cookie key:
    const token = req.cookies?.accesstoken;
    console.log("token in middleware check", token);
    
    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }
    const decoded = jwt.verify(token, process.env.JWT_STRING);
    if(!decoded){
        return res.status(401).json({message: 'Unauthorized'});
    }
    req.user = decoded;
    next();
}