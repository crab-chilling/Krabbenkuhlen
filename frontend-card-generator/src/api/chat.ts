import { Message } from "../types/chat";

export const getHistory = async (from: number, to: number) => {
  const url = new URL(import.meta.env.VITE_APP_API_URL + "/message");
  url.searchParams.append("from", from.toString());
  url.searchParams.append("to", to.toString());

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
  const response = await fetch(import.meta.env.VITE_APP_API_URL + "/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  const data = await response.json();
  return data;
};
