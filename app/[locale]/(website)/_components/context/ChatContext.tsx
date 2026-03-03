"use client";

import { createContext, useContext, useState } from "react";

interface ChatState {
  isOpen: boolean;
}

interface ChatActions {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

type ChatContextValue = ChatState & ChatActions;

const ChatContext = createContext<ChatContextValue | null>(null);

function useChat(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}

function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value: ChatContextValue = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };

  return <ChatContext value={value}>{children}</ChatContext>;
}

export { ChatContext, ChatProvider, useChat, type ChatContextValue };
