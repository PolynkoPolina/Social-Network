// Логіка підгрузки повідомлень
// Створюємо HTML для одного повідомлення.
let activeChatId = null;
let currentPage = 1;
let hasNext = false;
let isLoading = false;
let observer = null;
const messages = document.getElementById('messages');
const currentUser = document.getElementById('currentUser');


function renderMessage(data) {
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
  messageText.textContent = `${data.text}`;
        
        
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
  return messageContainer;
}

function resetMessages(chatId) {
  activeChatId = chatId;
  currentPage = 1;
  hasNext = true;
  isLoading = false;
  if (observer) observer.disconnect();
  messages.innerHTML = "";
  const sentinel = document.createElement("div");
  sentinel.id = "message-load-sentinel";
  messages.prepend(sentinel);
}


async function loadMessages(prepend = false) {
  if (isLoading || !hasNext) return;
  isLoading = true;
  const oldHeight = messages.scrollHeight;
  const response = await fetch(
    `/chat/${activeChatId}/messages/?page=${currentPage}`,
    {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    },
  );

  const data = await response.json();
  const fragment = document.createDocumentFragment();
  data.messages.forEach((message) =>
    fragment.appendChild(renderMessage(message)),
  );
  window.updateDateSeparators()
  const sentinel = document.querySelector("#message-load-sentinel");

  if (prepend) {
    sentinel.after(fragment);
  } else {
    messages.appendChild(fragment);
  }
  
  hasNext = data.has_next;
  currentPage++;
  if (prepend) {
    messages.scrollTop = messages.scrollHeight - oldHeight;
  } else {
    messages.scrollTop = messages.scrollHeight;
  }
  if (!hasNext && observer) observer.disconnect();
  isLoading = false;
}

function startObserver() {
  const sentinel = document.querySelector("#message-load-sentinel");
  observer = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting && isLoading == false) {
        await loadMessages(true);
      }
    },
    { root: messages, rootMargin: "20px" },
  );
  observer.observe(sentinel);
}

window.resetMessages = resetMessages;
window.renderMessage = renderMessage;
window.loadMessages = loadMessages;
window.startObserver = startObserver;