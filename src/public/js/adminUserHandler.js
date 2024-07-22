const btnUserSearch = document.getElementById("btnUserSearch")
const btnUserUpdate = document.getElementById("btnUserUpdate")
const btnUserDel = document.getElementById("btnUserDelete")
const txtUserID = document.getElementById("txtUserID")
const userRol = document.getElementById("userRol")
const jwt = `Bearer ${localStorage.getItem('userToken')}`

//Solicitud HTTP
const makeRequest = async (url, method, body = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt,
        },
    };
    if (body) options.body = JSON.stringify(body)
    try {
        const response = await fetch(url, options)
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`Error: ${response.status} - ${errorData.message}`)
        }
        return await response.json()
    } catch (error) {
        
        alert(error.message)
        throw error
    }
};

//Campos Vacíos
const verifyEmptyInputs = () => {
    return [...document.querySelectorAll('input[type="text"]')]
        .some(input => input.value.trim() === '')
};

//Buscar un Usuario
btnUserSearch.addEventListener('click', async () => {
    if (verifyEmptyInputs()) {
        alert("Campos Vacíos, Favor Validar")
        return
    }
    try {
        const id = txtUserID.value
        if (!id) {
            alert("Debe Ingresar un ID de Usuario.")
            return
        }
        const data = await makeRequest(`/api/user/${id}`, 'GET')
        const json = data.payload
        if(json){        
            if (json.role.toLowerCase() === "user") userRol.value = "USER"
            if (json.role.toLowerCase() === "premium") userRol.value = "PREMIUM"
        }
        else{
            alert("Usuario no Encontrado")
        }
    } catch (error) {
        console.error(error)
    }
})

//Actualizar el Rol de un Usuario
btnUserUpdate.addEventListener('click', async () => {
    try {
        const id = txtUserID.value;
        const rolValue = userRol.value.toLowerCase()
        if (!id) {
            alert("Debe ingresar un ID de usuario.")
            return
        }
        await makeRequest(`/api/user/role/${id}`, 'PUT', { role: rolValue })
        alert("Rol del Usuario Actualizado Exitosamente")
    } catch (error) {
        console.error(error)
    }
});

//Eliminar un Usuario
btnUserDel.addEventListener('click', async () => {
    try {
        const id = txtUserID.value
        if (!id) {
            alert("Debe ingresar un ID de usuario.")
            return;
        }
        await makeRequest(`/api/user/${id}`, 'DELETE')
        alert("Usuario Eliminado Exitosamente")
    } catch (error) {
        console.error(error)
    }
});

//Acceso al Cargar la Página
window.onload = async () => {
    try {
        await makeRequest(`/user/admin/`, 'GET')
        console.log("Validado")
    } catch (error) {
        if (error.message.includes('401')) {
            alert("Tus Credenciales Vencieron, Vuelve a Iniciar Sesión")
            window.location.replace('/login')
        } else if (error.message.includes('403')) {
            alert("No estás Autorizado para Estar Aquí")
            window.location.replace('/login')
        } else {
            console.error(error)
        }
    }
}