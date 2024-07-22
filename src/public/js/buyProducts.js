const userId = localStorage.getItem('userID')

window.onload = function () {
    const cartID = extraerIDdelCarritoDesdeURL()
    

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
        
        if (data.status === "success") {
            Swal.fire({
                icon: 'success',
                title: 'Compra Realizada con Éxito',
                confirmButtonText: 'OK',
                allowOutsideClick: false
            }).then(result => {
                if (result.isConfirmed) location.reload()
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Hubo un Problema al Realizar la Compra',
                text: data.message || 'Inténtalo de Nuevo más Tarde.'
            })
        }
    })
    .catch(error => {
        console.error('Error Durante la Compra:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error Durante la Compra',
            text: 'Hubo un Problema al Realizar la Compra. Inténtalo de Nuevo más Tarde.'
        })
    })
}