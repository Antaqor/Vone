"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { BASE_URL } from "../lib/config";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem("rememberUsername");
        const savedPass = localStorage.getItem("rememberPassword");
        if (savedUser) {
            setUsername(savedUser);
            setRemember(true);
        }
        if (savedPass) {
            setPassword(savedPass);
            setRemember(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await axios.post(`${BASE_URL}/api/auth/login`, {
                username,
                password,
            });
            if (res.status === 200 && res.data.token) {
                const { user, token } = res.data;
                login(user, token);
                document.cookie = `token=${token}; path=/`;
                if (remember) {
                    localStorage.setItem("rememberUsername", username);
                    localStorage.setItem("rememberPassword", password);
                } else {
                    localStorage.removeItem("rememberUsername");
                    localStorage.removeItem("rememberPassword");
                }
                router.push("/");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError("Нэвтрэх алдаа.");
        }
    };

    return (
        <div className="w-full max-w-lg space-y-10 bg-backgroundDark/80 backdrop-blur text-white p-10">
            <motion.div
                whileHover={{ opacity: 0.97 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                // ↑ just this line changed ↓
                className="w-full max-w-lg space-y-6 bg-backgroundDark/80 backdrop-blur text-white p-8 rounded-2xl shadow-2xl"
            >
                <div className="flex justify-center mb-3">
                    <motion.h2
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.65, type: "spring", stiffness: 60 }}
                        className="
                glitch
                font-orbitron
                select-none
                tracking-wider
                text-center
                leading-none
                w-full
                max-w-xs
                sm:max-w-md
                mx-auto
            "
                        data-text="Монгол Сошиал Платформ"
                        style={{
                            backgroundImage: "linear-gradient(90deg, #119C99, #FFC0CB 65%, #119C99)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                            fontSize: "1.5rem",
                            margin: "0 auto",
                            display: "inline-block",
                        }}
                    >

                    </motion.h2>
                </div>
                <h1 className="text-3xl font-bold text-black">Нэвтрэх</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Хэрэглэгчийн нэр
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-700 rounded-lg px-4 py-3 bg-inputBg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand"
                            placeholder="Нэр"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Нууц үг
                        </label>
                        <input
                            type="password"
                            className="w-full border border-gray-700 rounded-lg px-4 py-3 bg-inputBg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-700">
                        <label className="flex items-center text-black">
                            <input
                                type="checkbox"
                                className="h-4 w-4 mr-2"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            Сануулах
                        </label>
                        <button
                            type="button"
                            onClick={() => alert("Нууц үгээ мартсан уу?")}
                            className="underline hover:text-brand"
                        >
                            Нууц үгээ мартсан?
                        </button>
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className={`w-full py-3  rounded-md font-bold text-lg bg-[#119C99] hover:opacity-90 transition flex items-center justify-center gap-2 ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={loading}
                    >
                        Нэвтрэх
                    </button>
                </form>
                <div className="flex items-center my-2">
                    <div className="flex-grow border-t border-[#2B2E31]" />
                    <span className="mx-2 text-gray-500 text-sm">эсвэл</span>
                    <div className="flex-grow border-t border-[#2B2E31]" />
                </div>
                <button
                    onClick={() => router.push("/register")}
                    className="w-full py-3 bg-[#212121] border border-[#119C99] text-[#119C99] rounded-md font-bold hover:bg-[#119C99]/10 transition"
                >
                    Шинээр бүртгүүлэх
                </button>
            </motion.div>
        </div>
    );
}
