document.addEventListener("DOMContentLoaded", () => {
    const btnAsk = document.getElementById("btnNewpass")
    const txtCorreo = document.getElementById("txtCorreo")

    btnAsk.addEventListener('click', async (e) => {
        e.preventDefault();

        if (verifyEmptyInputs()) {
            alert("Campos Vacíos")
            return;
        }

        const email = txtCorreo.value.trim()
        const data = { "email": email }

        try {
            const response = await fetch('/recovery', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                alert("Correo Enviado")
            } else {
                const errorData = await response.json()
                alert(JSON.stringify(errorData))
            }
        } catch (error) {
            console.error("Error:", error)
            alert("Ocurrió un Error al Enviar el Correo")
        }
    });

    function verifyEmptyInputs() {
        const inputs = document.querySelectorAll('input[type="text"]')
        return Array.from(inputs).some(input => input.value.trim() === '')
    }
});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             