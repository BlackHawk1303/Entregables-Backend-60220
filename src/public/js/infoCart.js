const addCart = document.querySelectorAll(".allBtn")
const btnLogout = document.getElementById("logout")
let cid
let pid
const jwt = `Bearer ${localStorage.getItem('userToken')}`
const UserTitle = document.getElementById("UserTitle")

addCart.forEach(btn => {
    btn.addEventListener('click', () => {
        let pid = btn.name
        fetch(`/api/carts/${cid}/products/${pid}`, {
            method: "POST",
            headers: { 'Authorization': jwt, },
            body: {},
        })
            .then((response) => response.json())
            .then((json) => Toastify({
                text: json.status,
                duration: 3000
            }).showToast())

    })
})

window.onload = async function () {
    const userId = localStorage.getItem('userID')
    fetch(`/api/user/${userId}`, {
        method: "GET",
        'Content-Type': 'application/json',
    })
        .then((response) => response.json())
        .then((json) => load(json.payload))
}

function load(json) {
    cid = json.cart
    let enlace = document.getElementById("enlace")
    enlace.href = `/cart/${cid}`
    UserTitle.innerHTML = ""
    UserTitle.innerHTML = ` BIENVENIDO ("${json.role}") Sr/a ${json.first_name} ${json.last_name} Edad ${json.age} `
}

btnLogout.addEventListener('click', async e => {
    const userId = localStorage.getItem('userID')
    const data = {"_id" : userId}
    const response = await fetch('/user/logout', {
        method: 'POST',
        body : JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })    
    if (!response.ok){
        alert('No Se Ha Podido Cerrar Sesión')
    }
    else{
        localStorage.clear()
        alert('Sesión Cerrada')
        window.location.replace('/login')
    }
})