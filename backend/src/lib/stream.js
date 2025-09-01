import "dotenv/config";
import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAMIFY_API_KEY;
const apiSecret = process.env.STREAMIFY_API_SECRET;

if (!apiKey || !apiSecret) console.error("apikey or api secret is missing");

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userdata) => {
  try {
    await streamClient.upsertUsers([userdata]);
    return userdata;
  } catch (e) {
    console.error("error in uoserting stream user", e);
  }
};

export const generateStreamToken = (userId) => {
  try {
    return streamClient.createToken(userId);
  } catch (e) {
    console.error("error generating stream token", e);
    return null;
  }
};
