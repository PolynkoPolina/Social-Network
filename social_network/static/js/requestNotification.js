const requestsCount = document.getElementById('requestsCount').textContent;
const notificationsDiv = document.querySelector('.requests.notification');

if (requestsCount === "0") {
    notificationsDiv.remove();
}