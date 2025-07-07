"use client";
import { motion } from "framer-motion";

export default function LoginRequiredPopup({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#212121] text-white px-6 py-4 rounded-lg shadow-lg border border-brand max-w-xs w-full text-center"
      >
        <p className="text-base font-medium">Чи эхлээд нэвтрэх хэрэгтэй</p>
      </motion.div>
    </motion.div>
  );
}
