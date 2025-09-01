import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    const token = generateStreamToken(req.user.id);
    if (!token) {
      return res.status(500).json({ error: "failed to generate token" });
    }
    res.status(200).json({ token });
  } catch (error) {
    console.error("error in chat controller getstream function", error);
    res.status(500).json({ error: "internal server error" });
  }
}
