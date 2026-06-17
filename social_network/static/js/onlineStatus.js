const onlineSocket = new WebSocket(`ws://${window.location.host}/users/online/`);


onlineSocket.onmessage = function (event) {
  const data = JSON.parse(event.data);

  const avatars = document.querySelectorAll(`.user-avatar[data-user-id="${data.user_id}"]`);

  avatars.forEach(avatar => {
    const statusDiv = avatar.querySelector('.status');
    if (!statusDiv) return;

    statusDiv.classList.remove('online', 'offline');
    statusDiv.classList.add(data.status);
  });
}