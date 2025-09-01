import { signup } from "../lib/api.js";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useSignup = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast.success("user signed in succesfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
  return { signupMutation: mutate, error, isPending };
};

export default useSignup;
