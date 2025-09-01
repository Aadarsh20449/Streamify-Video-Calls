import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).send({ message: "un-authorised no token" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      return res.status(401).send({ message: "invalid token" });
    }

    const user = await User.findById(decode.userId).select("-password");
    if (!user)
      return res.status(401).send({ message: "un-authorised user not found" });
    //req.anything aa = user
    req.user = user;

    next();
  } catch (error) {
    console.log("error in proetc route", error);
    return res.status(500).send("internal server error");
  }
};
