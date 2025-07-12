"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    HomeIcon,
    BellIcon,
    AcademicCapIcon,
    ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import { useNotifications } from "../context/NotificationContext";
import HomeIconSrc from "@/app/img/home.svg";
import Image from "next/image";
import HeartIconSrc from "@/app/img/heart.svg";
import ChatIconSrc from "@/app/img/chat.svg";
import StudyIconSrc from "@/app/img/study.svg";

const BottomNav: React.FC = () => {
    const router = useRouter();
    const [scrolledDown, setScrolledDown] = useState(false);
    const { unreadCount } = useNotifications();

    useEffect(() => {
        let lastY = window.scrollY;
        const onScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastY && currentY > 0) {
                setScrolledDown(true);
            } else if (currentY <= lastY || currentY === 0) {
                setScrolledDown(false);
            }
            lastY = currentY;
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
        <nav
            className={`fixed bottom-0 left-0 w-full md:hidden transition-all border-t border-supportBorder shadow-lg bg-[#111111] text-white ${
                scrolledDown ? "" : ""
            }`}
        >
            <div
                className="flex justify-around items-center py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
            >
                {/* HOME */}
                <button
                    onClick={() => router.push("/")}
                    aria-label="Home"
                    className="p-1 text-white hover:text-brand"
                >
                    <Image src={HomeIconSrc} alt="Chat" width={24} height={24} className="w-6 h-6 group-hover:invert group-hover:brightness-0 transition-colors" />

                </button>


                {/* NOTIFICATIONS */}
                <button
                    onClick={() => router.push("/notifications")}
                    aria-label="Notifications"
                    className="relative p-1 text-white hover:text-brand"
                >
                    <Image src={HeartIconSrc} alt="Chat" width={24} height={24} className="w-6 h-6 group-hover:invert group-hover:brightness-0 transition-colors" />

                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* CHAT */}
                <button
                    onClick={() => router.push("/chat")}
                    aria-label="Chat"
                    className="p-1 text-white hover:text-brand"
                >
                    <Image src={ChatIconSrc} alt="Chat" width={24} height={24} className="w-6 h-6 group-hover:invert group-hover:brightness-0 transition-colors" />
                </button>

                {/* CLASSROOM */}
                <button
                    onClick={() => router.push("/classroom")}
                    aria-label="Classroom"
                    className="p-1 text-white hover:text-brand"
                >
                    <Image src={StudyIconSrc} alt="Chat" width={24} height={24} className="w-6 h-6 group-hover:invert group-hover:brightness-0 transition-colors" />
                </button>

            </div>
        </nav>
        </>
    );
};

export default BottomNav;
