import { User, IUser } from "../schemas/User";
import { LoginResponse, UserData } from "../types/loginResponse";
import { LoginBody } from "../types/authRequest";
const jwt = require("jsonwebtoken");
import { Get, Post, Tags, Body, Path, Route } from "tsoa";

@Route("api/v1/login")
@Tags("login")
export class LoginController {
  loginResponse = (message: string, user?: UserData): LoginResponse => {
    return { message, user };
  };
  @Post("/")
  async loginUser(@Body() body: LoginBody): Promise<LoginResponse> {
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
    return this.loginResponse(message, userData);
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
