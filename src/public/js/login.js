const form = document.getElementById('loginForm')


form.addEventListener('submit', async e => {
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => obj[key] = value);

    try {
        const response = await fetch('/user/login', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        }); 

        if (response.status === 200) {
            const userData = await response.json();
            localStorage.setItem('userToken', userData.token)
            localStorage.setItem('userID', userData.id)
            window.location.replace('/user/current/')
            
        } else {
            const errorData = await response.json()
            alert(`Error: ${errorData.error}`)
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error Interno del Servidor')
    }
});