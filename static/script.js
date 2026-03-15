const chatContainer = document.getElementById("chat");
const inputEl = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");

function resetChat() {
  chatContainer.innerHTML = "";
  chatContainer.appendChild(createMessage("Hi there! Send a message to get started.", "system"));
  inputEl.focus();
}

function createMessage(content, role) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.textContent = content;
  return div;
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function setLoading(loading) {
  inputEl.disabled = loading;
  sendBtn.disabled = loading;
  sendBtn.textContent = loading ? "Thinking..." : "Send";
}

async function sendMessage() {
  const message = inputEl.value.trim();
  if (!message) return;

  chatContainer.appendChild(createMessage(message, "user"));
  scrollToBottom();

  inputEl.value = "";
  setLoading(true);

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      throw new Error(`Server error (${res.status})`);
    }

    const data = await res.json();

    chatContainer.appendChild(createMessage(data.reply, "bot"));
    scrollToBottom();
  } catch (error) {
    chatContainer.appendChild(
      createMessage(`Error: ${error.message || error}`, "bot")
    );
    scrollToBottom();
  } finally {
    setLoading(false);
    inputEl.focus();
  }
}

sendBtn.addEventListener("click", sendMessage);
inputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

// Keep focus on input when clicking anywhere outside the composer
window.addEventListener("click", (event) => {
  if (!event.target.closest(".composer")) {
    inputEl.focus();
  }
});

// Reset chat (new conversation)
if (newChatBtn) {
  newChatBtn.addEventListener("click", () => {
    resetChat();
  });
}
