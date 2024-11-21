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
  const ALL_USERS_ID: number = 999;

  const userId = useSelector(selectUserId);
  const userLastName = useSelector(selectUserLastName);
  const userSurname = useSelector(selectUserSurname);

  const [users, setUsers] = useState<Array<User>>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [haveUsersBeenLoaded, setHaveUsersBeenLoaded] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const connection = useRef<Socket | null>(null);

  const fetchUsers = async () => {
    setHaveUsersBeenLoaded(false);
    try {
      const response: Array<User> = await fetchAllUsers();
      const filteredUsers = response.filter((user) => user.id !== userId);

      const allUsersOption: User = {
        id: ALL_USERS_ID,
        login: "",
        lastName: "All users",
        surName: "",
        email: "",
        account: 0,
        cardList: [],
      };

      setUsers([{ ...allUsersOption }, ...filteredUsers]);
    } catch (error) {
      console.error(error);
    } finally {
      setHaveUsersBeenLoaded(true);
    }
  };

  const getUsernameById = (id: number) => {
    if (id === userId) {
      return `${userSurname} ${userLastName}`;
    }

    const user = users.find((u) => u.id === id);
    if (user) {
      return `${user.surName} ${user.lastName}`;
    }

    return `User${id}`;
  };

  const fetchChatHistory = async (from: number, to: number) => {
    setIsLoadingMessages(true);
    try {
      setChatHistory(await getHistory(from, to));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendSocketMessage = (message: Message) => {
    if (connection.current) {
      connection.current.emit("send-message", message);
    }
  };

  const handleUserSelect = (event: SelectChangeEvent<number>) => {
    const id = event.target.value as number;
    const user = users.find((u) => u.id === id);
    setNewMessage("");
    setSelectedUser(user || null);
    setChatHistory([]);
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
    if (
      selectedUser?.id === message.from ||
      (message.to === ALL_USERS_ID && selectedUser?.id === ALL_USERS_ID)
    ) {
      setChatHistory((prev) => [...prev, message]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!haveUsersBeenLoaded) return;

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
  }, [haveUsersBeenLoaded]);

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
          As: {userLastName} {userSurname} (id: {userId})
        </Typography>
      </Box>
      <Divider sx={{ marginBottom: 2 }} />
      {!haveUsersBeenLoaded ? (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
          <InputLabel>Chat with</InputLabel>
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
                  {user.id !== ALL_USERS_ID && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: user.isConnected ? "green" : "red",
                        marginRight: 1,
                      }}
                    />
                  )}
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
                      {getUsernameById(msg.from)}
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
