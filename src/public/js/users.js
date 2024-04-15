function renderUserData(user) {
    const html = `
        <h1>Perfil de: ${user.name}</h1>
        <p>Tu email es: ${user.email}</p>
        <p>Tu Edad es: ${user.age}</p>
        <p>Perfil: ${user.role}</p>
    `;
    return html;
}

function handleStatus(status) {
    if (status === 200) {
        return true;
    } else if (status === 401) {
        alert("Tus Credenciales han Expirado. Favor, Vuelve a Iniciar Sesión.");
        window.location.replace('/login');
    } else if (status === 403) {
        alert("No estás Autorizado para estar Aquí.");
        window.location.replace('/login');
    }
    return false;
}

async function loadData() {
    const userId = localStorage.getItem('userID');
    const jwt = `Bearer ${localStorage.getItem('userToken')}`;
    const response = await fetch(`/user/current/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt,
        }
    });

    if (!response.ok) {
        handleStatus(response.status);
        return;
    }
    
    // let data = await response.json()
    // const loadhtml = document.getElementById('template').innerHTML
    // console.log(loadhtml)
    // const newTemplate = Handlebars.compile(loadhtml);      
    // const loadTemplate = newTemplate(data);
    // console.log(loadTemplate);
    // document.getElementById('userTemplate').innerHTML = loadTemplate;

    const user = await response.json();
    const div = document.getElementById('midiv');
    div.innerHTML = renderUserData(user);
}

window.onload = loadData;