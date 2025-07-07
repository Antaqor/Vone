"use client";
import { motion } from "framer-motion";

export default function LoginRequiredPopup() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#111] text-white px-6 py-4 rounded-xl shadow-xl"
      >
        <p className="text-lg font-medium">Чи эхлээд нэвтрэх хэрэгтэй</p>
      </motion.div>
    </motion.div>
  );
}
