document.addEventListener("DOMContentLoaded", () => {
    const url = window.location.pathname
    const uuid = url.split('/').pop()
    const btnNewpass = document.getElementById("btnUpdatePassword")
    const txtPassword = document.getElementById("txtPassword")
    btnNewpass.addEventListener('click', async (e) => {
        e.preventDefault()

        if (verifyEmptyInputs()) {
            alert("Campos Vacíos")
            return
        }

        const password = txtPassword.value.trim()
        const data = {
            password,
            uuid
        };

        try {
            const response = await fetch('/recovery/passwordCheck', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                alert("Contraseña Modificada Correctamente")
                window.location.replace('/login');
            } else {
                alert("No se Puede Validar la Información")
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un Error al Modificar la Contraseña")
        }
    });

    function verifyEmptyInputs() {
        const inputs = document.querySelectorAll('input[type="password"]')
        return Array.from(inputs).some(input => input.value.trim() === '')
    }
})