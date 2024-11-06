import ChatService from "../services/ChatService";

export default function chatSocketHandler(io) {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    ChatService.addUser(socket.id);

    socket.emit("connected-users", ChatService.getConnectedUsers());

    socket.on("send-message-to-all", (message) => {
      console.log("Message to all users:", message);
      ChatService.sendMessageToAll(io, message, socket.id);
    });

    socket.on("send-message-to-user", (data) => {
      const { targetSocketId, message } = data;
      console.log(`Message to user ${targetSocketId}:`, message);
      ChatService.sendMessageToUser(io, targetSocketId, message, socket.id);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
      ChatService.removeUser(socket.id);

      io.emit("connected-users", ChatService.getConnectedUsers());
    });
  });
}
