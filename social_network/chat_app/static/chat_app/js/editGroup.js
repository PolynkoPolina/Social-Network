import {getCSRFToken} from '/static/js/getCSRFToken.js'


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

