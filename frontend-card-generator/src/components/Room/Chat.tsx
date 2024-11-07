import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { selectUserId } from "../../store/selectors/user.selectors";
import { selectUserLastName } from "../../store/selectors/user.selectors";
import { selectUserSurname } from "../../store/selectors/user.selectors";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { Message } from "../../types/chat";
import { User } from "../../types/user";
import { fetchAllUsers } from "../../api/user";
import { io, Socket } from "socket.io-client";
import CircularProgress from "@mui/material/CircularProgress";
import { getHistory } from "../../api/chat";

const Chat: React.FC = () => {
  const userId = useSelector(selectUserId);
  const userLastName = useSelector(selectUserLastName);
  const userSurname = useSelector(selectUserSurname);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const connection = useRef<Socket | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoaded(false);
      const response: Array<User> = await fetchAllUsers();
      const filteredUsers = response.filter((u) => u.id !== userId);
      setUsers(filteredUsers);
      if (filteredUsers.length > 0) {
        setSelectedUser(filteredUsers[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoaded(true);
    }
  };

  const fetchChatHistory = async (from: number, to: number) => {
    try {
      setIsLoadingMessages(true);
      setChatHistory(await getHistory(from, to));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMessages(true);
    }
  };

  const sendSocketMessage = (message: Message) => {
    if (connection.current) {
      connection.current.emit("send-message", message);
    }
  };

  const handleUserSelect = async (event: SelectChangeEvent<number>) => {
    setNewMessage("");
    const id = event.target.value as number;
    const user = users.find((u) => u.id === id);
    setSelectedUser(user || null);
    if (user) fetchChatHistory(user.id, userId);
  };

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

  const onConnectedUsersUpdate = (users: Array<string>) => {
    console.log("Connected users: ", users);
    setUsers((prevUsers) => {
      return prevUsers.map((user) => {
        return {
          ...user,
          isConnected: users.includes(user.id.toString()) ? true : false,
        };
      });
    });
  };

  const onMessageReceive = (message: Message) => {
    console.log("Received message: ", message);
    if (selectedUser?.id === message.from) {
      setChatHistory((prev) => [...prev, message]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    connection.current = io("http://localhost:3000", {
      query: { userId: userId },
    });

    connection.current.on("connect", () => {
      console.log("Socket.IO connection established");
    });

    connection.current.on("connected-users", (users: Array<string>) => {
      onConnectedUsersUpdate(users);
    });

    connection.current.on("receive-message", (message: Message) => {
      onMessageReceive(message);
    });

    connection.current.on("disconnect", () => {
      console.log("Socket.IO connection closed");
    });

    return () => {
      if (connection.current) {
        connection.current.disconnect();
      }
    };
  }, [isLoaded]);

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
          {userLastName} {userSurname} (id: {userId})
        </Typography>
      </Box>
      <Divider sx={{ marginBottom: 2 }} />
      {!isLoaded ? (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
          <InputLabel>Choose someone to chat with</InputLabel>
          <Select
            value={
              selectedUser && users.some((user) => user.id === selectedUser.id)
                ? selectedUser.id
                : ""
            }
            onChange={handleUserSelect}
            label="Select User"
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: user.isConnected ? "green" : "red",
                      marginRight: 1,
                    }}
                  />
                  {user.lastName} {user.surName} (id: {user.id})
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

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
            {isLoadingMessages ? (
              <Box
                sx={{ display: "flex", justifyContent: "center", padding: 2 }}
              >
                <CircularProgress />
              </Box>
            ) : (
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
              ))
            )}
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
