import express, { Router } from "express";
import {
  signup,
  login,
  logout,
  onboard,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// router.get("/signup", (req, res) => {
//   res.send("sign up route");
// });

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/onboarding", protectRoute, onboard);
router.get("/me", protectRoute, (req, res) => {
  res.status(200).send({ success: true, user: req.user });
});

export default router;
