import { NextResponse } from "next/server";
import { signUp } from "../../lib/user";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { hashPassword } from "@/app/lib/security";

const scrypt = promisify(_scrypt);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, name, password } = body as {
            email: string;
            name?: string;
            password: string;
        };

        if (!email || !password) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }

        const passwordHash = await hashPassword(password);

        try {
            const user = await signUp(email, name ?? "", passwordHash);
            return NextResponse.json({ ok: true, user }, { status: 201 });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            return NextResponse.json(
                { error: message || "Create failed" },
                { status: 400 }
            );
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
