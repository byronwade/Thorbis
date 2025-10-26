"use client";

export const dynamic = "force-dynamic";

import type { UIMessage } from "@ai-sdk/react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { ChatContainer } from "@/components/chat/chat-container";
import { usePageLayout } from "@/hooks/use-page-layout";
import { chatSelectors, useChatStore } from "@/lib/store/chat-store";

export default function AIPage() {
  // Configure layout without custom sidebar (uses default AI section navigation)
  usePageLayout({
    maxWidth: "full",
    padding: "none",
    gap: "none",
    showToolbar: false,
  });

  const messagesRef = useRef<UIMessage[]>([]);
  const [input, setInput] = useState("");

  // Use the chat store
  const activeChat = useChatStore(chatSelectors.activeChat);
  const { createChat, setActiveChat, addMessage, updateChatTitle } =
    useChatStore();

  const { messages, sendMessage, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: (message) => {
      // Save assistant message to store
      if (activeChat) {
        addMessage(activeChat.id, {
          id: message.message.id,
          role:
            message.message.role === "system"
              ? "assistant"
              : message.message.role,
          content: (message.message as any).content || "",
          timestamp: new Date(),
        });

        // Update chat title with first user message if still default
        if (activeChat.title === "New Chat" && messages.length > 0) {
          const firstUserMessage = messages.find((m) => m.role === "user");
          if (firstUserMessage) {
            const title =
              firstUserMessage.parts
                .find((part) => part.type === "text")
                ?.text.slice(0, 50) + "..." || "New Chat";
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
          addMessage(activeChat.id, {
            id: msg.id,
            role: msg.role,
            content: (msg as any).content || "",
            timestamp: new Date(),
          });
        }
      });
    }
    messagesRef.current = messages;
  }, [messages, activeChat?.id, addMessage]);

  // Load active chat messages on mount or when active chat changes
  useEffect(() => {
    if (activeChat) {
      // Load messages from store if available
      // Note: This would need to be implemented based on your store structure
    } else {
      // Create initial chat if none exists
      const chatId = createChat();
      setActiveChat(chatId);
    }
  }, [activeChat?.id, createChat, setActiveChat]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  // Handle new chat
  const handleNewChat = () => {
    const chatId = createChat();
    setActiveChat(chatId);
    // Clear messages by creating a new chat
    // Note: This would need to be implemented based on your store structure
  };

  return (
    <ChatContainer
      input={input}
      isLoading={false} // Loading state would need to be tracked differently
      messages={messages}
      onInputChange={(e) => setInput(e.target.value)}
      onStop={() => {}} // Stop functionality would need to be implemented
      onSubmit={handleSubmit}
    />
  );
}
