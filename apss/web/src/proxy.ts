import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isMy = pathname.startsWith("/my");
    const isAdmin = pathname.startsWith("/admin");

    if (!isMy && !isAdmin) return NextResponse.next();

    const token = req.cookies.get("bokira_token")?.value;
    if (!token) {
        const url = new URL("/login", req.url);
        // opcional: conservar a dónde iba
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }

    if (isAdmin) {
        const meRes = await fetch(new URL("/api/auth/me", req.url), {
            headers: {
                // reenviar cookies para que /api/auth/me pueda leer bokira_token
                cookie: req.headers.get("cookie") ?? "",
            },
            cache: "no-store",
        });

        if (!meRes.ok) {
            const url = new URL("/login", req.url);
            url.searchParams.set("next", pathname);
            return NextResponse.redirect(url);
        }

        const me = await meRes.json();
        if (me.globalRole !== "ADMIN") {
            return NextResponse.redirect(new URL("/my", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/my/:path*", "/admin/:path*"],
};
