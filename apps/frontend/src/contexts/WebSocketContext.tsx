"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

export interface BotStats {
  online: boolean;
  uptime: number;
  memoryUsage: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  guilds: number;
  users: number;
  channels: number;
  ping: number;
  lastHeartbeat: Date;
}

interface WebSocketContextType {
  socket: Socket | null;
  botStats: BotStats | null;
  isConnected: boolean;
  connectionError: string | null;
  connect: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [botStats, setBotStats] = useState<BotStats | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const connect = useCallback(() => {
    if (socket || isInitialized) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const newSocket = io(API_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      console.log("WebSocket connected:", newSocket.id);
      setIsConnected(true);
      setConnectionError(null);

      newSocket.emit("request-stats");
    });

    newSocket.on("disconnect", () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    newSocket.on("bot-stats", (stats: BotStats) => {
      setBotStats(stats);
    });

    setSocket(newSocket);
    setIsInitialized(true);
  }, []);

  const disconnect = useCallback(() => {
    setSocket((currentSocket) => {
      if (currentSocket) {
        currentSocket.close();
        setIsConnected(false);
        setConnectionError(null);
        setBotStats(null);
        setIsInitialized(false);
        return null;
      }
      return currentSocket;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const value: WebSocketContextType = {
    socket,
    botStats,
    isConnected,
    connectionError,
    connect,
    disconnect,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
