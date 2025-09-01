import { useLocation, Link } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQueryClient } from "@tanstack/react-query";
import { ShipWheelIcon, BellIcon, LogOutIcon } from "lucide-react";
import useLogout from "../hooks/useLogout.js";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const queryClient = useQueryClient();

  //   const { mutate: handleLogout } = useMutation({
  //     mutationFn: logout,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["authUser"] });
  //     },
  //   });

  const { logoutMutate } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 fixed top-0 left-0 right-0 z-50 h-16 flex items-center shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* Logo - always visible on top left */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  Streamify
                </span>
              </Link>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Notifications */}
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle hover:bg-base-300">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>

            {/* User Profile + Logout */}
            <div className="flex items-center gap-3">
              <div className="avatar cursor-pointer">
                <div className="w-9 rounded-full ring ring-primary ring-offset-base-200 ring-offset-2">
                  <img src={authUser?.ProfilePic} alt="User Avatar" />
                </div>
              </div>
              <button
                onClick={() => {
                  logoutMutate();
                }}
                className="btn btn-ghost btn-circle hover:bg-error/20"
              >
                <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
