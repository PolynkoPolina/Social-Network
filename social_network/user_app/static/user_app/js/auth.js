function getCSRFToken(){
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content')
}


const formRegister = document.querySelector('.register');
const formLogin = document.querySelector('.login');
const formConfirm = document.querySelector('.confirm');
const authBtn = document.querySelector('.auth-btn');
const registerBtn = document.querySelector('.register-btn');
const backBtn = document.getElementById('back');


if (localStorage.getItem("authState") == 'confirm'){
    formRegister.classList.add('disabled');
    formConfirm.classList.remove('disabled');
} else if(localStorage.getItem("authState") == 'login'){
    formRegister.classList.add('disabled');
    formLogin.classList.remove('disabled');
}

backBtn.addEventListener(
    'click',
    (event)=>{
        formConfirm.classList.add('disabled');
        formRegister.classList.remove('disabled');
        localStorage.removeItem('authState');
        
        
        fetch("/set-code-sent/", {
            method: "POST",
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest",
            },
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log("session code_sent встановлено");
            }
        });
    }
)

authBtn.addEventListener(
    'click',
    (event)=>{
        formRegister.classList.add('disabled');
        formLogin.classList.remove('disabled');
    }
);


registerBtn.addEventListener(
    'click',
    (event)=>{
        formLogin.classList.add('disabled');
        formRegister.classList.remove('disabled');
    }
);

document.getElementById("reg-form").addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);

        fetch(form.action, {
            method: "POST", 
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest",
            },
            body: formData  
        })
        .then(async (response) => {
            const data = await response.json()
        
            if (!response.ok){
                throw data;
            }
        
            return data
        })
        .then((data)=>{
            console.log("Користувач успішно створений")
            formRegister.classList.add('disabled');
            formConfirm.classList.remove('disabled');
            sendMail();
            localStorage.setItem('authState', 'confirm'); 
        })
        .catch((error) => {  
            console.log("Ошибка:", error);
        
            if (error.errors){
                console.log(error.errors);
            }
        });
    });


function sendMail(){

        const confForm = document.querySelector('#send-mail');
        const formDataConf = new FormData(confForm) 
        fetch(confForm.action, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest",
            },
            body: formDataConf
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                console.log("Код відправлено");
            }})
}


document.getElementById("confirm-form").addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);    
        fetch(form.action, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest",
            },
            body: formData
        })
        .then(async (response) => {
            const data = await response.json()
        
            if (!response.ok){
                throw data;
            }
        
            return data
        })
        .then((data)=>{
            formConfirm.classList.add('disabled');
            formLogin.classList.remove('disabled');
            sendMail();
            localStorage.setItem('authState', 'login'); 
        })
        .catch((error) => {  
            console.log("Ошибка:", error);
        
            if (error.errors){
                console.log(error.errors);
            }
        });
    });



document.getElementById("login-form").addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);    
        fetch(form.action, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "X-Requested-With": "XMLHttpRequest",
            },
            body: formData
        })
        .then(async (response) => {
            const data = await response.json()
        
            if (!response.ok){
                throw data;
            }
        
            return data
        })
        .then((data)=>{
            localStorage.removeItem('authState'); 
            window.location.href = '/'

        })
        .catch((error) => {  
            console.log("Ошибка:", error);
        
            if (error.errors){
                console.log(error.errors);
            }
        });
    });