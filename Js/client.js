const socket = io("https://your-app.onrender.com");

// When connected
socket.on("connect", () => {
  console.log("Connected with ID:", socket.id);

  const name = prompt("Enter your name to join the chat:");
  socket.emit("new-user-joined", name);
});

// Append messages to the chat container
const appendMessage = (message) => {
  const messageContainer = document.getElementById("message-container");
  const messageElement = document.createElement("div");

  if (typeof message === "object") {
    // Normal chat message
    messageElement.innerText = `${message.name}: ${message.message}`;
    messageElement.className = message.name === "You" ? "msg me" : "msg other";
  } else {
    // System messages: joined/left
    messageElement.innerText = message;
    messageElement.className = "msg system";
  }

  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight; // auto scroll
};

// When a new user joins
socket.on("user-joined", (name) => {
  appendMessage(`${name} joined`);
});

// When a message is received from server
socket.on("receive", (data) => {
  console.log("aaaaaaaaaaaaaaaaa", data);

  appendMessage(data);
});

// When someone leaves
socket.on("left", (name) => {
  appendMessage(`${name} left the chat`);
});

// Sending a message
function sendMsg() {
  const msgBox = document.getElementById("inputMsg");
  const msg = msgBox.value.trim();
  if (!msg) return;

  appendMessage({ name: "You", message: msg });

  msgBox.value = "";
  socket.emit("send", msg);
}
