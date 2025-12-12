"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
    email: string;
    password: string;
};

export default function SignInForm() {
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<FormValues>({ mode: "onSubmit" });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const onSubmit = async (data: FormValues) => {
        setSuccess(null);
        setLoading(true);
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            const payload = await res.json().catch(() => ({}));
            if (!res.ok) {
                console.log("Sign in failed");
                console.log(res);
                setError("email", {
                    type: "server",
                    message: payload?.error || "Sign in failed",
                });
            } else {
                setSuccess("Signed in");
                reset();
                console.log("Signed in successfully");
                console.log(payload);
            }
        } catch (err: unknown) {
            setError("email", { type: "server", message: String(err) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto p-4"
        >
            <h2 className="text-lg font-bold mb-4">Sign in</h2>

            {errors.email && (
                <div className="text-red-600 mb-2">{errors.email.message}</div>
            )}
            {errors.password && (
                <div className="text-red-600 mb-2">
                    {errors.password.message}
                </div>
            )}
            {success && <div className="text-green-600 mb-2">{success}</div>}

            <label className="block mb-2">
                <div className="text-sm">Email</div>
                <input
                    type="email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                            message: "Invalid email",
                        },
                    })}
                    className="w-full border rounded px-2 py-1"
                />
            </label>

            <label className="block mb-4">
                <div className="text-sm">Password</div>
                <input
                    type="password"
                    {...register("password", {
                        required: "Password is required",
                    })}
                    className="w-full border rounded px-2 py-1"
                />
            </label>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={loading}
            >
                {loading ? "Signing in..." : "Sign in"}
            </button>
        </form>
    );
}
