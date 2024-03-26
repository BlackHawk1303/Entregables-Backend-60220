const socket = io()

const txt = document.getElementById("inputText")
const log = document.getElementById("log")
const btnSend = document.getElementById("btnSend")

let userEmail = ""

window.onload = async function () {

    const { value: email } = await Swal.fire({
        title: "Bienvenido al CHAT",
        input: "Email",
        inputLabel: "Por Favor Ingrese su Correo/Email",
        inputPlaceholder: "correo@host.cl",
        allowOutsideClick: false,
        allowEscapeKey: false
    });
    if (email) {
        Swal.fire(`Correo Ingresado: ${email}`);
        userEmail = email
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
    log.innerHTML = logs;
});

function sendMessage() {

    let inputChat = txt.value.trim()

    let send = { email: userEmail, message: inputChat, }
    console.log(send)
    socket.emit('message', send);

    Toastify({
        text: "Mensaje Enviado",
        duration: 3000
    }).showToast();


    txt.value = ""
}