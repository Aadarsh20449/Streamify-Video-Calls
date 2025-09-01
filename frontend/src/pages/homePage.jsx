import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getUserFriends,
  getRecommendedUsers,
  getOutgoingFriendReqs,
  sendFriendRequest,
} from "../lib/api.js";
import { capitialize } from "../lib/utils.js";
import { Link } from "react-router-dom";
import {
  UsersIcon,
  MapPinIcon,
  CheckCircleIcon,
  UserPlusIcon,
} from "lucide-react";
import NoFriendsFound from "../components/noFriendsFound.jsx";
import FriendCard, { getLanguageFlag } from "../components/friendCard.jsx";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingReqsIds, setOutgoingReqsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingRecomendatiins } =
    useQuery({
      queryKey: ["users"],
      queryFn: getRecommendedUsers,
    });
  console.log("recommendedUsers 👉", recommendedUsers);

  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendFriendRequestMutate, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    if (!outgoingFriendReqs) return;

    const outgoingIds = new Set();

    // ensure it's always an array
    const safeReqs = Array.isArray(outgoingFriendReqs)
      ? outgoingFriendReqs
      : [];

    safeReqs.forEach((req) => {
      const recipientId =
        typeof req.recipient === "string" ? req.recipient : req.recipient?._id;
      if (recipientId) outgoingIds.add(recipientId);
    });

    setOutgoingReqsIds(outgoingIds);
  }, [outgoingFriendReqs]);

  console.log("outgoingFriendReqs 👉", outgoingFriendReqs);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to={"/notifications"} className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((frnd) => {
              return <FriendCard key={frnd._id} friend={frnd} />;
            })}
          </div>
        )}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Learners
                </h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your
                  profile
                </p>
              </div>
            </div>
          </div>
          {loadingRecomendatiins ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasReqSent = outgoingReqsIds.has(user._id);
                console.log("request swnt or not 👉", hasReqSent);
                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.ProfilePic} alt={user.fullname} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.fullname}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* languages wity flags */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native:{capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {getLanguageFlag(user.learningLanguage)}
                          Native:{capitialize(user.learningLanguage)}
                        </span>
                      </div>
                      {user.bio && (
                        <p className="text-sm opacity-70">{user.bio}</p>
                      )}
                      {/* action button */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasReqSent ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => sendFriendRequestMutate(user._id)}
                        disabled={hasReqSent || isPending}
                      >
                        {hasReqSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
export default HomePage;
