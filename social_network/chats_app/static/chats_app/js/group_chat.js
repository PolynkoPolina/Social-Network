import {getCSRFToken} from '/static/js/getCSRFToken.js'

const openGroupModalButton = document.querySelector("#open-group-modal");
const groupModal = document.querySelector("#group-modal");
const groupStepUsers = document.querySelector("#group-step-users");
const groupStepName = document.querySelector("#group-step-name");
const closeGroupModalButton = document.querySelector("#close-group-modal");
const closeGroupNameModalButton = document.querySelector("#close-group-name-modal");
const cancelGroupModalButton = document.querySelector("#cancel-group-modal");
const nextGroupStepButton = document.querySelector("#next-group-step");
const backGroupStepButton = document.querySelector("#back-group-step");
const createGroupButton = document.querySelector("#create-group");
const groupNameInput = document.querySelector("#group-name");
const selectedCount = document.querySelector("#selected-count");
const selectedUsersList = document.querySelector("#selected-users-list");
const groupUserCheckboxes = document.querySelectorAll(".group-user-checkbox");
const groupList = document.querySelector("#group-list");




function openGroupModal() {
  groupModal.hidden = false;
  groupStepUsers.hidden = false;
  groupStepName.hidden = true;
}

function closeGroupModal() {
    groupModal.hidden = true;
    groupNameInput.value = "";
    selectedUsersList.innerHTML = "";
    groupUserCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
}

function updateSelectedCount() {
  const count = document.querySelectorAll(
    ".group-user-checkbox:checked",
  ).length;
  selectedCount.textContent = count;
}

function renderSelectedUsers() {
  selectedUsersList.innerHTML = "";
  groupUserCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const user = document.createElement("p");
      user.textContent = checkbox.dataset.userName;
      selectedUsersList.appendChild(user);
    }
  });
}

function showNameStep() {
  renderSelectedUsers();
  groupStepUsers.hidden = true;
  groupStepName.hidden = false;
}

function showUsersStep() {
  groupStepUsers.hidden = false;
  groupStepName.hidden = true;
}

function addGroupButton(chatId, groupName) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "chat-group-button";
  button.dataset.chatId = chatId;
  button.dataset.chatTitle = groupName;
  button.textContent = groupName;
  groupList.appendChild(button);
  window.bindGroupChatButtons();

}

async function createGroup() {
  const formData = new FormData();
  formData.append("name", groupNameInput.value);
  groupUserCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      formData.append("users", checkbox.value);
    }
  });

  const response = await fetch("/chat/create_group/", {
    method: "POST",
    headers: {
         "X-CSRFToken": getCSRFToken()
        },
    body: formData,
  });

  const data = await response.json();

  if (data.success) {
    addGroupButton(data.chat_id, data.name);
    closeGroupModal();
  }
}


openGroupModalButton.addEventListener("click", openGroupModal);
nextGroupStepButton.addEventListener("click", showNameStep);
closeGroupModalButton.addEventListener("click", closeGroupModal);
closeGroupNameModalButton.addEventListener("click", closeGroupModal);
backGroupStepButton.addEventListener("click", showUsersStep);
createGroupButton.addEventListener("click", createGroup);

groupUserCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", updateSelectedCount)
});
