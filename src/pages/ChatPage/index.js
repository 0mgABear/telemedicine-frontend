import { io } from "socket.io-client";

const socket = io("https://localhost:3000");

export default function ChatPage() {
  return <div>this is chat page</div>;
}
