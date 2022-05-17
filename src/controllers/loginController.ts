import { User, IUser } from "../schemas/User";
import { LoginResponse, UserData } from "../types/loginResponse";
const jwt = require("jsonwebtoken");

const loginResponse = (message: string, user?: UserData): LoginResponse => {
  return {message, user};
};

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  // Validacion de existencia del usuario
  let message = "success";
  const user = await User.findOne({ email });
  if (!user) return loginResponse("User not found."); 
 
  // Validacion de la contrasena
  const passwordIsCorrect = await user.validatePassword(password);
  if (!passwordIsCorrect) return loginResponse("Invalid password.");
  
  const userData: UserData = {
    email: user.email,
    role: user.role,
  }
  return loginResponse(message, userData);
};

export const generateToken = (user: UserData ): string =>
{
  // Generacion del JSON Web Token
  const token: string = jwt.sign({
    email: user.email,
    role: user.role,
  }, process.env.TOKEN);
  
  return token;
};
