requestsCount = document.getElementById('requestsCount').textContent;
notificationsDiv = document.querySelector('.requests.notification');

if (requestsCount === "0") {
    notificationsDiv.remove();
}