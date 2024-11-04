import { Message } from "../types/chat";

export const getHistory = async (senderId: number, receiverId: number) => {
  const url = new URL(import.meta.env.VITE_APP_API_URL + "/chat/history");
  url.searchParams.append("senderId", senderId.toString());
  url.searchParams.append("receiverId", receiverId.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("An error occurred while fetching data");

  const data = await response.json();
  return data;
};

export const sendMessage = async (message: Message) => {
  const response = await fetch(
    import.meta.env.VITE_APP_API_URL + "/chat/send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    },
  );

  const data = await response.json();
  return data;
};
