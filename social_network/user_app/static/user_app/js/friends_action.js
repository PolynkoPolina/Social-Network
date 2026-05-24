import { getCSRFToken } from "../../../../static/js/getCSRFToken.js";
import { renderErrors } from "../../../../static/js/renderErrors.js";


async function handleFriendAction(actionButton) {
  const response = await fetch(actionButton.dataset.url, {
    method: "POST",
    headers: { "X-CSRFToken": getCSRFToken() },
  });
  const data = await response.json();

 if (data.label) {
    actionButton.textContent = data.label;
  }
  if (data.remove) {
    if(actionButton.closest('.friends-card')){
      actionButton.closest('.friends-card').remove();
    }
  }
}


function connectFriendActionButtons(parent = document) {
  const actionButtons = parent.querySelectorAll(".action-btn");
  actionButtons.forEach((actionButton) => {
    if (!actionButton.dataset.eventConnected) {
      actionButton.dataset.eventConnected = true;
      actionButton.addEventListener("click", async () => {
        window.location.href = '/friends'
        await handleFriendAction(actionButton);
        });
    }
  });
}

connectFriendActionButtons();

window.connectFriendActionButtons = connectFriendActionButtons;
