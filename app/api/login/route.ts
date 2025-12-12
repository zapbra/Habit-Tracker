import { signIn } from "@/app/lib/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body as { email: string; password: string };

        if (!email || !password) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }

        const user = await signIn(email, password);
        return NextResponse.json({ ok: true, user }, { status: 200 });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log("Failed to sign in");
            console.log(err);
            return NextResponse.json({ error: err.message }, { status: 400 });
        } else {
            return NextResponse.json(
                { error: "Invalid request" },
                { status: 400 }
            );
        }
    }
}
