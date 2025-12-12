import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derived = (await scrypt(password, salt, 64)) as Buffer;
    const hash = derived.toString("hex");
    const passwordHash = `${salt}:${hash}`;

    return passwordHash;
}

/**
 * Verify a plaintext password against a stored `salt:hash` value.
 */
export async function verifyPassword(
    password: string,
    stored: string
): Promise<boolean> {
    if (!stored || typeof stored !== "string") return false;
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;

    const derived = (await scrypt(password, salt, 64)) as Buffer;
    const derivedHex = derived.toString("hex");

    try {
        const a = Buffer.from(derivedHex, "hex");
        const b = Buffer.from(hash, "hex");
        if (a.length !== b.length) return false;
        // constant-time compare
        return cryptoTimingSafeEqual(a, b);
    } catch {
        return false;
    }
}

function cryptoTimingSafeEqual(a: Buffer, b: Buffer) {
    // use Node's timingSafeEqual if available
    // use Node's timingSafeEqual
    try {
        return timingSafeEqual(a, b);
    } catch {
        return a.equals(b);
    }
}
