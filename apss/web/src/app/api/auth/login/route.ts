import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json(); // { email, password, remember }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: body.email, password: body.password }),
    });

    const data = await res.json();

    if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
    }

    const token = data.token as string;
    const remember = Boolean(body.remember);

    const response = NextResponse.json({ user: data.user }, { status: 200 });
    response.cookies.set("bokira_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
    });

    return response;
}
