import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

export async function signup(req, res) {
  try {
    const { fullname, email, password } = req.body;
    if (!email || !password || !fullname)
      return res.status(400).json({ message: "need all fields" });
    if (password.length < 6)
      return res.status(400).json({ message: "length must be atleast 6" });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res
        .status(400)
        .json({ message: "guve a correct domain to email" });
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "email already exists" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    //generate a numbeer between 1 to 100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newuser = await User.create({
      email,
      fullname,
      password,
      ProfilePic: randomAvatar,
    });

    try {
      await upsertStreamUser({
        id: newuser._id,
        name: newuser.fullname,
        image: newuser.ProfilePic || "",
      });
      console.log(`stream user created for ${newuser.fullname}`);
    } catch (error) {
      console.log("error creating stream user", error);
    }

    //payload, key , options
    const token = jwt.sign(
      { userId: newuser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    //put token in cookies
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 60,
      httpOnly: true, //prevents XSS attacks
      sameSite: true, //pervers CSRF ttacks
      secure: process.env.NODE_ENV === "production",
      // prevets http requests and adds https when in production
    });

    res.status(201).send({ sucess: true, user: newuser });
  } catch (e) {
    console.log("error in thye signup controller", e);
    res.status(500).send({ error: "Internal server error" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "need all fields" });
  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ message: "Invalid Email or Password" });

  const isCorrectPassword = await user.matchPassword(password);
  if (!isCorrectPassword)
    return res.status(401).json({ message: "Invalid Email or Password" });

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: true,
  });

  return res.status(200).send({ sucess: true, user: user });
}

export function logout(req, res) {
  //clear
  res.clearCookie("jwt");
  res.status(200).send({ success: true, message: "logout succesfull" });
}

export async function onboard(req, res) {
  console.log(req.user);
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).send({
        message: "all fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send("user not found");
    }
    //update the user in the stream
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullname,
        image: updatedUser.ProfilePic || "",
      });
      console.log(
        `stream user upodated after onboarding for ${updatedUser.fullname}`
      );
    } catch (error) {
      console.log(
        `error in updating  when onboarding for ${updatedUser.fullname}`
      );
    }

    res.status(200).send({ sucess: true, user: updatedUser });
  } catch (error) {
    console.error("error found ".error);
    res.status(500).send({ message: "internal server error" });
  }
}
