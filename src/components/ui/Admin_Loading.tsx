"use client";
import { fadeUp } from "@/Animation";
import { motion } from "framer-motion";
interface props {
  CheckAdmin?: boolean;
}
const Admin_Loading = ({ CheckAdmin }: props) => {
  return (
    <main className="flex flex-col justify-center items-center gap-5">
      <motion.div
        {...fadeUp}
        className="w-60 h-60 rounded-full border-r border-l-transparent border-primary dark:border-primary-foreground  animate-spin "
      />
      <motion.h4 {...fadeUp}>
        {CheckAdmin ? "Verify Admin...." : "Loading..."}
      </motion.h4>{" "}
    </main>
  );
};

export default Admin_Loading;
