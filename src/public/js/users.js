const closeSession = document.getElementById("shutdownSession")
closeSession.addEventListener('click', async e =>{
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
        localStorage.clear();
        alert('Sesión Cerrada')
        window.location.replace('/login')
    }
})
function renderUserData(user) {
    const html = `
        <div style="max-width: 400px; margin: 20px auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h1 style="font-size: 24px; color: #333; text-align: center; margin-bottom: 10px;">Perfil de: ${user.name}</h1>
            <p style="font-size: 16px; color: #555; margin: 5px 0;">Tu email es: ${user.email}</p>
            <p style="font-size: 16px; color: #555; margin: 5px 0;">Tu Edad es: ${user.age}</p>
            <p style="font-size: 16px; color: #555; margin: 5px 0;">Perfil: ${user.role}</p>
        </div>
    `;
    let enlace = document.getElementById("enlace");
    enlace.href = `/cart/${user.cart}`;
    return html;
}

function handleStatus(status) {
    if (status === 200) {
        return true;
    } else if (status === 401) {
        alert("Tus Credenciales han Expirado. Favor, Vuelve a Iniciar Sesión.")
        window.location.replace('/login')
    } else if (status === 403) {
        alert("No estás Autorizado para estar Aquí.")
        window.location.replace('/login')
    }
    return false;
}  

async function loadData() {
    const userId = localStorage.getItem('userID')
    const jwt = `Bearer ${localStorage.getItem('userToken')}`
    const response = await fetch(`/user/current/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt,
        }
    });
    if (!response.ok) {
        handleStatus(response.status)
        return
    }
    const user = await response.json()
    const div = document.getElementById('midiv')
    div.innerHTML = renderUserData(user)
}

window.onload = loadData;