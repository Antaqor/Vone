"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { BASE_URL } from "../lib/config";

export default function InvitePage() {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const createInvite = async () => {
    if (!user?.accessToken) {
      setError("Нэвтрэх шаардлагатай");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/invite`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Алдаа");
      setCode(`${window.location.origin}/register?invite=${data.code}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 p-4">
      <button
        onClick={createInvite}
        className="px-4 py-2 bg-brand text-white rounded"
      >
        Урилга үүсгэх
      </button>
      {code && (
        <div className="text-center break-all">
          <p>Дараах холбоосыг хуваалцаарай:</p>
          <p className="text-sm text-blue-500">{code}</p>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
