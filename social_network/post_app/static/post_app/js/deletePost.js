import { renderErrors } from "../../../../static/js/renderErrors.js"
import { getCSRFToken } from "../../../../static/js/getCSRFToken.js"

const deletePostButton = document.querySelectorAll(".delete-post-button");
const modalWindow = document.getElementById('edit-delete-post-container');
let currentPostId = null;


document.querySelectorAll('.edit-post').forEach(button => {
    button.addEventListener('click', () => {
        modalWindow.classList.toggle('disabled')
        currentPostId = button.dataset.postId;
    });
});



deletePostButton.forEach(button => {
    button.addEventListener("click", (event) => {
        fetch(`/posts/delete_post/${currentPostId}`, {
            method: "POST",
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': getCSRFToken()
            }
        })

        .then((response) => {
            const data = response.json();
            if (!response.ok) {
                throw data;
            }
            return data;
        })
        .then((data) => {
            if (data.redirect_url) {
                window.location.href = data.redirect_url;
            }
        })
        .catch((data) => {
            if (data.errors){
                renderErrors("create-errors", data.errors)
            }
        })
    });
});