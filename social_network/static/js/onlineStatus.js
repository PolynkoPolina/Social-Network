const onlineSocket = new WebSocket(`ws://${window.location.host}/users/online/`);

onlineSocket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  const userAvatars = document.querySelectorAll('.user-avatar');
  userAvatars.forEach((avatar) => {
    const oldStatus = avatar.parentElement.querySelector('.online, .offline');
    if (oldStatus) oldStatus.remove();
    let statusDiv = avatar.parentElement.querySelector('.status');

    if (!statusDiv) {
      statusDiv = document.createElement('div');
      statusDiv.classList.add('status');
      avatar.parentElement.appendChild(statusDiv);
    }

    statusDiv.classList.remove('online', 'offline');
    statusDiv.classList.add(data.status);
  });
};
