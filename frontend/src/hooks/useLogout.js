import { useQueryClient, useMutation } from "@tanstack/react-query";
import { logout } from "../lib/api.js";

const useLogout = () => {
  const queryClient = useQueryClient();
  const {
    mutate: logoutMutate,
    isError,
    isPending,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
  return { logoutMutate, isError, isPending };
};

export default useLogout;
