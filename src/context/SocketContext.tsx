import React, { createContext, useEffect, ReactNode } from "react";
import { AppState, AppStateStatus } from "react-native";
import socket from "../socket";

export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err: any) => {
      console.error("Socket connection error:", err.message);
    });

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active" && !socket.connected) {
        console.log("App returned to foreground, reconnecting socket...");
        socket.connect();
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      socket.disconnect();
      subscription.remove(); // ✅ proper cleanup
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
