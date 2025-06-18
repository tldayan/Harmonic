// In SocketContext.tsx
import React, { createContext, useEffect, ReactNode } from "react";
import socket from '../socket';
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const userUUID = useSelector((state: RootState) => state.auth.userUUID);

  useEffect(() => {
    socket.connect();

    const registerSocket = () => {
      if (socket.connected && userUUID) {
        socket.emit("register", userUUID);
        console.log("✅ Registered socket with userUUID:", userUUID);
      }
    };

    socket.on("connect", registerSocket);

    socket.on("connect_error", (err: any) => {
      console.error("❌ Socket connection error:", err.message);
    });

    return () => {
      socket.off("connect", registerSocket);
      if (userUUID) {
        socket.emit("deregister", userUUID);
        console.log("🔌 Deregistered socket with userUUID:", userUUID);
      }
      socket.disconnect();
    };
  }, [userUUID]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
