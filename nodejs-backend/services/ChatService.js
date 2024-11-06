import axios from "axios";

class ChatService {
  constructor() {
    this.activeSockets = {};
    this.messageHistoryApiUrl = "http://localhost:8082/api/chat";
  }

  addUser(socketId) {
    this.activeSockets[socketId] = { socketId };
  }

  removeUser(socketId) {
    delete this.activeSockets[socketId];
  }

  getConnectedUsers() {
    return Object.keys(this.activeSockets);
  }

  sendMessageToAll(io, message, fromSocketId) {
    io.emit("receive-message", { message, from: fromSocketId });
    this.saveMessage(message, fromSocketId, null);
  }

  sendMessageToUser(io, targetSocketId, message, fromSocketId) {
    if (this.activeSockets[targetSocketId]) {
      io.to(targetSocketId).emit("receive-message", {
        message,
        from: fromSocketId,
      });
      this.saveMessage(message, fromSocketId, targetSocketId);
    }
  }

  async saveMessage(message, fromSocketId, toSocketId) {
    try {
      const payload = {
        message,
        fromSocketId,
        toSocketId: toSocketId || null,
        timestamp: new Date().toISOString(),
      };

      const response = await axios.post(this.messageHistoryApiUrl, payload);

      if (response.status === 200) {
        console.log("Message saved to history successfully");
      } else {
        console.error("Failed to save message to history", response.data);
      }
    } catch (error) {
      console.error("Error saving message to history:", error);
    }
  }
}

export default new ChatService();
