import { renderErrors } from "../../../../static/js/renderErrors.js"
import { getCSRFToken } from "../../../../static/js/getCSRFToken.js"


const linksDiv = document.getElementById('links-list')
const postModal = document.getElementById('create-post-modal')
const imageDiv = document.getElementById('image-container');
const addLink = document.getElementById('addLink');
const addImage = document.getElementById('addImage');
const postTags = document.querySelectorAll('.tags label');
const editor = document.getElementById('editor');
const addTag = document.getElementById("addTag");

addTag.remove();
document.querySelector('.tags').appendChild(addTag);


let selectedFiles = [];
let linksCount = 1;

postTags.forEach(tag => {
    tag.addEventListener('click', () => {
        const tagText = tag.textContent.trim();
        tag.classList.toggle('chosenTag');
        if(tag.classList.contains('chosenTag')){
            const span = document.createElement('span');
            span.className = 'area-tag';
            span.contentEditable = 'false';
            span.dataset.tag = tagText;
            span.innerHTML = ` ${tagText}`;
            editor.appendChild(span);
        } else{
           const currentTag = editor.querySelector(`[data-tag="${tagText}"]`);
            if(currentTag){
                currentTag.remove();
            }
        }
    });

});

addLink.addEventListener('click', function(){
    if(linksCount < 3){
        linksCount++;
        console.log(linksCount)
        const inputDiv = document.createElement('div');
        const input = document.createElement('input');
        input.type = 'url';
        input.name = 'links';
        input.placeholder = 'Додайте посилання';
        addLink.remove();
        
        inputDiv.appendChild(input)
        inputDiv.appendChild(addLink);
        linksDiv.appendChild(inputDiv);
    } else{
        addLink.remove();
    }

})


addImage.addEventListener('change', function () {
    for (const file of addImage.files) {

        selectedFiles.push(file);
        const imgDiv = document.createElement('div');
        const deleteBtn = document.createElement('button');
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        imgDiv.classList.add('create-post-img');
        imgDiv.appendChild(img);
        deleteBtn.classList.add('delete-image-btn');
        deleteBtn.type = 'button';
        deleteBtn.addEventListener('click', function () {
            imgDiv.remove();

            selectedFiles = selectedFiles.filter(f =>
                f !== file
            );
            console.log(selectedFiles)

            if(imageDiv.childElementCount == 0){
                imageDiv.classList.remove('fulled-image-container');
                
            }
        });
        imgDiv.appendChild(deleteBtn);
        imageDiv.appendChild(imgDiv);
        imageDiv.classList.add('fulled-image-container');
        img.onload = () => {
            if(img.naturalHeight > img.naturalWidth){
                img.classList.add('vertical');
            } else{
                img.classList.add('horizontal');
            }
        };
    }
    addImage.value = '';
});


document.getElementById('add-tag-form').addEventListener('submit', function (e) {
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
            console.log("Тег успішно створено");
            if (data.redirect_url) {
                window.location.href = data.redirect_url;
            }
        })
        .catch((data) => {
            if (data.errors){
                renderErrors("create-errors", data.errors)
            }
        })
})


document.getElementById('create-post-form').addEventListener('submit', function(e){
    event.preventDefault();
    const form = e.target;
    const dt = new DataTransfer();
    selectedFiles.forEach(file => {
        dt.items.add(file);
    });
    console.log(dt)
    addImage.files = dt.files;

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
                renderErrors("create-errors", data.errors)
            }
        })
})

