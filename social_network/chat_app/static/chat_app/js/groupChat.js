import {getCSRFToken} from '/static/js/getCSRFToken.js'

const openGroupModalButton = document.querySelector("#open-group-modal");
const groupModal = document.querySelector("#group-modal");
const groupStepUsers = document.querySelector("#group-step-users");
const groupStepName = document.querySelector("#group-step-name");
const closeGroupModalButton = document.querySelector("#close-group-modal");
const closeGroupNameModalButton = document.querySelector("#close-group-name-modal",);
const cancelGroupModalButton = document.querySelector("#cancel-group-modal");

const nextGroupStepButton = document.querySelector("#next-group-step");
const backGroupStepButton = document.querySelector("#back-group-step");
const createGroupButton = document.querySelector("#create-group");
const groupNameInput = document.querySelector("#group-name");
const selectedCount = document.querySelector("#selected-count");
const selectedUsersList = document.querySelector("#selected-users-list");
const groupUserCheckboxes = document.querySelectorAll(".group-user-checkbox");
const groupList = document.querySelector("#group-list");
const deleteBtn = document.querySelector('.delete-user-from-group');
const editGroupBtn = document.querySelectorAll('.chat-actions');
const editModal = document.querySelector('.edit-group-div');



  editGroupBtn.forEach(button =>
    button.addEventListener('click', () => {
      editModal.classList.toggle('disabled');
    })
  );
  
  document.addEventListener('click', (element) => {
    const isClickInsideModal = editModal.contains(element.target);
    const isButton = [...editGroupBtn].some(btn => btn.contains(element.target));
  
    if (!isClickInsideModal && !isButton) {
      editModal.classList.add('disabled');
    }
  });


function openGroupModal() {
  groupModal.classList.remove('disabled');
  groupStepUsers.classList.remove('disabled');
  groupStepName.classList.add('disabled');
}

function closeGroupModal() {
  groupModal.classList.add('disabled');
  groupNameInput.value = "";
  selectedUsersList.innerHTML = "";
  groupUserCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  updateSelectedCount();
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

      const infoDiv = document.createElement('div');
      infoDiv.classList.add('info-div')
      const userDiv = document.createElement('div');
      userDiv.classList.add('user-div')

      const userImage = document.createElement('img');
      userImage.setAttribute('src', `../../../../static/icons/friends_icon3.svg`);

      const deleteImg = document.createElement('button')
      deleteImg.classList.add('delete-user-from-group')
      
      deleteImg.addEventListener("click", () => {
        userDiv.remove();
        checkbox.checked = false;
      })

      infoDiv.appendChild(userImage);
      infoDiv.appendChild(user);
      userDiv.appendChild(infoDiv);
      userDiv.appendChild(deleteImg);
      selectedUsersList.appendChild(userDiv);
    }
  });
}

function showNameStep() {
  renderSelectedUsers();
  groupStepUsers.classList.add('disabled');
  groupStepName.classList.remove('disabled');
}

function showUsersStep() {
  groupStepUsers.classList.remove('disabled');
  groupStepName.classList.add('disabled');
}

function addGroupButton(chatId, groupName) {
  const groupEmpty = document.querySelector("#group-empty");
  if (groupEmpty) {
    groupEmpty.remove();
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "chat-group-button group-div group-chat";
  button.dataset.chatId = chatId;
  button.dataset.chatTitle = groupName;

  const groupImg = document.createElement("image");
  groupImg.setAttribute('src', `../../../../static/icons/offline_user.svg`);
  groupImg.setAttribute('style', 'height: 4vh; width: 4vh')
  const groupInfo = document.createElement("div");
  groupInfo.classList.add('group-info');
  
  const groupInfoDiv = document.createElement("div");
  const groupTitle = document.createElement("p");
  groupTitle.textContent = groupName;

  button.appendChild(groupImg);
  groupInfoDiv.appendChild(groupTitle);
  groupInfo.appendChild(groupInfoDiv);
  button.appendChild(groupInfo);
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
    headers: { "X-CSRFToken": getCSRFToken() },
    body: formData,
  });

  const data = await response.json();

  if (data.success) {
    addGroupButton(data.chat_id, data.name);
    closeGroupModal();
  }
}

openGroupModalButton.addEventListener("click", openGroupModal);
closeGroupModalButton.addEventListener("click", closeGroupModal);
closeGroupNameModalButton.addEventListener("click", closeGroupModal);
cancelGroupModalButton.addEventListener("click", closeGroupModal);
nextGroupStepButton.addEventListener("click", showNameStep);
backGroupStepButton.addEventListener("click", showUsersStep);
createGroupButton.addEventListener("click", createGroup);

groupUserCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", updateSelectedCount);
});

