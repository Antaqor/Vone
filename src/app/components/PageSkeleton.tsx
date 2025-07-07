"use client";
import { motion } from "framer-motion";

export default function PageSkeleton() {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col space-y-4 p-8 animate-pulse bg-gray-200 dark:bg-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="flex-1 bg-gray-300 dark:bg-gray-700 rounded" />
    </motion.div>
  );
}
