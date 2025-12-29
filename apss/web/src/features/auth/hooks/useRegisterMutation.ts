import { useMutation } from "@tanstack/react-query";
import { register } from "../services/auth.service";

export function useRegisterMutation() {
    return useMutation({ mutationFn: register });
}
