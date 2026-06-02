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
            const dateSource = data.timestamp ? new Date(data.timestamp) : new Date();
            messageTime.textContent = dateSource.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        

            messageInfo.appendChild(messageText);
            messageElement.appendChild(messageInfo);
            messageElement.appendChild(messageTime);
            messageContainer.appendChild(messageElement);
            messages.appendChild(messageContainer);
        }
        
    };
}

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
    if (!data.success) {
        return
    }
    chatWindow.classList.add("is-open");
    beforeChat.classList.add('disabled');
    messages.innerHTML = "";
    chatName.textContent = `${data.username || username}`
    
    if (data.users_count == 1){
        chat_users_text = users_text['one']
    } else if (data.users_count>= 2 && data.users_count<= 4){
        chat_users_text = users_text['two-four']
    } else{
        chat_users_text = users_text['five-plus']
    }

    chatUsers.textContent = `${data.users_count} ${chat_users_text}`
    connectWebSocket(data.chat_id); 
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