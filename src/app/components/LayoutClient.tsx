"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { ThemeProvider } from "../context/ThemeContext";
import {
  NotificationProvider,
  useNotifications,
} from "../context/NotificationContext";
import ChatIconSrc from "@/app/img/chat.svg";
import HeartIconSrc from "@/app/img/heart.svg";
import HomeIconSrc from "@/app/img/home.svg";
import StudyIconSrc from "@/app/img/study.svg";
import Image from "next/image";
import Header from "./Header";
import BottomNav from "./BottomNav";
import SidebarControl from "./SidebarControl";
import NavigationLoader from "./NavigationLoader";
import LoadingOverlay from "./LoadingOverlay";
import LoginRequiredPopup from "./LoginRequiredPopup";
import Link from "next/link";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loggedIn, loading } = useAuth();
  const publicPaths = ["/login", "/register"];
  const [showPrompt, setShowPrompt] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!loading && !loggedIn && !publicPaths.some((p) => pathname.startsWith(p))) {
      setShowPrompt(true);
      timerRef.current = setTimeout(() => router.push("/login"), 1500);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [loading, loggedIn, pathname, router]);

  const handleClosePrompt = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowPrompt(false);
    router.push("/login");
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  if (showPrompt) {
    return <LoginRequiredPopup onClose={handleClosePrompt} />;
  }

  return <>{children}</>;
}

function NotificationNavItem() {
  const { unreadCount } = useNotifications();
  return (
      <li>
        <Link
            href="/notifications"
            className="group flex items-center gap-2 p-4 pl-0 text-xl font-semibold text-gray-700 transition-smooth focus:outline-none hover:text-brand focus:ring-2 focus:ring-brand"
        >
          <Image src={HeartIconSrc} alt="Chat" width={24} height={24} className="w-6 h-6 group-hover:invert group-hover:brightness-0 transition-colors" />
          <span className="flex items-center">
          Мэдэгдэл
            {unreadCount > 0 && (
                <span className="ml-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
            )}
        </span>
        </Link>
      </li>
  );
}

export default function LayoutClient({
                                       children,
                                     }: {
  children: React.ReactNode;
}) {
  const [mountLoading, setMountLoading] = useState(true);
  const pathname = usePathname();
  const isWidePage =
      pathname.startsWith("/dashboard") || pathname.startsWith("/classroom");
  const isChatPage = pathname.startsWith("/chat");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    const timer = setTimeout(() => setMountLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
      <ThemeProvider>
        <CartProvider>
          <AuthProvider>
            <AuthGuard>
              <NotificationProvider>
                {mountLoading &&
                    (pathname === "/" ||
                        pathname.startsWith("/users") ||
                        pathname.startsWith("/profile")) && <LoadingOverlay />}
                <NavigationLoader />
                {isAuthPage ? (
                  <div className="flex items-center justify-center min-h-screen">
                    {children}
                  </div>
                ) : (
                  <>
                    <div className="max-w-7xl w-full mx-auto md:px-6">
                      <SidebarControl />
                      <Header />
                      <main className="flex-grow flex flex-col md:flex-row gap-0 pt-16">
                        <aside
                            id="left-sidebar"
                            className="hidden md:block w-full md:w-1/4 border-r border-supportBorder sticky top-16 h-[calc(100vh-80px)] overflow-y-auto fade-in-up"
                        >
                          <nav>
                            <ul className="space-y-1">
                              <li>
                                <Link
                                    href="/"
                                    className="group flex items-center gap-2 p-4 pl-0 text-xl font-semibold text-gray-700 transition-smooth focus:outline-none hover:text-brand focus:ring-2 focus:ring-brand"
                                >
                                  <Image src={HomeIconSrc} alt="Chat" width={24} height={24} className="w-6 h-6 group-hover:invert group-hover:brightness-0 transition-colors" />
                                  <span>Нүүр</span>
                                </Link>
                              </li>
                              <li>
                                <Link
                                    href="/classroom"
                                    className="group flex items-center gap-2 p-4 pl-0 text-xl font-semibold text-gray-700 transition-smooth focus:outline-none hover:text-brand focus:ring-2 focus:ring-brand"
                                >
                                  <Image src={StudyIconSrc} alt="Chat" width={24} height={24} className="w-6 h-6 group-hover:invert group-hover:brightness-0 transition-colors" />
                                  <span>Хичээл</span>
                                </Link>
                              </li>
                              <NotificationNavItem />
                              <li>
                                <Link
                                    href="/chat"
                                    className="group flex items-center gap-2 p-4 pl-0 text-xl font-semibold text-gray-700 transition-smooth focus:outline-none hover:text-brand focus:ring-2 focus:ring-brand"
                                >
                                  <Image src={ChatIconSrc} alt="Chat" width={24} height={24} className="w-6 h-6 group-hover:invert group-hover:brightness-0 transition-colors" />
                                  <span>Чат</span>
                                </Link>
                              </li>
                            </ul>
                          </nav>
                        </aside>
                        <div
                            className={`w-full ${isWidePage ? "md:w-full" : isChatPage ? "md:w-3/4" : "md:w-1/2 md:border-r md:border-supportBorder"}`}
                        >
                          <div className="space-y-6">{children}</div>
                        </div>
                        {!isChatPage && (
                            <aside
                                id="right-sidebar"
                                className="hidden md:block w-full md:w-1/4 sticky top-16 h-[calc(100vh-80px)] overflow-y-auto p-2 fade-in-up"
                            ></aside>
                        )}
                      </main>
                    </div>
                    <BottomNav />
                  </>
                )}
              </NotificationProvider>
            </AuthGuard>
          </AuthProvider>
        </CartProvider>
      </ThemeProvider>
  );
}
