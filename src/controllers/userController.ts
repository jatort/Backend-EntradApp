import { IUser, User, UserCreateRequest } from "../schemas/User";
import { Event, IEvent, IPublishEvent } from "../schemas/Event";
import mongoose from "mongoose";
import { UserResponse } from "../types/userResponse";
import { DeleteResponse } from "../types/deleteResponse";
import { Ticket } from "../schemas/Ticket";

export default class UserController {
  UserResponse = (
    username: string,
    email: string,
    role: string
  ): UserResponse => {
    return { username, email, role };
  };

  public async createUser(body: UserCreateRequest): Promise<UserCreateRequest> {
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

  public async getUser(id: string): Promise<UserResponse> {
    /*
    Retorna el user de id: 'id'
    */
    const user = await User.findById(id);
    if (user == null) {
      throw new Error("No user found");
    } else {
      return this.UserResponse(user.username, user.email, user.role);
    }
  }

  public async getProfile(email: string | undefined): Promise<UserResponse> {
    /*
    Retorna el usuario de email 'email'
    */
    const user = await User.findOne({ email: email });
    if (user == null) {
      throw new Error("No user found");
    } else {
      return this.UserResponse(user.username, user.email, user.role);
    }
  }

  async getMyEvents(user_email: string | undefined): Promise<IEvent[]> {
    /*
    Retorna los eventos creados por un usuario productor
    */
    const user = await User.findOne({ email: user_email });
    if (!user) {
      throw new Error("User not found");
    }
    const events = await Event.find({ user: user._id });
    if (events.length === 0) {
      throw new Error("No events found");
    } else {
      return events;
    }
  }

  async getProd(email: any): Promise<IUser | Error> {
    /*
    Retorna el usuario productor de email: 'email'
    */
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    } else {
      return user;
    }
  }

  async getClient(email: any): Promise<(IUser & {_id: mongoose.Types.ObjectId;})> {
    /*
    Retorna el usuario cliente de email: 'email'
    */
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    } else {
      return user;
    }
  }

  async deleteUser(email: string | undefined): Promise<DeleteResponse | Error> {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    } else {
      // Chequear tipo de usuario.
      if (user.role === "prod") {
        // Si es productor, revisar si tiene eventos vigentes. (borrar usuario)
        const today = new Date();
        const currentEvents = await Event.find({
          user: user._id,
          date: { $gte: today },
        });
        if (currentEvents.length > 0) {
          throw new Error("User has active events");
        }
        await User.deleteOne({ id: user._id });
        return { message: "User deleted" };
      } else {
        // Si es usuario, revisar si tiene tickets vigentes. (editar el status del usuario)
        const today = new Date();
        const currentTickets = await Ticket.find({
          user: user._id,
          date: { $gte: today },
        });
        if (currentTickets.length > 0) {
          throw new Error("User has active tickets");
        }
        // cambiar estado del usuario
        user.status = "deleted";
        await user.save();
        return { message: "User deleted" };
      }
    }
  }
}
