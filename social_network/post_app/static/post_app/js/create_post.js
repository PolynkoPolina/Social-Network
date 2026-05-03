const linksDiv = document.getElementById('links-list')
const postModal = document.getElementById('create-post-modal')

document.getElementById('closePage').addEventListener('click', function(){
    postModal.style.display = 'none'
})

document.getElementById('addLink').addEventListener('click', function(){
    // linksDiv.innerHTML += `
    //     <input type="url" name="links" placeholder="Додайте посилання">
    // `
    input = document.createElement('input')

    input.type = 'url'
    input.name = 'links'
    input.placeholder = 'Додайте посилання'
    
    linksDiv.appendChild(input)
})

function getCSRFToken() {
  return document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");
}

document.getElementById('create-post-form').addEventListener('submit', function(e){
    event.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    fetch(form.action, {
        method: "POST",
        headers: {
        "X-CSRFToken": getCSRFToken(),
        "X-Requested-With": "XMLHttpRequest",
        },
        body: formData,
    })
        .then(async (response) => {
            const data = await response.json()

            if (!response.ok){
                throw data;
            }
            return data  
        })
        .then((data) => {
            console.log("Пост успішно створено");
        })
        .catch((data) => {
            if (data.errors){
                console.log(data.errors);
            }
        })
})