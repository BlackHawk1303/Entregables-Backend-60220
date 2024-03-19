// const btnAddCart = document.getElementById("btnCart")
// btnAddCart.addEventListener('Click', async evt => {
//     console.log(btnAddCart.name)
//     fetch("http://localhost:8080/api/carts", {
//         method: "POST",
//         body: {}
//     })
//         .then((response) => response.json())
//         .then((json) = console.log(json))
// })

// function addProduct (cid, pid){
//     console.log(cid.payload._id)
//     console.log(pid)

//     fetch(`http://localhost:8080/api/carts/${cid.payload._id}/products/${pid}`, {
//         method: "POST",
//         body: {}
//     })
//         .then((response) => response.json())
//         .then((json) => console.log(json))
// }

const addCart = document.querySelectorAll(".allBtn")
let cid
let pid

addCart.forEach(btn => {
    btn.addEventListener('click', () => {
        let pid = btn.name
        fetch(`http://localhost:8080/api/carts/${cid}/products/${pid}`, {
        method: "POST",
        body: {}
    })   
        .then((response) => response.json())
        .then((json) => Toastify({
            text: json.status,
            duration: 3000
        }).showToast())

    })
});

window.onload = async function () {
    fetch("http://localhost:8080/api/carts", {
        method: "POST",
        body: JSON.stringify({})
    })
        .then((response) => response.json())
        .then((json) => cid = json._id)
}