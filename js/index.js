const myModal=new bootstrap.Modal("#login-Modal")
let logged= sessionStorage.getItem("logged");
const session= localStorage.getItem("session");

checkLogged();

//logar no sistema
document.getElementById("Login-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const email= document.getElementById("email-input").value;
    const password=document.getElementById("password-input").value;
    const checkSession= document.getElementById("session-check").checked;

    const account= getAccount(email);


    if(!account){
        alert("Oops! Verifique o usuário ou a senha");
        return;
    }

    if(account) {
        if(account.password !==password){
            alert("Oops! Verifique o usuário ou a senha");
        return;
        }

        saveSession(email, checkSession);
        window.location.href= "home.html";
    }
    
})

//criar conta
document.getElementById("create-form").addEventListener("submit", function(e){
    e.preventDefault();

    const email = document.getElementById("email-create-input").value;
    const password = document.getElementById("password-create-input").value;
    const confirmPassword = document.getElementById("confirm-password-create-input").value;

    // Verifica se as senhas correspondem
    if (password !== confirmPassword) {
        alert("As senhas não correspondem. Por favor, verifique.");
        return;
    }

    if (email.length < 5) {
        alert("Preencha o campo com um email válido")
        return;
    }
    if (password.length < 6) {
        alert("A senha deve conter no mínimo 6 dígitos")
        return;
    }

    saveAccount({
        login: email,
        password: password,
        transactions: []
    });

    myModal.hide();

    alert("Conta criada com sucesso!");
});

function checkLogged() {
        if(session) {
            sessionStorage.setItem("logged", session);
            logged= session;
        }

        if(logged) {
            saveSession(logged, session);

            window.location.href= "home.html";
        }
}


function saveAccount(data) {
    localStorage.setItem(data.login, JSON.stringify(data))
}

function saveSession(data, saveSession){
    if(saveSession){
        localStorage.setItem("session", data);
    }

    sessionStorage.setItem("logged", data)
}

function getAccount(key){
    const account= localStorage.getItem(key)
    
    if(account){
        return JSON.parse(account);
    }
    
    return;
}