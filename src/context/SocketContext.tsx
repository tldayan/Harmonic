// SocketContext.tsx
import React, { createContext, useEffect, ReactNode } from "react";
import socket from "../socket";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { AppState } from "react-native";

export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const userUUID = useSelector((state: RootState) => state.auth.userUUID);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active" && !socket.connected) {
        console.log("🔁 App resumed — reconnecting socket...");
        socket.connect();
      }
    };

    const appStateListener = AppState.addEventListener("change", handleAppStateChange);
    return () => appStateListener.remove();
  }, []);

  useEffect(() => {
    if (!userUUID) return;

    socket.connect();

    const registerSocket = () => {
      socket.emit("register", userUUID);
      console.log("✅ Registered socket with userUUID:", userUUID);
    };

    socket.on("connect", registerSocket);

    socket.on("disconnect", (reason) => {
      console.warn("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (err: any) => {
      console.error("❌ Socket connection error:", err.message);
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      console.log(`🔁 Reconnection attempt #${attempt}`);
    });

    return () => {
      socket.off("connect", registerSocket);
      socket.emit("deregister", userUUID);
      console.log("🔌 Deregistered socket with userUUID:", userUUID);
      socket.disconnect();
    };
  }, [userUUID]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
