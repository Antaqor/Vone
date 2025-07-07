"use client";
import { motion } from "framer-motion";

export default function LoginRequiredPopup({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="z-50 w-[90vw] max-w-md rounded-xl bg-[#171717] p-6 shadow-lg text-white text-center border border-brand"
      >
        <p className="text-base font-medium">Чи эхлээд нэвтрэх хэрэгтэй</p>
      </motion.div>
    </motion.div>
  );
}
