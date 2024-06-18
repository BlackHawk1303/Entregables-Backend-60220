const addCart = document.querySelectorAll(".allBtn")
const btnLogout = document.getElementById("logout")
let cid
let pid
const jwt = `Bearer ${localStorage.getItem('userToken')}`

addCart.forEach(btn => {
    btn.addEventListener('click', () => {
        let pid = btn.name
        fetch(`http://localhost:8080/api/carts/${cid}/products/${pid}`, {
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
});

window.onload = async function () {
    const userId = localStorage.getItem('userID')
    fetch(`http://localhost:8080/api/user/${userId}`, {
        method: "GET",
        'Content-Type': 'application/json',

    })
        .then((response) => response.json())
        .then((json) => load(json.payload))
}

function load(json) {
    cid = json
    console.log(json)
    let enlace = document.getElementById("enlace")
    enlace.href = `/cart/${cid}`

}

btnLogout.addEventListener('click', e => {
    window.location.replace('/user/logout')
})