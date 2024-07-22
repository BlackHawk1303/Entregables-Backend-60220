window.onload = async function() {
    const jwt = `Bearer ${localStorage.getItem('userToken')}`
    

    try {
        const response = await fetch('/admin/validator', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
            }
        })

        handleResponseStatus(response);
    } catch (error) {
        console.error('Error al Obtener los Datos:', error)
    }
}

function handleResponseStatus(response) {
    if (response.status === 200) {
        console.log("Validado")
    } else if (response.status === 401) {
        alert("Tu Inicio de Sesión a Expirado")
        window.location.replace('/login')
    } else if (response.status === 403) {
        alert("No estás Autorizado para Estar Aquí")
        window.location.replace('/login')
    }
}