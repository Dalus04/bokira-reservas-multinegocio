import { useQuery } from "@tanstack/react-query";
import { me } from "../services/auth.service";

export function useMeQuery() {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: me,
        retry: false,
    });
}
