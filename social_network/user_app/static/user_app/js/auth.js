function getCSRFToken(){
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content')
}


const formRegister = document.querySelector('.register');
const formLogin = document.querySelector('.login');
const formConfirm = document.querySelector('.confirm');
const authBtn = document.querySelector('.auth-btn');
const registerBtn = document.querySelector('.register-btn');



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
                document.getElementById("send-mail").submit();
            })
            .catch((data)=>{
                if(data.errors){
                    console.log(data.errors)
                }
            })
            
        
    }
)
