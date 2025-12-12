"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
    email: string;
    name?: string;
    password: string;
    confirm: string;
};

export default function SignUpForm() {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        watch,
        formState: { errors },
    } = useForm<FormValues>({ mode: "onSubmit" });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const onSubmit = async (data: FormValues) => {
        setSuccess(null);

        if (data.password !== data.confirm) {
            setError("confirm", {
                type: "validate",
                message: "Passwords do not match",
            });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    name: data.name,
                    password: data.password,
                }),
            });

            const payload = await res.json();
            if (!res.ok) {
                setError("email", {
                    type: "server",
                    message: payload?.error || "Sign up failed",
                });
            } else {
                setSuccess("Account created");
                reset();
            }
        } catch (err: unknown) {
            setError("email", { type: "server", message: String(err) });
        } finally {
            setLoading(false);
        }
    };

    const password = watch("password");

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto p-4"
        >
            <h2 className="text-lg font-bold mb-4">Sign up</h2>

            {errors.email && (
                <div className="text-red-600 mb-2">{errors.email.message}</div>
            )}
            {errors.confirm && (
                <div className="text-red-600 mb-2">
                    {errors.confirm.message}
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

            <label className="block mb-2">
                <div className="text-sm">Name</div>
                <input
                    type="text"
                    {...register("name")}
                    className="w-full border rounded px-2 py-1"
                />
            </label>

            <label className="block mb-2">
                <div className="text-sm">Password</div>
                <input
                    type="password"
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 8,
                            message: "Minimum 8 characters",
                        },
                    })}
                    className="w-full border rounded px-2 py-1"
                />
            </label>

            <label className="block mb-4">
                <div className="text-sm">Confirm Password</div>
                <input
                    type="password"
                    {...register("confirm", {
                        required: "Please confirm your password",
                        validate: (v) =>
                            v === password || "Passwords do not match",
                    })}
                    className="w-full border rounded px-2 py-1"
                />
            </label>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={loading}
            >
                {loading ? "Creating..." : "Create account"}
            </button>
        </form>
    );
}
