import {getCSRFToken} from '/static/js/getCSRFToken.js'

let chatSocket = null;
let senderAvatar = null;
const chatName = document.getElementById('chatName');
const chatButtons = document.querySelectorAll(".chat-user-button");
const chatWindow = document.getElementById("chatWindow");
const messages = document.getElementById("messages");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const chatExitBtn = document.getElementById('chatExit');
const currentUser = document.getElementById('currentUser');
const beforeChat = document.getElementById('beforeChat');

const allMonths=['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня']

const users_text = {
    'one': 'учасник',
    'two-four': 'учасника',
    'five-plus': "учасників"
}

function formatMessageMonth(month){
  return allMonths[month]
}

function padDateNumber(number) {
  return String(number).padStart(2, "0");
}

function getMessageDate(createdAt) {
  if (!createdAt) {
    return new Date();
  }
  return new Date(createdAt);
}

function formatMessageTime(createdAt) {
  const date = getMessageDate(createdAt);
  return `${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`;
} // -> 12:05

window.formatMessageTime = formatMessageTime;

function formatMessageDate(createdAt) {
  const date = getMessageDate(createdAt);
  const messageMonth =date.getMonth();
  return `${padDateNumber(date.getDate())} ${formatMessageMonth(messageMonth)} ${padDateNumber(date.getFullYear())}`;
} // -> 07.06.2026

window.formatMessageDate = formatMessageDate;

function renderDateSeparator(dateText) {
  const separator = document.createElement("div");
  separator.classList.add("message-date-separator");
  separator.textContent = dateText;
  return separator;
}

function updateDateSeparators() {
  const dateSeparators = document.querySelectorAll(".message-date-separator");
  dateSeparators.forEach((separator) => {
    separator.remove();
  });

  let previousDate = "";
  const allMessages = document.querySelectorAll(".message");

  allMessages.forEach((message) => {
    const messageDate = message.dataset.messageDate;
    if (messageDate !== previousDate) {
      message.parentElement.before(renderDateSeparator(messageDate));
      previousDate = messageDate;
    }
  });
}

window.updateDateSeparators = updateDateSeparators;

async function openChatById(chatId, title, users_count) {
  chatWindow.classList.add("is-open");
  beforeChat.classList.add('disabled');
  messages.innerHTML = "";
  chatName.textContent = `${title}`
  let chat_users_text = ''
  if (users_count == 1){
      chat_users_text = users_text['one']
  } else if (users_count>= 2 && users_count<= 4){
      chat_users_text = users_text['two-four']
  } else{
      chat_users_text = users_text['five-plus']
  }

  chatUsers.textContent = `${users_count} ${chat_users_text}`
  connectWebsocket(chatId);
  resetMessages(chatId);
  await loadMessages();
  startObserver();
}

async function openChatWithUser(chatId, username) {
  const response = await fetch(`/chat/chat_with/${chatId}/`, {
    method: "POST",
    headers: { "X-CSRFToken": getCSRFToken() },
  });
  const data = await response.json();
  if (data.success) {
    openChatById(data.chat_id, username, data.users_count);
  }
}

function bindGroupChatButtons() {
  const groupButtons = document.querySelectorAll(".chat-group-button");

  groupButtons.forEach((button) => {
    if (button.dataset.groupBound == "true") return;

    button.dataset.groupBound = "true";
    button.addEventListener("click", () => {
      let users =  button.dataset.chatUsers
      openChatById(button.dataset.chatId, button.dataset.chatTitle, users.split(' '));
    });
  });
}

bindGroupChatButtons();
window.openChatById = openChatById;
window.bindGroupChatButtons = bindGroupChatButtons;

function connectWebsocket(chatId) {
  if (chatSocket) {
    chatSocket.close();
  }

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  chatSocket = new WebSocket(
    `${protocol}://${window.location.host}/chat/${chatId}/`,
  );
  chatSocket.onmessage = function (event) {
    let data = JSON.parse(event.data);
    if (data.action == 'chat_message'){
            const messageContainer =  document.createElement("div");
            messageContainer.classList.add('message-container');

            const messageElement = document.createElement("div");
            messageElement.classList.add("message");
            messageElement.dataset.messageDate = formatMessageDate(data.created_at);
            
            if (data.sender === currentUser.textContent.trim()){
                messageElement.classList.add('your-message');
                messageContainer.classList.add('your-message-container');
            }
            
            const messageInfo =  document.createElement("div");
            messageInfo.classList.add('message-info');
            
            const messageText = document.createElement("p");
            messageText.classList.add('message-text');
            messageText.textContent = `${data.message_text}`;
            
            

            if (!messageElement.classList.contains('your-message')){
                const senderName = document.createElement("div");
                senderName.classList.add('sender-name');
                senderName.textContent = `${data.sender}`
                messageInfo.appendChild(senderName);
                senderAvatar = document.createElement("div");
                senderAvatar.classList.add('sender-avatar');
                const senderImg = document.createElement("img");
                senderImg.classList.add("sender-img");
                senderImg.setAttribute('src', `${data.sender_avatar}`);
                senderAvatar.appendChild(senderImg);
                messageContainer.appendChild(senderAvatar)
            }

            const messageTime =  document.createElement("div");
            messageTime.classList.add('message-time');
            messageTime.textContent = formatMessageTime(data.created_at);
        

            messageInfo.appendChild(messageText);
            messageElement.appendChild(messageInfo);
            messageElement.appendChild(messageTime);
            messageContainer.appendChild(messageElement);
            messages.appendChild(messageContainer);
      }
    window.updateDateSeparators()
  };
}

chatButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    await openChatWithUser(
      button.dataset.chatUser,
      button.dataset.chatUsername,
    );
  });
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const messageText = messageInput.value.trim();
  if (messageText && chatSocket && chatSocket.readyState === WebSocket.OPEN) {
    chatSocket.send(JSON.stringify({ messageText: messageText }));
    messageInput.value = "";
  }
});

chatExitBtn.addEventListener('click', () => {
    chatWindow.classList.remove("is-open");
    beforeChat.classList.remove('disabled');
   disconnectWebSocket();
});
