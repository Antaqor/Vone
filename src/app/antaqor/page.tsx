"use client";
import Image from "next/image";

export default function AntaqorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Image
        src="https://sdmntprwestus3.oaiusercontent.com/files/00000000-d4c8-61fd-967a-ac9b3e52987d/raw?se=2025-07-30T03%3A26%3A51Z&sp=r&sv=2024-08-04&sr=b&scid=49752a5f-a005-5901-863c-00e04675bffd&skoid=b64a43d9-3512-45c2-98b4-dea55d094240&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-29T18%3A53%3A16Z&ske=2025-07-30T18%3A53%3A16Z&sks=b&skv=2024-08-04&sig=Rd1bfB2JXS9rox7p%2Blfi6Fk9A7w7Ard%2B1WsP2sqOnjc%3D"
        alt="Antaqor"
        width={800}
        height={600}
        className="object-contain"
        priority
      />
    </div>
  );
}
