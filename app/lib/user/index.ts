"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import type { User } from "../db/schema";
import { verifyPassword } from "../security";

/**
 * Create a new user record.
 * - Expects the password to already be hashed (do hashing in the auth layer).
 * - Throws if a user with the same email already exists.
 */
export async function signUp(
    email: string,
    name: string,
    passwordHash: string
): Promise<User> {
    const now = new Date();

    const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
    if (existing.length) {
        throw new Error("User with this email already exists");
    }

    const [created] = await db
        .insert(users)
        .values({
            email,
            name: name ?? "",
            password_hash: passwordHash,
            createdAt: now,
        })
        .returning();

    if (!created) {
        throw new Error("Failed to create user");
    }

    return created as User;
}

export async function signIn(email: string, password: string): Promise<User> {
    const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
        .then((res) => res[0] as User | undefined);

    if (!user) throw new Error("User not found");

    const stored = (user as unknown as { password_hash: string }).password_hash;
    const ok = await verifyPassword(password, stored);
    if (!ok) throw new Error("Invalid password");

    return user;
}
