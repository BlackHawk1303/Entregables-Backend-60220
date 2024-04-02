const form = document.getElementById('registerForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    fetch('/user/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async (result) => {
        if (result.status === 201) {
            window.location.replace('/login');
        } else {
            const errorData = await result.json();
            alert(`Error: ${errorData.error}`);
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('Error Interno del Servidor');
    });
});