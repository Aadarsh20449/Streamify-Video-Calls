import { login } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useloginUser = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      }),
  });
  return { loginMutation: mutate, error, isPending };
};

export default useloginUser;
