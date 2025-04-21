import {io} from "socket.io-client"


const socket = io("https://myharmonic-dev.app", {
    path: "/api/social/socket.io", 
    transports: ["websocket"],     
    autoConnect: false,            
  });

export default socket;