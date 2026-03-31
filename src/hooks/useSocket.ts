import { useEffect, useRef, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import { apiUrl } from "@/src/api/axios/api-url";
import { useAuthStore } from "@/src/stores/authStore";
import type { ChannelMessage } from "@/src/api/types/chat.types";

export function useSocket(channelId: number | null) {
  const socketRef = useRef<Socket | null>(null);
  const callbackRef = useRef<((msg: ChannelMessage) => void) | null>(null);

  useEffect(() => {
    if (channelId == null) return;

    const token = useAuthStore.getState().accessToken;
    if (!token) return;

    const socket = io(apiUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-channel", channelId);
    });

    socket.on("new-message", (msg: ChannelMessage) => {
      callbackRef.current?.(msg);
    });

    socket.on("error-message", (msg: string) => {
      console.warn(`[Socket] server error for channel ${channelId}:`, msg);
    });

    socket.on("connect_error", (err) => {
      console.warn("[Socket] connect_error:", err.message);
    });

    return () => {
      socket.emit("leave-channel", channelId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [channelId]);

  const onNewMessage = useCallback((cb: (msg: ChannelMessage) => void) => {
    callbackRef.current = cb;
  }, []);

  return { onNewMessage };
}
