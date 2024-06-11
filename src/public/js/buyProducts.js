const userId = localStorage.getItem('userID')

window.onload = function () {
    const cartID = extraerIDdelCarritoDesdeURL()
    console.log(cartID);

    const btnBuy = document.getElementById("btnComprar")
    btnBuy.addEventListener('click', () => comprarCarrito(cartID))

}

function extraerIDdelCarritoDesdeURL() {
    const segmentosURL = window.location.href.split('/')
    return segmentosURL[segmentosURL.length - 1]
}

function comprarCarrito(cartID) {
    fetch(`/api/carts/${cartID}/purchase`, {
        method: 'POST',
        body: JSON.stringify({ user: userId }),
        headers: {
            'Content-Type': 'application/json',

        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta de Compra:', data)
            if (data.success = "success") {
                alert("Compra Realizada con Éxito.")
            } else {
                alert("Hubo un Problema al Realizar la Compra.")
            }
        })
        .catch(error => {
            console.error('Error Durante la Compra:', error)
        });
}