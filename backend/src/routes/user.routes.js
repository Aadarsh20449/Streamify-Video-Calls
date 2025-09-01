import express, { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getReccomendationUsers,
  getMyFriends,
  sendFriendRequest,
  getFriendRequests,
  getOutgoingFriendRequests,
  acceptFriendRequest,
} from "../controllers/user.controller.js";

const router = express.Router();
//use middlware protectte for all routes
router.use(protectRoute);

router.get("/", getReccomendationUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);

export default router;
