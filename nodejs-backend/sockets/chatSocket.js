import ChatService from "../services/ChatService.js";

export default function (io) {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    ChatService.addUser(userId, socket.id);
    socket.emit("connected-users", ChatService.getConnectedUsers());

    socket.on("send-message-to-all", (message) => {
      console.log("Message to all users:", message);
      ChatService.sendMessageToAll(io, message, userId);
    });

    socket.on("send-message-to-user", (data) => {
      const { targetUserId, message } = data;
      console.log(`Message to user ${targetUserId}:`, message);
      ChatService.sendMessageToUser(io, targetUserId, message, userId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
      ChatService.removeUser(userId);
      io.emit("connected-users", ChatService.getConnectedUsers());
    });
  });
}
