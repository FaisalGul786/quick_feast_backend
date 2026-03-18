
import { createUser, signInUser } from "./auth.service.js";

// auth.controller.js
export const Register = async (req, res) => {
    const { name, email, passwordHash, role } = req.body;
    const roleCase = role.toUpperCase();
  
    try {
      // Rename this to 'result' or 'newUser' to avoid overwriting the 'res' object!
      const newUser = await createUser(name, email, passwordHash, roleCase);
  
      // If we reach here, the service didn't throw an error.
      return res.status(201).json({ 
        message: "User registered successfully", 
        userId: newUser.id 
      });
  
    } catch (error) {
      // If the service 'threw' an error, we catch it here.
      console.error('Registration Error:', error.message);
  
      if (error.code === "DUPLICATE_EMAIL" || error.code === 11000) {
        return res.status(409).json({ message: "User already exists with this email" });
      }
  
      return res.status(500).json({ message: "Something went wrong at backend." });
    }
  };




// Login
export const signIn = async(req, res) =>{
    const {email, passwordPlain } = req.body;
    console.log('login credentials ', email, passwordPlain);

      try {

        const {signedJWT , role, name }= await signInUser(email, passwordPlain);
         
        res.cookie('accesstoken', signedJWT, {
           httpOnly: true,
           secure: process.env.NODE_ENV === 'production',
           sameSite: 'strict',
           maxAge: 20 * 60 * 1000
   
       });
       return res.status(200).json({message: "SignedIn ...", role, name});
      } catch(error) {
        console.log("Login Error ", error.message);
        console.error("Full Login Error Details:", error);
        // or specifically look for the underlying database error
        console.error("Database Cause:", error.cause || error.detail);
        if(error.code === "EMAIL_NOT_FOUND") return res.status(404).json({message: "User not found!"})
        if(error.code === "EMAIL_PASSWORD_WRONG") return res.status(401).json({message: error.message});
        return res.status(500).json({message: "Server error"})
      }

}