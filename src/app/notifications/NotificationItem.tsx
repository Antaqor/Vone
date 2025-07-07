"use client";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon, ChatBubbleLeftIcon, ArrowUturnLeftIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { formatPostDate } from "../lib/formatDate";
import { BASE_URL } from "../lib/config";

interface Notification {
  _id: string;
  type: "like" | "comment" | "reply" | "follow";
  post?: { _id: string };
  sender?: { _id: string; username: string; profilePicture?: string };
  read: boolean;
  createdAt: string;
}

interface Props {
  notification: Notification;
  currentUserId: string;
}

export default function NotificationItem({ notification, currentUserId }: Props) {
  const { sender } = notification;

  const message = () => {
    const userLink = (
      <Link href={`/profile/${sender?._id}`} className="font-semibold hover:underline">
        {sender?.username}
      </Link>
    );
    if (notification.type === "like") {
      return (
        <span>
          {userLink} таны бичлэгт {" "}
          <Link href={`/profile/${currentUserId}?post=${notification.post?._id}`} className="hover:underline">
            бичлэг
          </Link>
          д лайк дарлаа.
        </span>
      );
    }
    if (notification.type === "comment") {
      return (
        <span>
          {userLink} таны {" "}
          <Link href={`/profile/${currentUserId}?post=${notification.post?._id}`} className="hover:underline">
            бичлэг
          </Link>
          д сэтгэгдэл үлдээв.
        </span>
      );
    }
    if (notification.type === "reply") {
      return (
        <span>
          {userLink} таны {" "}
          <Link href={`/profile/${currentUserId}?post=${notification.post?._id}`} className="hover:underline">
            сэтгэгдэл
          </Link>
          д хариу бичлээ.
        </span>
      );
    }
    return (
      <span>
        {userLink} таныг дагаж эхэллээ.
      </span>
    );
  };

  const icon = () => {
    switch (notification.type) {
      case "like":
        return <HeartIcon className="w-5 h-5 text-pink-500" />;
      case "comment":
        return <ChatBubbleLeftIcon className="w-5 h-5 text-blue-500" />;
      case "reply":
        return <ArrowUturnLeftIcon className="w-5 h-5 text-green-500" />;
      default:
        return <UserPlusIcon className="w-5 h-5 text-brand" />;
    }
  };

  return (
    <li
      className={`flex items-start gap-4 px-4 py-3 border-b border-white/10 transition-colors
        ${notification.read ? "hover:bg-gray-50 dark:hover:bg-gray-900" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
    >
      {sender?.profilePicture ? (
        <Image
          src={`${BASE_URL}${sender.profilePicture}`}
          alt={sender.username}
          width={40}
          height={40}
          className="w-10 h-10 object-cover"
        />
      ) : (
        <div className="w-10 h-10 bg-gray-300" />
      )}
      <div className="flex-1 text-sm leading-snug">
        <div className="flex items-center gap-1">
          {icon()}
          <p>{message()}</p>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{formatPostDate(notification.createdAt)}</p>
      </div>
      {!notification.read && <span className="w-2 h-2 bg-brand rounded-full self-center" />}
    </li>
  );
}
