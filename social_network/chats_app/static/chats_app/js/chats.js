import {getCSRFToken} from '/static/js/getCSRFToken.js'


let chatSocket = null;
let chat_users_text ='';
const chatName = document.getElementById('chatName');
const chatUsers = document.getElementById('chatUsers');
const beforeChat = document.getElementById('beforeChat');
const chatButtons = document.querySelectorAll("[data-chat-user]");
const chatWindow = document.getElementById("chatWindow");
const messages = document.getElementById("messages");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const chatExitBtn = document.getElementById('chatExit');
const currentUser = document.getElementById('currentUser')

const users_text = {
    'one': 'учасник',
    'two-four': 'учасника',
    'five-plus': "учасників"
}

function padDateNumber(num){
    return String(num).padStart(2, "0");
}

function getMessageDate(createdAt){
    return new Date(createdAt);
}

function formatMessageTime(createdAt){
    const date = getMessageDate(createdAt);
    return `${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`;
}

function formatMessageDate(createdAt){
    const date = getMessageDate(createdAt);
    return `${padDateNumber(date.getDate())}.${padDateNumber(date.getMonth()+1)}.${padDateNumber(date.getFullYear())}`;
}
window.formatMessageDate = formatMessageDate;

function renderDateSeparator(dateText){
    const separator = document.createElement("div");
    separator.classList.add('.message-date-separator');
    separator.textContent = dateText;
    return separator;
}

function updateDateSeparators(){
    const dateSeparators = document.querySelectorAll('.message-date-separator');
    dateSeparators.forEach((separator)=>{
        separator.remove();
    });
    let previousDate = '';
    const allMessages = document.querySelectorAll('.message');
    allMessages.forEach((message)=>{
        const messageDate = message.dataset.messageDate;
        if(messageDate !== previousDate){
            message.before(renderDateSeparator(messageDate));
            previousDate = messageDate;
        }
    })
}

window.updateDateSeparators = updateDateSeparators;

function connectWebSocket(chatId) {
    
    disconnectWebSocket();

    chatSocket = new WebSocket(`ws://${window.location.host}/chats/${chatId}/`);
    chatSocket.onmessage = function (event){
        const data = JSON.parse(event.data);
        if (data.action == 'chat_message'){
            const messageContainer =  document.createElement("div");
            messageContainer.classList.add('message-container');

            const messageElement = document.createElement("div");
            messageElement.classList.add("message");

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
        updateDateSeparators()
        
    };
}

function openChatById(chatId, title) {
    chatWindow.classList.add("is-open");
    beforeChat.classList.add('disabled');
    messages.innerHTML = "";
    chatName.textContent = `${title}`
    
    // if (data.users_count == 1){
    //     chat_users_text = users_text['one']
    // } else if (data.users_count>= 2 && data.users_count<= 4){
    //     chat_users_text = users_text['two-four']
    // } else{
    //     chat_users_text = users_text['five-plus']
    // }

    // chatUsers.textContent = `${data.users_count} ${chat_users_text}`
    connectWebSocket(chatId);
}

function bindGroupChatButtons() {
  const groupButtons = document.querySelectorAll(".chat-group-button");
  groupButtons.forEach((button) => {
    if (button.dataset.groupBound == "true") return;

    button.dataset.groupBound = "true";
    button.addEventListener("click", () => {
      openChatById(button.dataset.chatId, button.dataset.chatTitle);
    });
  });
}

bindGroupChatButtons();
window.openChatById = openChatById;
window.bindGroupChatButtons = bindGroupChatButtons;

async function openChatWithUser(userId, username) {
    const response = await fetch(
        `/chats/chat_with/${userId}/`,
        {
            method: "POST",
            headers: {
                "X-CSRFToken": getCSRFToken()
            }
        }
    );
    const data = await response.json();

    if (data.success) {
        openChatById(data.chat_id, username);
    }
    
}


chatExitBtn.addEventListener('click', () => {
    chatWindow.classList.remove("is-open");
    beforeChat.classList.remove('disabled');
   disconnectWebSocket();
});


chatButtons.forEach((button) => {
    button.addEventListener(
        "click",
        async function() {
            await openChatWithUser(button.dataset.chatUser, button.dataset.chatUsername)
        }
    )
})


messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const messageText = messageInput.value.trim()
  if (messageText){
    chatSocket.send(JSON.stringify({messageText: messageText}));
    messageInput.value = '';
  }
});


function disconnectWebSocket() {
    if (chatSocket) {
        chatSocket.onmessage = null;
        chatSocket.onerror = null;
        chatSocket.onclose = null;
        
        chatSocket.close();
        chatSocket = null;
    }
}