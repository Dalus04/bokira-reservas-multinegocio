import { http } from "@/lib/api/http";

export type LoginBody = { email: string; password: string; remember: boolean };
export type RegisterBody = { email: string; password: string; name: string; phone?: string };

export async function login(body: LoginBody) {
    const { data } = await http.post("/auth/login", body);
    return data as {
        user: { id: string; email: string; name: string; phone?: string; globalRole: string };
    };
}

export async function register(body: RegisterBody) {
    const { data } = await http.post("/auth/register", body);
    return data as { user: { id: string; email: string; name: string; phone?: string; globalRole: string } };
}

export async function logout() {
    const { data } = await http.post("/auth/logout");
    return data as { ok: true };
}

export async function me() {
    const { data } = await http.get("/auth/me");
    return data as {
        id: string;
        email: string;
        name: string;
        phone?: string;
        globalRole: string;
        isActive: boolean;
        createdAt: string;
    };
}
