const headerUnreadCount = document.getElementById("headerUnreadCount");
const personalUnreadCount = document.getElementById("pesronalUnreadCount");
const groupUnreadCount = document.getElementById("groupUnreadCount");


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
}

function unreadText(count) {
  if (count == 0) {
    return "";
  } else if (count > 99) {
    return '99+'
  }
  return `${count}`;
}

function setUnreadText(element, count) {
  if (element) {
    element.textContent = unreadText(count);
    element.parentElement.classList.remove('disabled')
    if (element.textContent === '') {
      element.parentElement.classList.add('disabled')
    }
  }
}

function updateChatButton(chat, page) {
  const button = document.querySelector(`[data-chat-id="${String(chat.id)}"]`);

  if (!button) {
    return;
  }

  if (chat.unread > 0 && button.querySelector('.unread-chat')) {
    button.querySelector('.unread-chat').classList.remove("disabled");
    button.querySelector('.unread-chat span').textContent = chat.unread;
  } else {
    if(button){
      button.querySelector('.unread-chat').classList.add("disabled");
      if(page == 'home'){
        button.remove()
      }
    } 
  }


  const lastMessage = button.querySelector(".last-message");
  const lastTime = button.querySelector('.last-message-time')
  if (lastMessage) {
    let text = chat.last.split("/")[0];
    if(text.length == 20) text= `${text}...`
    let time = chat.last.split("/")[1];
    lastMessage.textContent = text;
    lastTime.textContent = formatMessageTime(time);
  }
}

export function showUnreadData(data) {
  setUnreadText(headerUnreadCount, data.total);
  setUnreadText(personalUnreadCount, data.personal_total);
  setUnreadText(groupUnreadCount, data.group_total);
  let pathname= window.location.pathname
  if(pathname =='/') document.querySelector('.sidebar-messages-top').insertAdjacentHTML('beforeend',`<a href="/chat/">Дивитись всі</a>`)
  data.chats.forEach(chat => {
    if(pathname == '/chat/') updateChatButton(chat, 'chat');
    if(pathname =='/')
       updateChatButton(chat, 'home');
  })
}

