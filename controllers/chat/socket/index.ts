import { Server, Socket } from "socket.io";
import { IConnectedClients } from "../../../models/chat";
import { chat } from "./chat";
import { sendMessage } from "./sendMessage";
import { markAsRead } from "./markAsRead";

const connectedClients: IConnectedClients[] = [];
export const SocketInit = (httpServer: any, options: any) => {
  const io = new Server(httpServer, options);

  io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);

    socket.on("register_client", (client: IConnectedClients) => {
      connectedClients.push(client);
    });

    chat(socket);
    sendMessage(socket, connectedClients);
    markAsRead(socket);

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      const index = connectedClients.findIndex(
        (client) => client.socketId === socket.id
      );
      if (index !== -1) connectedClients.splice(index, 1);
    });
  });
};
