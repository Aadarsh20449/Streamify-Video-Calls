import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
    },
    ProfilePic: {
      type: String,
      default: "",
    },
    nativeLanguage: {
      type: String,
      default: "",
    },
    learningLanguage: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    isOnboarded: {
      type: String,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
//created at , uodated at --> given by timestamps true

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  //it hashes the password
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (e) {
    next(e);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const isPassmatch = bcrypt.compare(enteredPassword, this.password);
  return isPassmatch;
};

const User = mongoose.model("User", userSchema);

export default User;
