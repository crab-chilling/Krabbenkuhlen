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

  handleSendMessage(io, message) {
    if (!message.to) return;

    if (message.to === "*") {
      io.emit("receive-message", message);
    } else {
      const targetSocketId = this.activeSockets[message.to]?.socketId;
      if (targetSocketId) {
        io.to(targetSocketId).emit("receive-message", message);
      }
    }

    this.saveMessage(message);
  }

  async saveMessage(message) {
    return;
    // TODO: create the Spring API then adapt this call
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
