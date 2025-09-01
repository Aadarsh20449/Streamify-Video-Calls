import User from "../models/User.js";
import FriendRequest from "../models/friendRequest.js";

export async function getReccomendationUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;
    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user
        { _id: { $nin: currentUser.friends } }, //exclude user freind
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("error in user controller Recommendation users", error);
    res.status(500).send("internal server error");
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullname ProfilePic nativeLanguage learningLanguage"
      );
    res.status(200).json(user.friends);
  } catch (error) {
    console.error("error in user controller get friends", error);
    res.status(500).send("internal server error");
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myid = req.user.id;
    const { id: recipientId } = req.params;

    //prevent sending request to our selves
    if (myid === recipientId)
      return res
        .status(400)
        .send({ message: "you cant send a request to urelf" });
    const recipientExists = await User.findById(recipientId);
    if (!recipientExists) {
      return res.status(404).send({ message: "recipient not found" });
    }
    if (recipientExists.friends.includes(myid)) {
      return res
        .status(400)
        .send({ message: "you and recipient are already friends" });
    }
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myid, recipient: recipientId },
        { sender: recipientId, recipient: myid },
      ],
    });
    if (existingRequest) {
      return res.status(400).send({ message: "you already sent a request" });
    }
    const friendRequest = await FriendRequest.create({
      sender: myid,
      recipient: recipientId,
    });
    return res.status(201).json(friendRequest);
  } catch (error) {
    console.error("error in user controller Freind request function", error);
    res.status(500).send("internal server error");
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      res.status(400).json({ message: "friend request not found" });
    }
    if (friendRequest.recipient.toString() !== req.user.id) {
      res
        .status(403)
        .json({ message: "You are not authorsed to acept this request" });
    }
    friendRequest.status = "accepted";
    await friendRequest.save();
    //add ids to friends array
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).send({ message: "friend request accepted" });
  } catch (error) {
    console.error("error in user controller accept request", error);
    res.status(500).send("internal server error");
  }
}

export async function getFriendRequests(req, res) {
  try {
    //requestt sent to me which are not accepted yet
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullname ProfilePic nativeLanguage learningLanguage"
    );

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullname ProfilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {}
}

export async function getOutgoingFriendRequests(req, res) {
  try {
    const outgoingReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullname ProfilePic nativeLanguage learningLanguage"
    );

    res.status(200).json({ outgoingReqs });
  } catch (error) {
    console.error("error in user controller get friends", error);
    res.status(500).send("internal server error");
  }
}
