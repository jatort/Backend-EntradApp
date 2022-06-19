import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/authRequest";
const jwt = require("jsonwebtoken");

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Se obtiene el token del header Authorization
  const header = req.header("Authorization");
  let token;
  if (header) token = header.split(" ")[1];

  // Validacion de existencia del token
  if (!token) return res.status(401).json({ error: "Acceso denegado" });

  try {
    // Se almacena la informacion del token y se pasa al request para
    // su uso en la siguiente ruta
    const tokenData = jwt.verify(token, process.env.TOKEN);

    req.user = tokenData;

    next();
  } catch (err) {
    res.status(400).json({ error: "Acceso de negado, el token no es valido." });
  }
};

export const isProd = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Verifica si es un usuario Productora
  let role = req.user?.role;
  if (role != "prod")
    return res
      .status(401)
      .json({ error: "Acceso denegado, tiene que ser de producción" });

  next();
};

export const isClient = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Verifica si es un usuario Cliente
  let role = req.user?.role;
  if (role != "client")
    return res
      .status(401)
      .json({ error: "Acceso denegado, tiene que ser cliente" });

  next();
};
