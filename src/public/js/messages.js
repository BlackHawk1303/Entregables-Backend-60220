const socket = io()

const txt = document.getElementById("inputText")
const log = document.getElementById("log")
const btnSend = document.getElementById("btnSend")

let userEmail = ""

window.onload = async function () {

    const { value: email } = await Swal.fire({
        title: "Bienvenido al CHAT",
        input: "email",
        inputLabel: "Por favor ingrese su Correo",
        inputPlaceholder: "hola@hola.cl",
        allowOutsideClick: false,
        allowEscapeKey: false
    });
    if (email) {
        Swal.fire(`Correo ingresado: ${email}`);
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
    // let date = new Date()

    // let yr = date.getFullYear()
    // let month = date.getMonth() + 1
    // let day = date.getDate()

    // let hrs = date.getHours().toString()
    // let min = date.getMinutes().toString()

    // let actualDate = `${day}/${month}/${yr} ${hrs}:${min}`

    let inputChat = txt.value.trim()

    let send = { email: userEmail, message: inputChat, /*fecha: actualDate*/ }
    console.log(send)
    socket.emit('message', send);



    Toastify({
        text: "mensaje enviado",
        duration: 3000
    }).showToast();


    txt.value = ""
}