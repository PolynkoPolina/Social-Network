import {showUnreadData} from '/static/chat_app/js/unreadMessages.js'

const unreadSocket = new WebSocket(`ws://${window.location.host}/chat/unread/`);


unreadSocket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  showUnreadData(data);
};

export function updateUnreadData() {
  unreadSocket.send("{}");
}
