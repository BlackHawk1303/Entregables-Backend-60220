export const createUserError = (user) => {
    return `La Información Proporcionada para la Creación de Usuario es Inválida o está Incompleta. Por Favor, Verifica los Datos Ingresados:
    
    -- Nombre: Se esperaba una cadena de texto (String) y se recibió => "${user.first_name}"
    -- Apellido: Se esperaba una cadena de texto (String) y se recibió => "${user.last_name}"
    -- Email: Se esperaba una dirección de correo válida (String) y se recibió => "${user.email}"
    -- Edad: Se esperaba un número (Number) y se recibió => "${user.age}"
    -- Contraseña: Se esperaba una cadena de texto (String) y se recibió => "${user.password}"
    `;
};

export const loginUserError = (email, password) => {
    return `Los Datos Proporcionados para Iniciar Sesión son Incorrectos o Incompletos. Revisa los Siguientes Campos y Vuelve a Intentarlo:
    
    -- Email: Se esperaba una dirección de correo válida (String) y se recibió => "${email}"
    -- Contraseña: Se esperaba una cadena de texto segura (String) y se recibió => "${password}"
    `;
};

export const deleteUserError = (email) => {
    return `No se Logró Eliminar el Usuario Debido a que el Email Proporcionado es Inválido o no Existe en Nuestros Registros:
    -- Email: "${email}".
    `;
};