$(function(){
    const formRegister = $('.register')[0];
    const formLogin = $('.login')[0];
    const formConfirm = $('.confirm')[0];
    const authBtn = $('.auth-btn');
    const registerBtn = $('.register-btn');
    const createUserBtn = $('.create-user-btn');    

    formRegister.classList.remove('disabled');

    

    authBtn.click(function(){
        formRegister.classList.add('disabled');
        formLogin.classList.remove('disabled');
    });

    registerBtn.click(function(){
        formLogin.classList.add('disabled');
        formRegister.classList.remove('disabled');
    });

    createUserBtn.click(function(){
        formRegister.classList.add('disabled');
        formConfirm.classList.remove('disabled');
    });

    const formForReg = $('.reg-form');

    formForReg.on('submit', function(e){
        e.preventDefault();

        if (this.checkValidity()) {
            formRegister.classList.add('disabled');
            formConfirm.classList.remove('disabled');
        } else {
            this.reportValidity();
    }
});
});
