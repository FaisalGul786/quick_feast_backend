
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../../db.js";
import { users } from "./auth.schema.js";
import jwt from "jsonwebtoken";

export async function createUser(name, email, passwordHash, role) {
  // 1. Check if user exists
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    // We THROW here. This jumps straight to the catch block in the controller.
    const error = new Error("Email already exists");
    error.code = "DUPLICATE_EMAIL"; 
    throw error;
  }

  // 2. Hash and Insert
  const hashedPassword = await bcrypt.hash(passwordHash, 10);
  
  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash: hashedPassword,
      role,
    })
    .returning();

  // Return the data. The controller will receive this if no error was thrown.
  return user;
}



// 2
export const signInUser = async(email, passwordPlain)=>{
  console.log("request reached at service auth");
  const isEmail = await db.query.users.findFirst({
    where: eq(users.email, email)
  });

  console.log('fetched record', isEmail);

  if(!isEmail) {
    const error =  new Error('No such user exist, try register first');
    error.code = "EMAIL_NOT_FOUND";

    throw error
  }

  const convertHashToPlain = await bcrypt.compare(passwordPlain, isEmail.passwordHash);
  console.log('password match ', convertHashToPlain);

  

  if(!convertHashToPlain) {
    const error = new Error("password or email is incorrect");
    error.code = "EMAIL_PASSWORD_WRONG";
    throw error;

  }

    // generate JWT
    const jwt_string = process.env.JWT_STRING;


    if(!jwt_string) throw new Error("JWT_SECRET_KEY is not defined in environment variables");

    const signedJWT = jwt.sign({ id: isEmail.id, role: isEmail.role}, jwt_string, { expiresIn: "20m" });

    const role = isEmail.role;
    const name = isEmail.name;

    return {signedJWT, role, name}


  


}

