"use client";
import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";

const ChatPage = () => {
  const { filename } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!filename) {
      router.replace("/");
    }
  }, []);

  if (!filename) {
    return <div>Loading...</div>;
  }

  console.log(filename);
  return <div>ChatPage</div>;
};

export default ChatPage;
