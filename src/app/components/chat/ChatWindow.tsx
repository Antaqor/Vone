import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import useChat, { ChatMessage } from "../../hooks/useChat";
import { BASE_URL } from "../../lib/config";

interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
  online?: boolean;
}

interface ChatWindowProps {
  chatId: string;
  user: UserInfo;
  onBack?: () => void;
}

export default function ChatWindow({ chatId, user, onBack }: ChatWindowProps) {
  const { messages, sendMessage, startTyping, typing, loading } = useChat(chatId);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  const me = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text);
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    } else {
      startTyping(me);
    }
  };

  return (
    <div className="flex flex-col h-full pb-20 md:pb-0">
      <div className="flex items-center p-3 border-b border-supportBorder">
        {onBack && (
          <button className="md:hidden mr-2" onClick={onBack} aria-label="Back">
            ←
          </button>
        )}
        <Link href={`/profile/${user.id}`} target="_blank" className="mr-2">
          {user.avatar ? (
            <Image
              src={`${BASE_URL}${user.avatar}`}
              alt={user.name}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>
        <span className="font-medium mr-2">{user.name}</span>
        {user.online && <span className="w-2 h-2 rounded-full bg-green-500" />}
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div className="text-center text-gray-500 py-4">No messages yet</div>
        )}
        {!loading && messages.map((msg: ChatMessage) => {
          const isMe = msg.sender._id === me;
          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <Image
                  src={`${BASE_URL}${msg.sender.profilePicture || ""}`}
                  alt={msg.sender.username}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <div>
                <div
                  className={`px-3 py-2 rounded-2xl text-sm ${
                    isMe
                      ? "bg-brand text-white rounded-br-none"
                      : "bg-gray-200 text-black rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <div
                  className={`text-[10px] text-gray-500 mt-1 ${isMe ? "text-right" : ""}`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        {typing && (
          <div className="text-xs text-gray-500">{user.name} бичиж байна...</div>
        )}
        <div ref={endRef} />
      </div>
      <div className="p-3 border-t border-supportBorder space-y-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          className="w-full border rounded p-2 resize-none"
          placeholder="Type a message"
        />
        <div className="flex justify-between items-center">
          <button onClick={() => setText((t) => t + "\u{1F642}")}>🙂</button>
          <button
            onClick={handleSend}
            aria-label="Send message"
            className="bg-brand text-white p-2 rounded-full ml-2"
          >
            <PaperAirplaneIcon className="w-5 h-5 rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}
