import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth.service";

export function useLoginMutation() {
    return useMutation({ mutationFn: login });
}
