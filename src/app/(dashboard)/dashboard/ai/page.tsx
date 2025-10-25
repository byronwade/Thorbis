"use client";

import { useChat } from "@ai-sdk/react";
import type { Message } from "ai";
import { useEffect, useRef } from "react";
import { ChatContainer } from "@/components/chat/chat-container";
import { chatSelectors, useChatStore } from "@/lib/store/chat-store";

export default function AIPage() {
  const messagesRef = useRef<Message[]>([]);

  // Use the chat store
  const activeChat = useChatStore(chatSelectors.activeChat);
  const { createChat, setActiveChat, addMessage, updateChatTitle } =
    useChatStore();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
    stop,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: {
      model: "gpt-4o",
    },
    onFinish: (message) => {
      // Save assistant message to store
      if (activeChat) {
        addMessage(activeChat.id, message);

        // Update chat title with first user message if still default
        if (activeChat.title === "New Chat" && messages.length > 0) {
          const firstUserMessage = messages.find((m) => m.role === "user");
          if (firstUserMessage) {
            const title =
              firstUserMessage.content.slice(0, 50) +
              (firstUserMessage.content.length > 50 ? "..." : "");
            updateChatTitle(activeChat.id, title);
          }
        }
      }
    },
  });

  // Sync messages to store when they change
  useEffect(() => {
    if (activeChat && messages.length > messagesRef.current.length) {
      // New messages added - sync to store
      const newMessages = messages.slice(messagesRef.current.length);
      newMessages.forEach((msg) => {
        // Only add user messages here (assistant messages are added in onFinish)
        if (msg.role === "user") {
          addMessage(activeChat.id, msg);
        }
      });
    }
    messagesRef.current = messages;
  }, [messages, activeChat?.id, addMessage]);

  // Load active chat messages on mount or when active chat changes
  useEffect(() => {
    if (activeChat) {
      setMessages(activeChat.messages as any);
      messagesRef.current = activeChat.messages as any;
    } else {
      // Create initial chat if none exists
      const chatId = createChat();
      setActiveChat(chatId);
    }
  }, [activeChat?.id]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full">
      <ChatContainer
        input={input}
        isLoading={isLoading}
        messages={messages}
        onInputChange={handleInputChange}
        onStop={stop}
        onSubmit={originalHandleSubmit}
      />
    </div>
  );
}
