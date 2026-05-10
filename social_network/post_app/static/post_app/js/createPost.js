const linksDiv = document.getElementById('links-list')
const postModal = document.getElementById('create-post-modal')
const imageDiv = document.getElementById('image-container');
const addLink = document.getElementById('addLink');
const addImage = document.getElementById('addImage');
const postTags = document.querySelectorAll('.tags label');
const textarea = document.getElementById("id_content");


let activeTags = new Set();

function renderTextarea() {
    let text = textarea.value;

    let lines = text.split('\n');

    let lastLine = lines[lines.length - 1] || "";

    let content = lines.length > 1 ? lines.slice(0, -1).join('\n') : text;

    let tagsLine = Array.from(activeTags).join(' ');

    textarea.value = tagsLine
        ? (content.trim() ? content.trim() + '\n' + tagsLine : tagsLine)
        : content;
}


postTags.forEach(tag => {
    tag.addEventListener('click', () => {
        tag.classList.toggle('chosenTag');
        const tagText = tag.textContent.trim();

        if (activeTags.has(tagText)) {
            activeTags.delete(tagText);
        } else {
            activeTags.add(tagText);
        }

        renderTextarea();
        textarea.focus();
    });
});

addLink.addEventListener('click', function(){
    input = document.createElement('input')
    addLink.remove()
    input.type = 'url'
    input.name = 'links'
    input.placeholder = 'Додайте посилання'
    
    linksDiv.appendChild(input)
    linksDiv.appendChild(addLink)
})



addImage.addEventListener('change', function () {
    
    for (const file of addImage .files) {
        const imgDiv = document.createElement('div')
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        imgDiv.classList.add('create-post-img');
        imgDiv.appendChild(img);
        imageDiv.appendChild(imgDiv);
        imageDiv.classList.add('fulled-image-container')
    }
});

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
            if (data.redirect_url) {
                window.location.href = data.redirect_url;
            }
        })
        .catch((data) => {
            if (data.errors){
                console.log(data.errors);
            }
        })
})

