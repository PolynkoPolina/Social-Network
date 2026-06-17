import {getCSRFToken} from '/static/js/getCSRFToken.js'
import {activeChatId} from './chatHistory.js'

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
const latestMessages = document.querySelectorAll('.latest-message');
const latestMessagesTimes = document.querySelectorAll('.latest-message-time');


latestMessages.forEach(message=>{
  let messageTextArray = message.dataset.messageText.split(',');
  let messageText = messageTextArray[messageTextArray.length - 2];
  if (String(messageText).length >= 25){
    messageText = messageText.substring(0, 25) + "...";
  }

  message.textContent = messageText;
})

latestMessagesTimes.forEach(time =>{
  let messageTimeArray = time.dataset.messageTime.split(',');
  let messageTime = messageTimeArray[messageTimeArray.length - 2];
  let messageTimeFormat = messageTime
  if(messageTime){
    messageTimeFormat = messageTime.split(" ")[1];
  }
  time.textContent = messageTimeFormat;
})

const allMonths=['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня']

const users_text = {
    'one': 'учасник',
    'three-four': 'учасники',
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
  if (users_count == 1){
    chatUsers.textContent = `${users_count} ${ users_text['one']}`
  } else if (users_count> 2 && users_count<= 4){
    chatUsers.textContent = `${users_count} ${users_text['three-four']}`
  } else if (users_count== 2){
    chatUsers.textContent = "у мережі";
  } else{
    chatUsers.textContent = `${users_count} ${users_text['five-plus']}`
  }

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
      let users_count =  button.dataset.chatUsers.split(' ').length - 1
      openChatById(button.dataset.chatId, button.dataset.chatTitle, users_count);
      const openedChat = document.querySelector('.opened-chat');
      if( openedChat){
        openedChat.classList.remove('opened-chat');
      }
      const openedGroup= document.querySelector('.opened-group');
      if( openedGroup){
        openedGroup.classList.remove('opened-group');
      }
      button.classList.add('opened-group');
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
      window.renderMessage(data)
    };

    if (data.action === "message_read") {
    const message = document.querySelector(
      `[data-message-id="${data.id}"]`
    );

    if (!message) return;

    message.querySelector('.message-reader').classList.add("read-message");
  }
}};



function disconnectWebSocket() {
    if (chatSocket) {
        chatSocket.onmessage = null;
        chatSocket.onerror = null;
        chatSocket.onclose = null;
        
        chatSocket.close();
        chatSocket = null;
    }
}

chatButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    await openChatWithUser(
      button.dataset.chatUser,
      button.dataset.chatUsername,
    );
    const openedGroup= document.querySelector('.opened-group');
    if( openedGroup){
      openedGroup.classList.remove('opened-group');
    }
    const openedChat = document.querySelector('.opened-chat');
    if( openedChat){
      openedChat.classList.remove('opened-chat');
    }
    button.classList.add('opened-chat');
  });
});

messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const messageText = messageInput.value.trim();

  if (!messageText && !window.hasSelectedImages()) return;

  if (window.hasSelectedImages()) {
    const data = await window.sendMessageWithImages(messageText);

    if (!data.success) return;

    messageInput.value = "";
    window.clearSelectedImages();
    return;
  }

  if (messageText && chatSocket && chatSocket.readyState === WebSocket.OPEN) {
    chatSocket.send(JSON.stringify({ messageText }));
    messageInput.value = "";
  }
});

chatExitBtn.addEventListener('click', () => {
    chatWindow.classList.remove("is-open");
    beforeChat.classList.remove('disabled');
    disconnectWebSocket();
    const button = document.querySelector('.opened-chat')
    button.classList.remove('opened-chat')
});
