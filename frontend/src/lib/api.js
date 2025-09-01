import { axiosInstance } from "./axios.js";

export const signup = async (signupData) => {
  const res = await axiosInstance.post("/api/auth/signup", signupData);
  return res.data;
};

export const login = async (loginData) => {
  const res = await axiosInstance.post("/api/auth/login", loginData);
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/api/auth/logout");
  return res.data;
};

export const getUserFriends = async () => {
  const res = await axiosInstance.get("/api/users/friends");
  return res.data;
};

export const getRecommendedUsers = async () => {
  const res = await axiosInstance.get("/api/users");
  return res.data;
};

export const getOutgoingFriendReqs = async () => {
  const res = await axiosInstance.get("/api/users/outgoing-friend-requests");
  return res.data.outgoingReqs;
};

export const sendFriendRequest = async (id) => {
  const res = await axiosInstance.post(`/api/users/friend-request/${id}`);
  return res.data;
};

export const getFriendRequests = async () => {
  const res = await axiosInstance.get("/api/users/friend-requests");
  return res.data;
};

export const acceptFriendRequest = async (id) => {
  const res = await axiosInstance.put(`/api/users/friend-request/${id}/accept`);
  return res.data;
};

export const getStreamToken = async () => {
  const res = await axiosInstance.get("/api/chat/token");
  console.log("getStreamToken response:", res.data); // 👈 add this log
  return res.data?.token; // ✅ Always return just the token
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/api/auth/me");
    return res.data || { user: null }; // never undefined
  } catch (err) {
    return { user: null }; // still never undefined
  }
};

export const completeOnboarding = async (userdata) => {
  const response = await axiosInstance.post("/api/auth/onboarding", userdata);
  console.log("Onboarding response:", response);
  return response.data;
};
