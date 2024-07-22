const socket = io()
const txt = document.getElementById("inputText")
const log = document.getElementById("log")
const btnSend = document.getElementById("btnSend")
let userEmail = ""
const userId = localStorage.getItem('userID')
const jwt = `Bearer ${localStorage.getItem('userToken')}`

window.onload = async function () {
    const response = await fetch(`/api/user/validation/${userId}`, {
        method: "GET",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': jwt
        }
    })    
    
    if (response.status === 200){
        const json = await response.json()
        userEmail = json.payload

        Toastify({
            text:`Autenticado con ${userEmail}`,
            duration: 3000
        }).showToast();
    }

    if (response.status === 401 || response.status === 403){
        alert(" No tienes Autorizacion para Estar Aqui, o Tus Credenciales son Incorrectas")
        window.location.replace('login')
    }

    if (response.status === 500){
        const json = await response.json()
        alert(json.error)
    }

}

txt.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        sendMessage()
    }
});

btnSend.addEventListener('click', evt => {
    sendMessage()
})

socket.on('log', data => {
    let logs = '';
    data.forEach(d => {
        logs += `${d.email} Dice: ${d.message} </br>`
    });
    log.innerHTML = logs
});

function sendMessage() {

    let inputChat = txt.value.trim()

    let send = { email: userEmail, message: inputChat, }
    
    socket.emit('message', send)

    Toastify({
        text: "Mensaje Enviado",
        duration: 3000
    }).showToast();
    txt.value = ""
}