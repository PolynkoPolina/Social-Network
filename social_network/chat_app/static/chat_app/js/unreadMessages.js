const headerUnreadCount = document.getElementById("headerUnreadCount");
const personalUnreadCount = document.getElementById("pesronalUnreadCount");
const groupUnreadCount = document.getElementById("groupUnreadCount");


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

function updateChatButton(chat) {
  const button = document.querySelector(`[data-chat-id="${String(chat.id)}"]`);
  if (!button) {
    return;
  }

  const lastMessage = button.querySelector(".last-message");
  if (lastMessage) {
    lastMessage.textContent = chat.last;
  }

  if (chat.unread > 0) {
    button.classList.add("chat-has-unread");
  } else {
    button.classList.remove("chat-has-unread");
  }
}

export function showUnreadData(data) {
  setUnreadText(headerUnreadCount, data.total);
  setUnreadText(personalUnreadCount, data.personal_total);
  setUnreadText(groupUnreadCount, data.group_total);
  data.chats.forEach(chat => {
    updateChatButton(chat);
  })
}

