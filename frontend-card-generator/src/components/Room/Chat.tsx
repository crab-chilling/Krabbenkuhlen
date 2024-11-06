import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import {
  selectUserId,
  selectUserLastName,
  selectUserSurname,
} from "../../store/selectors/user.selectors";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Message } from "../../types/chat";
import { User } from "../../types/user";
import { fetchAllUsers } from "../../api/user";
import { io, Socket } from "socket.io-client";

const Chat: React.FC = () => {
  const userId = useSelector(selectUserId);
  const userLastName = useSelector(selectUserLastName);
  const userSurname = useSelector(selectUserSurname);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const connection = useRef<Socket | null>(null);

  // Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      const users: Array<User> = await fetchAllUsers();
      setUsers(users);
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction pour envoyer un message via WebSocket
  const sendSocketMessage = (message: Message) => {
    if (connection.current) {
      connection.current.emit("send-message", message);
    }
  };

  // Gérer la sélection d'un utilisateur
  const handleUserSelect = (event: SelectChangeEvent<number>) => {
    setNewMessage("");
    const id = event.target.value as number;
    const user = users.find((u) => u.id === id);
    setSelectedUser(user || null);
    const messages: Array<Message> = []; // TODO: call the API: getHistory()
    setChatHistory(messages);
  };

  // Envoyer un message
  const handleSendMessage = () => {
    if (selectedUser) {
      const message: Message = {
        from: userId,
        to: selectedUser.id,
        message: newMessage,
        sentAt: new Date(),
      };
      sendSocketMessage(message);
      setChatHistory((prev) => [...prev, message]);
      setNewMessage("");
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
      event.preventDefault();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();

      connection.current = io("http://localhost:3000", {
        query: { userId: userId },
      });

      connection.current.on("connect", () => {
        console.log("Socket.IO connection established");
      });

      connection.current.on(
        "connected-users",
        (connectedUsers: Array<string>) => {
          console.log("Connected users: ", connectedUsers);

          const updatedUsers = users.map((user) => {
            if (connectedUsers.includes(user.id.toString())) {
              return { ...user, isConnected: true };
            }
            return { ...user, isConnected: false };
          });

          setUsers(updatedUsers);
        },
      );

      connection.current.on("receive-message", (message: Message) => {
        console.log("Received message: ", message);
        if (selectedUser?.id === message.from) {
          setChatHistory((prev) => [...prev, message]);
        }
      });

      connection.current.on("disconnect", () => {
        console.log("Socket.IO connection closed");
      });
    };

    fetchData();

    return () => {
      // Déconnecter la WebSocket lors du démontage du composant
      if (connection.current) {
        connection.current.disconnect();
      }
    };
  }, []); // Le useEffect se déclenche uniquement si `users` ou `userId` changent

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: 2,
        bgcolor: "#f0f0f0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <Typography variant="h5">Chat</Typography>
        <Typography variant="subtitle1">
          {userLastName} {userSurname}
        </Typography>
      </Box>
      <Divider sx={{ marginBottom: 2 }} />
      <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
        <InputLabel>Choose someone to chat with</InputLabel>
        <Select
          value={selectedUser ? selectedUser.id : ""}
          onChange={handleUserSelect}
          label="Select User"
        >
          {users
            .filter((u) => u.id !== userId)
            .map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {user.isConnected && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "green",
                        marginRight: 1,
                      }}
                    />
                  )}
                  {user.lastName} {user.surName}
                </Box>
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      {selectedUser && (
        <>
          <Divider sx={{ marginY: 2 }} />
          <Box
            sx={{
              flex: 1,
              maxHeight: "300px",
              overflowY: "auto",
              bgcolor: "#ffffff",
              padding: 2,
              borderRadius: 1,
            }}
          >
            {chatHistory.length > 0 &&
              chatHistory.map((msg) => (
                <Box
                  key={String(msg.sentAt)}
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.from === userId ? "flex-end" : "flex-start",
                    marginY: 1,
                  }}
                >
                  <Box
                    sx={{
                      padding: 1,
                      borderRadius: 2,
                      bgcolor: msg.from === userId ? "#e1f5fe" : "#ffe0b2",
                      maxWidth: "70%",
                      wordWrap: "break-word",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      {msg.from}
                    </Typography>
                    <Typography variant="body1">{msg.message}</Typography>
                  </Box>
                </Box>
              ))}
            <div ref={messagesEndRef} />
          </Box>
          <Box sx={{ display: "flex", marginTop: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              inputRef={inputRef}
            />
            <IconButton onClick={handleSendMessage} color="primary">
              <SendIcon />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Chat;
