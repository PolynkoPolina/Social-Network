import {getCSRFToken} from '/static/js/getCSRFToken.js'
import {renderFriends} from './friendFind.js'


const groupActionsModal = document.querySelector('.group-actions-modal');
const groupModal = document.querySelector("#edit-group-modal");
const groupStepUsers = document.querySelector("#edit-group-step-users");
const groupStepName = document.querySelector("#edit-group-step-name");
const closeGroupModalButton = document.querySelector("#close-edit-group-modal");
const closeGroupNameModalButton = document.querySelector("#close-edit-group-name-modal",);
const cancelGroupModalButton = document.querySelector("#cancel-edit-group-modal");

const nextGroupStepButton = document.querySelector("#next-edit-group-step");
const backGroupStepButton = document.querySelector("#back-edit-group-step");
const createGroupButton = document.querySelector("#create-edit-group");
const groupNameInput = document.querySelector("#edit-group-name");
const selectedCount = document.querySelector("#edit-selected-count");
const selectedUsersList = document.querySelector("#edit-selected-users-list");
const groupUserCheckboxes = document.querySelectorAll(".edit-group-user-checkbox");
const groupList = document.querySelector("#edit-group-list");
const deleteBtn = document.querySelector('.delete-user-from-edit-group');
const addMembers = document.querySelector('#addMembers')
const closeUsers = document.querySelector('#closeUsersBtn')
const nextUserStep = document.querySelector('#next-edit-group-step')

const container = document.querySelector(".edit-group-friends-container");
const friendElements = document.querySelectorAll('.edit-group-friend');
const checkboxes = document.querySelectorAll('.add-friend-checkbox')
const friends = document.querySelectorAll('.all-friends')
const editConfirm = document.querySelector('#edit-group-confirm')



export function deleteGroup(groupId, button){
 button.addEventListener('click', ()=>{
     const response = fetch(`/chat/delete_group/${groupId}/`, {
       method: "POST",
       headers: {
         "X-CSRFToken": getCSRFToken(),
       },
     })
    .then(response => response.json())
    .then(data => {
    if (data.success) {
        window.location.reload();
    }
    });
 })}

export async function leaveGroup(chatId, button) {
  button.addEventListener("click", async () => {
    const response = await fetch(
      `/chat/leave_group/${chatId}/`,
      {
        method: "POST",
        headers: {
          "X-CSRFToken": getCSRFToken(),
        },
      }
    );
    const data = await response.json();
    if (!data.success) return;

    document.querySelector(`[data-chat-id="${chatId}"]`)?.remove();
    window.location.reload();
  });
}


async function renderEditGroupModal(chatId) {
  const response = await fetch(`/chat/edit_group/${chatId}/`, {
      method: "GET"
    })
    const data = await response.json();
    if (!data.success) return;

    groupNameInput.value = data.chat_name
    const users = data.users_in_chat
    users.forEach((user) => {
      addUser(user['first_name'])
      friendElements.forEach((friend) => {
        if(user['first_name'] === friend.querySelector('span').textContent){
          friend.querySelector('.edit-group-user-checkbox').checked = true;
        }
      })
    })
}

async function sendEditGroup(chatId) {
  const formData = new FormData();
  formData.append("name", groupNameInput.value);
  groupUserCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      formData.append("users", checkbox.value);
    }
  });
  const response = await fetch(`/chat/edit_group/${chatId}/`, {
      method: "POST",
        headers: {
          "X-CSRFToken": getCSRFToken(),
        },
        body:formData
    })
    const data = await response.json();
    if (!data.success) return;
    
    window.location.reload()
}


export function openEditGroupModal(button, chatId) {
   button.addEventListener("click", ()=>{
     groupModal.classList.remove('disabled');
     groupModal.setAttribute('data-chat-id', chatId)
     groupStepUsers.classList.add('disabled');
     groupStepName.classList.remove('disabled');
     renderEditGroupModal(chatId);
    });
}


function closeEditGroupModal() {
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
    ".edit-group-user-checkbox:checked",
  ).length;
  selectedCount.textContent = count;
}

function addUser(username, checkbox =null){
  const user = document.createElement("p");
  user.textContent = username;
  const infoDiv = document.createElement('div');
  infoDiv.classList.add('info-div')
  const userDiv = document.createElement('div');
  userDiv.classList.add('user-div')
  const userImage = document.createElement('img');
  userImage.setAttribute('src', `../../../../static/icons/friends_icon3.svg`);
  const deleteImg = document.createElement('button')
  deleteImg.classList.add('delete-user-from-edit-group')
  
  deleteImg.addEventListener("click", () => {
    userDiv.remove();
    if (checkbox) checkbox.checked = false;
  })

  infoDiv.appendChild(userImage);
  infoDiv.appendChild(user);
  userDiv.appendChild(infoDiv);
  userDiv.appendChild(deleteImg);
  selectedUsersList.appendChild(userDiv);
}

function renderEditSelectedUsers() {
  selectedUsersList.innerHTML = "";
  groupUserCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      addUser(checkbox.dataset.userName, checkbox)
    }
  });
}

function showNameStep(is_saved) {
  
  renderEditSelectedUsers();
  groupStepUsers.classList.add('disabled');
  groupStepName.classList.remove('disabled');
}

function showUsersStep() {
  groupStepUsers.classList.remove('disabled');
  groupStepName.classList.add('disabled');
}


editConfirm.addEventListener('click', () => {sendEditGroup(groupModal.dataset.chatId)})

nextUserStep.addEventListener('click', showNameStep);
addMembers.addEventListener('click', showUsersStep)
closeUsers.addEventListener('click', showNameStep);
closeGroupModalButton.addEventListener("click", closeEditGroupModal);
closeGroupNameModalButton.addEventListener("click", closeEditGroupModal);
cancelGroupModalButton.addEventListener("click", closeEditGroupModal);


groupUserCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", updateSelectedCount);
});

renderFriends("", container, friendElements);

 document.querySelector('.edit-search-input').addEventListener("input", (e) => {
    renderFriends(e.target.value, container, friendElements);
});

