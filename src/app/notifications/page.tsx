"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../lib/config";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import NotificationItem from "./NotificationItem";

interface Notification {
  _id: string;
  type: "like" | "comment" | "reply" | "follow";
  post?: { _id: string };
  sender?: { _id: string; username: string; profilePicture?: string };
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const { refresh } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.accessToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get<Notification[]>(
          `${BASE_URL}/api/notifications`,
          { headers: { Authorization: `Bearer ${user.accessToken}` } }
        );

        setNotifications(data);

        // Mark unread notifications as read in parallel
        await Promise.all(
          data
            .filter((n) => !n.read)
            .map((n) =>
              axios.post(
                `${BASE_URL}/api/notifications/${n._id}/read`,
                {},
                { headers: { Authorization: `Bearer ${user.accessToken}` } }
              )
            )
        );

        // Refresh global unread badge/indicator
        await refresh();
      } catch (err) {
        console.error("Fetch notifications error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.accessToken, refresh]);

  if (loading) return <div className="p-4">Уншиж байна...</div>;
  if (!user) return <div className="p-4">Мэдэгдлийг үзэхийн тулд нэвтэрнэ үү.</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Мэдэгдэл</h1>
      {notifications.length === 0 ? (
        <p>Мэдэгдэл алга.</p>
      ) : (
        <ul className="divide-y divide-white/10">
          {notifications.map((n) => (
            <NotificationItem
              key={n._id}
              notification={n}
              currentUserId={user._id || ""}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
