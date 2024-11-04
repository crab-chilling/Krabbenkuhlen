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

const initialMessages: { [key: number]: Message[] } = {
  1: [
    {
      id: 1,
      senderId: 1,
      receiverId: 2,
      writtenAt: new Date(),
      text: "Hello Alice!",
    },
    {
      id: 2,
      senderId: 2,
      receiverId: 1,
      writtenAt: new Date(),
      text: "How are you?",
    },
  ],
  2: [
    {
      id: 3,
      senderId: 2,
      receiverId: 1,
      writtenAt: new Date(),
      text: "Hi Bob!",
    },
    {
      id: 4,
      senderId: 1,
      receiverId: 2,
      writtenAt: new Date(),
      text: "Are you free to talk?",
    },
  ],
  3: [
    {
      id: 5,
      senderId: 3,
      receiverId: 1,
      writtenAt: new Date(),
      text: "Hey Charlie!",
    },
    {
      id: 6,
      senderId: 1,
      receiverId: 3,
      writtenAt: new Date(),
      text: "Let's catch up!",
    },
  ],
};

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

  const fetchUsers = async () => {
    try {
      const users = await fetchAllUsers();
      setUsers(users);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserSelect = (event: SelectChangeEvent<number>) => {
    // TODO: call the API: getHistory()
    const id = event.target.value as number;
    const user = users.find((u) => u.id === id);
    setSelectedUser(user || null);
    const messages =
      user && initialMessages[user.id] ? initialMessages[user.id] : [];
    setChatHistory(messages);
  };

  const handleSendMessage = () => {
    // TODO: call the API: sendMessage()
    if (newMessage.trim() && selectedUser) {
      const message: Message = {
        id: Date.now(),
        senderId: userId,
        receiverId: selectedUser.id,
        writtenAt: new Date(),
        text: newMessage,
      };
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
    if (users.length === 0) fetchUsers();
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, users]);

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
          value={selectedUser?.id || ""}
          onChange={handleUserSelect}
          label="Select User"
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.lastName} {user.surName}
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
                  key={msg.id}
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.senderId === userId ? "flex-end" : "flex-start",
                    marginY: 1,
                  }}
                >
                  <Box
                    sx={{
                      padding: 1,
                      borderRadius: 2,
                      bgcolor: msg.senderId === userId ? "#e1f5fe" : "#ffe0b2",
                      maxWidth: "70%",
                      wordWrap: "break-word",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      {msg.senderId}
                    </Typography>
                    <Typography variant="body1">{msg.text}</Typography>
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
