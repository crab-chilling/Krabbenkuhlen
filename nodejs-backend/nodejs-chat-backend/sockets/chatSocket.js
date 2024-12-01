import ChatService from "../services/ChatService.js";

export default function (io) {
  io.on("connection", (socket) => {
    //console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    ChatService.addUser(userId, socket.id);

    io.emit("connected-users", ChatService.getConnectedUsers());

    socket.on("send-message", (message) => {
      console.log("Message:", message);
      ChatService.handleSendMessage(io, socket, message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
      ChatService.removeUser(userId);
      io.emit("connected-users", ChatService.getConnectedUsers());
    });
  });
}
