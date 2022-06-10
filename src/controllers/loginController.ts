import { User, IUser } from "../schemas/User";
import { LoginResponse, UserData } from "../types/loginResponse";
import { LoginBody } from "../types/authRequest";
const jwt = require("jsonwebtoken");

export class LoginController {
  loginResponse = (message: string, token?: string): LoginResponse => {
    return { message, token };
  };
  async loginUser(body: LoginBody): Promise<LoginResponse> {
    // Validacion de existencia del usuario
    let message = "success";
    const user = await User.findOne({ email: body.email });
    if (!user) return this.loginResponse("User not found.");

    // Validacion de la contrasena
    const passwordIsCorrect = await user.validatePassword(body.password);
    if (!passwordIsCorrect) return this.loginResponse("Invalid password.");

    const userData: UserData = {
      email: user.email,
      role: user.role,
    };
    const token = this.generateToken(userData);
    return this.loginResponse(message, token);
  }

  generateToken = (user: UserData): string => {
    // Generacion del JSON Web Token
    const token: string = jwt.sign(
      {
        email: user.email,
        role: user.role,
      },
      process.env.TOKEN
    );

    return token;
  };
}
