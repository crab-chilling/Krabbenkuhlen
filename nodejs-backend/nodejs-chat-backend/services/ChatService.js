import axios from "axios";

const ALL_USERS_ID = 999;

class ChatService {
  constructor() {
    this.activeSockets = {};
    this.messageHistoryApiUrl = "http://localhost:8083/message";
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

  handleSendMessage(io, socket, message) {
    if (!message.to) return;

    if (message.to === ALL_USERS_ID) {
      socket.broadcast.emit("receive-message", message);
    } else {
      const targetSocketId = this.activeSockets[message.to]?.socketId;
      if (targetSocketId) {
        io.to(targetSocketId).emit("receive-message", message);
      }
    }

    this.saveMessage(message);
  }

  async saveMessage(message) {
    try {
      const payload = {
        message: message.message,
        from: message.from,
        to: message.to,
        date: new Date().toISOString(),
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
