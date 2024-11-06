import axios from "axios";

class ChatService {
  constructor() {
    this.activeSockets = {};
    this.messageHistoryApiUrl = "http://localhost:8082/api/chat";
  }

  addUser(userId, socketId) {
    this.activeSockets[userId] = { socketId };
  }

  removeUser(userId) {
    delete this.activeSockets[userId];
  }

  getConnectedUsers() {
    return Object.keys(this.activeSockets);
  }

  sendMessageToAll(io, message, fromUserId) {
    const fromSocketId = this.activeSockets[fromUserId]?.socketId;
    if (fromSocketId) {
      io.emit("receive-message", { message, from: fromSocketId });
    }

    this.saveMessage(message, fromSocketId, null);
  }

  sendMessageToUser(io, targetUserId, message, fromUserId) {
    const targetSocketId = this.activeSockets[targetUserId]?.socketId;
    if (targetSocketId) {
      io.to(targetSocketId).emit("receive-message", {
        message,
        from: fromUserId,
      });
    }

    this.saveMessage(message, fromUserId, targetUserId);
  }

  async saveMessage(message, fromUserId, toUserId) {
    try {
      const payload = {
        message,
        fromUserId,
        toUserId: toUserId || null,
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