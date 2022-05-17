import { User, UserCreateRequest } from "../schemas/User";
import mongoose from "mongoose";
import { Get, Post, Tags, Body, Path, Route } from "tsoa";
@Route("api/v1/user")
@Tags("user")
export default class UserController {
  @Post("/")
  public async createUser(
    @Body() body: UserCreateRequest
  ): Promise<UserCreateRequest> {
    /*
    Crea un usuario a partir de los parámetros recibidos en el json data. Se filtran los errores posibles diferenciando 
    sus mensajes de error y en caso de exito se retorna el modelo usuario.
    */
    try {
      const user = new User(body);
      await user.save();
      return user;
    } catch (err: any) {
      if (err.code === 11000) {
        throw new Error("User already exists");
      } else if (err == mongoose.Error.ValidationError) {
        throw new Error("Invalid user data");
      } else if (err.errors.email.message == "invalid email") {
        throw new Error("Invalid email");
      }
      throw err;
    }
  }
}
