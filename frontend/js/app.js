document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');

    // Función para verificar el rol
    const verifyRole = (allowedRoles) => {
        const role = localStorage.getItem('role'); // Obtener el rol del usuario desde el almacenamiento local
        return allowedRoles.includes(role);
    };

    // Navegación: Página de inicio
    document.getElementById('home-link').addEventListener('click', () => {
        content.innerHTML = '<p>Bienvenido al Sistema de Gestión Documental</p>';
    });

// Navegación: Gestión de Funcionarios
document.getElementById('employees-link').addEventListener('click', async () => {
    const content = document.getElementById('content');

    if (!verifyRole(['developer', 'admin'])) {
        content.innerHTML = `<p style="color: red;">No tienes permiso para acceder a esta sección</p>`;
        return;
    }

    content.innerHTML = `<p>Cargando funcionarios...</p>`;

    try {
        const response = await fetch('http://localhost:5000/api/employees', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Enviar el token
            },
        });
        
        const employees = await response.json();

        if (response.ok) {
            let html = '<h2>Lista de Funcionarios</h2>';
            html += `<button id="add-employee-btn">Registrar Nuevo Funcionario</button>`;
            html += '<table border="1">';
            html += '<tr><th>CI</th><th>Nombre</th><th>Apellido</th><th>Unidad</th><th>Cargo</th><th>Acciones</th></tr>';

            employees.forEach(employee => {
                html += `
                    <tr>
                        <td>${employee.ci}</td>
                        <td>${employee.firstName}</td>
                        <td>${employee.lastName}</td>
                        <td>${employee.unit}</td>
                        <td>${employee.position}</td>
                        <td>
                            <button class="edit-employee" data-id="${employee._id}">Editar</button>
                        </td>
                    </tr>
                `;
            });

            html += '</table>';
            content.innerHTML = html;

            // Evento para el botón "Registrar Nuevo Funcionario"
            document.getElementById('add-employee-btn').addEventListener('click', () => {
                showEmployeeRegistrationForm();
            });

            // Eventos para editar y eliminar (implementaremos después si es necesario)
            document.querySelectorAll('.edit-employee').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const employeeId = e.target.getAttribute('data-id'); // Obtener el ID del funcionario
                    console.log('ID del funcionario:', employeeId); // Asegúrate de que el ID se imprima correctamente
                    showEmployeeEditForm(employeeId); // Mostrar el formulario de edición
                });
            });
            
            
        } else {
            content.innerHTML = `<p style="color: red;">Error al cargar los funcionarios</p>`;
        }
    } catch (error) {
        content.innerHTML = `<p style="color: red;">Error al cargar los funcionarios</p>`;
    }
});
// Mostrar formulario de registro
const showEmployeeRegistrationForm = () => {
    const content = document.getElementById('content');

    content.innerHTML = `
        <h2>Registrar Nuevo Funcionario</h2>
        <form id="register-employee-form">
            <label for="ci">Cédula de Identidad:</label>
            <input type="text" id="ci" name="ci" required><br><br>

            <label for="firstName">Nombres:</label>
            <input type="text" id="firstName" name="firstName" required><br><br>

            <label for="lastName">Apellidos:</label>
            <input type="text" id="lastName" name="lastName" required><br><br>

            <label for="phone">Teléfono:</label>
            <input type="text" id="phone" name="phone"><br><br>

            <label for="position">Cargo:</label>
            <input type="text" id="position" name="position" required><br><br>

            <label for="unit">Unidad:</label>
            <input type="text" id="unit" name="unit" required><br><br>

            <label for="startDate">Fecha Inicio:</label>
            <input type="date" id="startDate" name="startDate" required><br><br>

            <label for="endDate">Fecha Fin:</label>
            <input type="date" id="endDate" name="endDate"><br><br>

            <button type="submit">Registrar Funcionario</button>
        </form>
        <div id="response-message"></div>
    `;

    const form = document.getElementById('register-employee-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const newEmployee = {
            ci: document.getElementById('ci').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value,
            position: document.getElementById('position').value,
            unit: document.getElementById('unit').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
        };

        try {
            const response = await fetch('http://localhost:5000/api/employees/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Enviar el token en el encabezado
                },
                body: JSON.stringify(newEmployee),
            });

            const result = await response.json();
            const messageDiv = document.getElementById('response-message');

            if (response.ok) {
                messageDiv.innerHTML = `<p style="color: green;">Funcionario registrado con éxito</p>`;
                document.getElementById('employees-link').click(); // Recargar la lista de funcionarios
            } else {
                messageDiv.innerHTML = `<p style="color: red;">Error: ${result.message}</p>`;
            }
        } catch (error) {
            const messageDiv = document.getElementById('response-message');
            messageDiv.innerHTML = `<p style="color: red;">Error al registrar el funcionario.</p>`;
        }
    });
};
// BOton editar
const showEmployeeEditForm = async (employeeId) => {
    const content = document.getElementById('content');
    content.innerHTML = `<p>Cargando datos del funcionario...</p>`;

    try {
        // Obtener los datos del funcionario desde el backend
        const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Enviar el token en el encabezado
            },
        });

        const employee = await response.json();
        console.log('Datos del funcionario:', employee); // Verifica los datos que llega desde el servidor

        if (response.ok) {
            // Mostrar el formulario de edición con los datos actuales
            content.innerHTML = `
                <h2>Editar Funcionario</h2>
                <form id="edit-employee-form">
                    <label for="ci">Cédula de Identidad:</label>
                    <input type="text" id="ci" name="ci" value="${employee.ci}" required><br><br>

                    <label for="firstName">Nombres:</label>
                    <input type="text" id="firstName" name="firstName" value="${employee.firstName}" required><br><br>

                    <label for="lastName">Apellidos:</label>
                    <input type="text" id="lastName" name="lastName" value="${employee.lastName}" required><br><br>

                    <label for="phone">Teléfono:</label>
                    <input type="text" id="phone" name="phone" value="${employee.phone}"><br><br>

                    <label for="position">Cargo:</label>
                    <input type="text" id="position" name="position" value="${employee.position}" required><br><br>

                    <label for="unit">Unidad:</label>
                    <input type="text" id="unit" name="unit" value="${employee.unit}" required><br><br>

                    <label for="startDate">Fecha Inicio:</label>
                    <input type="date" id="startDate" name="startDate" value="${employee.startDate.split('T')[0]}" required><br><br>

                    <label for="endDate">Fecha Fin:</label>
                    <input type="date" id="endDate" name="endDate" value="${employee.endDate ? employee.endDate.split('T')[0] : ''}"><br><br>

                    <button type="submit">Guardar Cambios</button>
                </form>
                <div id="response-message"></div>
            `;

            // Manejar el envío del formulario de edición
            const form = document.getElementById('edit-employee-form');
            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                const updatedData = {
                    ci: document.getElementById('ci').value,
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    phone: document.getElementById('phone').value,
                    position: document.getElementById('position').value,
                    unit: document.getElementById('unit').value,
                    startDate: document.getElementById('startDate').value,
                    endDate: document.getElementById('endDate').value,
                };

                try {
                    const updateResponse = await fetch(`http://localhost:5000/api/employees/${employeeId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                        body: JSON.stringify(updatedData),
                    });

                    const result = await updateResponse.json();
                    const messageDiv = document.getElementById('response-message');

                    if (updateResponse.ok) {
                        messageDiv.innerHTML = `<p style="color: green;">Funcionario actualizado con éxito</p>`;
                        document.getElementById('employees-link').click(); // Volver a la lista de funcionarios
                    } else {
                        messageDiv.innerHTML = `<p style="color: red;">Error: ${result.message}</p>`;
                    }
                } catch (error) {
                    const messageDiv = document.getElementById('response-message');
                    messageDiv.innerHTML = `<p style="color: red;">Error al actualizar el funcionario.</p>`;
                }
            });
        } else {
            content.innerHTML = `<p style="color: red;">Error al cargar los datos del funcionario</p>`;
        }
    } catch (error) {
        content.innerHTML = `<p style="color: red;">Error al cargar los datos del funcionario</p>`;
    }
};

// Navegación: Gestión de Documentosxxxx



// Navegación: Gestión de Documentos
document.getElementById('documents-link').addEventListener('click', async () => {
    const content = document.getElementById('content');

    // Verificar rol
    if (!verifyRole(['developer', 'admin', 'archiver'])) {
        content.innerHTML = `<p style="color: red;">No tienes permiso para acceder a esta sección</p>`;
        return;
    }

    // Mostrar cargando
    content.innerHTML = `<p>Cargando lista de funcionarios y documentos...</p>`;

    try {
        // Llamar a la API para obtener los datos de los empleados y documentos
        const response = await fetch('http://localhost:5000/api/employees/list-with-documents', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Token del usuario
            },
        });

        // Verificar si la respuesta es correcta
        if (!response.ok) {
            throw new Error('Error al cargar la lista de documentos');
        }

        // Obtener los datos de los empleados
        const employees = await response.json();
        console.log('Datos de empleados recibidos:', employees); // Verificar la estructura de los datos

        // Llamar a la función para mostrar la tabla con los documentos
        showEmployeeDocumentsTable(employees);
    } catch (error) {
        content.innerHTML = `<p style="color: red;">Error al cargar la lista de documentos</p>`;
        console.error('Error:', error);
    }
});

const showEmployeeDocumentsTable = (employees) => {
    const content = document.getElementById('content');

    let html = `
        <h2>Gestión de Documentos</h2>
        <table border="1">
            <tr>
                <th>CI</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Carnet de Identidad</th>
                <th>Certificado de Nacimiento</th>
                <th>Certificado de Matrimonio</th>
                <th>Libreta Militar</th>
                <th>Croquis de Domicilio</th>
                <th>Curriculum</th>
                <th>Titulo Provisión Nacional</th>
                <th>Diploma Académico</th>
                <th>Rejap</th>
                <th>Cenvi</th>
                <th>Declaración de Notaria</th>
                <th>Certificado Médico</th>
                <th>NIT</th>
                <th>Declaración de Bienes y Rentas</th>
                <th>Memorandums</th>
                <th>Acciones</th>
            </tr>
    `;

    // Recorrer los empleados y mostrar sus documentos en las columnas correspondientes
    employees.forEach(employee => {
        console.log('ID del empleado:', employee._id); // Confirmar si `_id` está presente
        html += `
            <tr>
                <td>${employee.ci}</td>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${employee.documents['Carnet de Identidad'] || 'Pendiente'}</td>
                <td>${employee.documents['Certificado de Nacimiento'] || 'Pendiente'}</td>
                <td>${employee.documents['Certificado de Matrimonio'] || 'Pendiente'}</td>
                <td>${employee.documents['Libreta Militar'] || 'Pendiente'}</td>
                <td>${employee.documents['Croquis de domicilio'] || 'Pendiente'}</td>
                <td>${employee.documents['Curriculum'] || 'Pendiente'}</td>
                <td>${employee.documents['Titulo Provisión Nacional'] || 'Pendiente'}</td>
                <td>${employee.documents['Diploma Académico'] || 'Pendiente'}</td>
                <td>${employee.documents['Rejap'] || 'Pendiente'}</td>
                <td>${employee.documents['Cenvi'] || 'Pendiente'}</td>
                <td>${employee.documents['Declaración de Notaria'] || 'Pendiente'}</td>
                <td>${employee.documents['Certificado Médico'] || 'Pendiente'}</td>
                <td>${employee.documents['NIT'] || 'Pendiente'}</td>
                <td>${employee.documents['Declaración de Bienes y Rentas'] || 'Pendiente'}</td>
                <td>${employee.documents['Memorandums'] || 'Pendiente'}</td>
                <td>
                    <button class="view-docs" data-id="${employee._id}">Ver</button>
                    <button class="upload-docs" 
                    data-id="${employee._id}" 
                    data-name="${employee.firstName}" 
                    data-lastname="${employee.lastName}" 
                    data-ci="${employee.ci}">Subir Documentos</button>
                </td>
            </tr>  
        `;
    });

    html += '</table>';
    content.innerHTML = html;
    // Asociar eventos a los botones de Subir Documentos
    document.querySelectorAll('.upload-docs').forEach(button => {
        button.addEventListener('click', async (e) => {
            
            const employeeId = e.target.getAttribute('data-id');
            const employeeName = e.target.getAttribute('data-name'); // Obtener el nombre del empleado
            const employeeLastName = e.target.getAttribute('data-lastname'); // Apellido del empleado
            const employeeCi = e.target.getAttribute('data-ci'); // CI del empleado
            console.log('ID del funcionario:', employeeId); // Verifica que el ID esté correcto
            console.log('Nombre del funcionario:', employeeName); // Verifica el nombre
            console.log('Apellido del funcionario:', employeeLastName); // Verifica el apellido
            
            if (!employeeId || !employeeName || !employeeLastName || !employeeCi) {
                console.error('Error: El ID del empleado no está definido.');
                return;  // Si el ID no está definido, no hace la solicitudxx
            }
            console.log('ID del funcionario para subir documentos:', employeeId); // Verifica que el ID es correcto
            console.log('Nombre del funcionario:', employeeName);
            try {
                const response = await fetch(`http://localhost:5000/api/documents/employee/${employeeId}`, { // Cambié la URL
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
    
                const employeeDocuments = await response.json();

            showUploadForm(employeeId,  employeeName, employeeLastName, employeeCi, employeeDocuments.documents );  // Llamar a la función modificada
            }catch (error) {
                console.error('Error al obtener los documentos:', error);
            }
        });
    });       
      
};

// Mostrar formulario de subida de documentos (ahora solo con el mensaje "Bienvenido")cccx
const showUploadForm = (employeeId, employeeName, employeeLastName, employeeCi, documentsStatus) => {
    console.log('Formulario de subida para el empleado ID:', employeeId); // Depuración

    const content = document.getElementById('content');

    // Listado de documentos
    const documents = [
        "Carnet de Identidad",
        "Certificado de Nacimiento",
        "Certificado de Matrimonio",
        "Libreta Militar",
        "Croquis de domicilio",
        "Curriculum",
        "Titulo Provisión Nacional",
        "Diploma Académico",
        "Rejap",
        "Cenvi",
        "Declaración de Notaria",
        "Certificado Médico",
        "NIT",
        "Declaración de Bienes y Rentas",
        "Memorandums",
    ];

    let html = `
        <h2>Bienvenido</h2>
        <p>¡Has llegado al formulario para subir documentos!</p>
        <p><strong>Funcionario:</strong> ${employeeName} ${employeeLastName}</p>
        <p><strong>CI:</strong> ${employeeCi}</p>
        
        <!-- Título "Documentos del Funcionario" -->
        <h3>Documentos del Funcionario</h3>
        <form id="upload-documents-form">
            <ul>
    `;

    // Generar la lista de documentos con los botones desplegables
    documents.forEach((doc) => {
        const currentStatus = documentsStatus && documentsStatus[doc] ? documentsStatus[doc].status : 'Pendiente';
        const fileName = documentsStatus && documentsStatus[doc] ? documentsStatus[doc].fileName : ''; // Obtener el nombre del archivo si está subido

        html += `
            <li>
                <strong>${doc}</strong>
                <select class="document-action" data-doc="${doc}">
                    <option value="Pendiente" ${currentStatus === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="Subir" ${currentStatus === 'Presento' || currentStatus === 'Subir' ? 'selected' : ''}>Subir</option>
                    <option value="No Presento" ${currentStatus === 'No Presento' ? 'selected' : ''}>No Presento</option>
                    <option value="No Corresponde" ${currentStatus === 'No Corresponde' ? 'selected' : ''}>No Corresponde</option>
                </select>
                <!-- Contenedor dinámico para subir archivos -->
                <div id="upload-${doc.replace(/ /g, '-')}" class="upload-field"></div>
                <!-- Mostrar el archivo subido si ya existe -->
                <div id="file-${doc.replace(/ /g, '-')}" class="uploaded-file">
                    ${fileName ? `Archivo: ${fileName}` : ''}
                </div>
                <div id="date-${doc.replace(/ /g, '-')}" class="date-field"></div>
            </li>
        `;
    });

    html += `
            </ul>
            <button type="submit" id="save-documents-btn" disabled>Guardar</button>
        </form>
    `;

    content.innerHTML = html;

    // Evento para habilitar el botón Guardar al seleccionar cualquier opción
    const selectElements = document.querySelectorAll('.document-action');
    selectElements.forEach((select) => {
        select.addEventListener('change', (event) => {
            const docName = event.target.getAttribute('data-doc');
            const selectedOption = event.target.value;
            const uploadField = document.getElementById(`upload-${docName.replace(/ /g, '-')}`);
            const dateField = document.getElementById(`date-${docName.replace(/ /g, '-')}`);
            const fileField = document.getElementById(`file-${docName.replace(/ /g, '-')}`);

            if (selectedOption === 'Subir') {
                uploadField.innerHTML = `<input type="file" name="file-${docName}">`;
                dateField.innerHTML = '';  // Limpiar campo de fecha
                fileField.innerHTML = '';  // Limpiar archivo previamente cargado
            } else if (selectedOption === 'Pendiente') {
                // Mostrar el campo de fecha si se selecciona "Pendiente"
                dateField.innerHTML = `<input type="date" name="date-${docName}" required>`;
                uploadField.innerHTML = '';  // Limpiar campo de archivo
                fileField.innerHTML = '';  // Limpiar archivo previamente cargado
            } else {
                // Limpiar ambos campos si no es "Subir" ni "Pendiente"
                uploadField.innerHTML = '';
                dateField.innerHTML = '';
                fileField.innerHTML = '';  // Limpiar archivo previamente cargado
            }
            // Habilitar el botón guardar si se selecciona cualquier opción
            document.getElementById('save-documents-btn').disabled = false;
        });
    });

    // Manejar el envío del formulario
    document.getElementById('upload-documents-form').addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const updates = {};
        const formData = new FormData(); // Crear un FormData para "Subir"
        const selectElements = document.querySelectorAll('.document-action');

        let fileUploaded = false;  // Variable para saber si se está subiendo un archivo.

        selectElements.forEach((select) => {
            const docName = select.getAttribute('data-doc');
            const action = select.value;
            // Si la opción seleccionada es "Subir", procesamos el archivo
            if (action === 'Subir') {
                const fileInput = document.querySelector(`input[name="file-${docName}"]`);
                if (fileInput && fileInput.files.length > 0) {
                    Array.from(fileInput.files).forEach((file) => {
                        formData.append(`file-${docName}`, file); // Usar `file-{docName}` como campo para cada archivo
                    });
                    formData.append('documentName', docName); // Nombre del documento
                    formData.append('employeeId', employeeId); // ID del empleado
                    fileUploaded = true;
                } else {
                    alert(`Por favor, selecciona un archivo para "${docName}".`);
                    throw new Error('Archivo faltante');
                }
            } else {
                // Para los estados que no son "Subir", solo actualizamos el estado
                updates[docName] = action;
            }
        });

        try {
             // Si hay algún estado que actualizar (No Presento, No Corresponde, Pendiente)
            if (Object.keys(updates).length > 0) {
                // Actualizar documentos con "No Presento", "Pendiente", etc.
                const response = await fetch(`http://localhost:5000/api/employees/${employeeId}/documents`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(updates),
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar los documentos');
                }

                console.log('Documentos actualizados:', updates);
            }

            // Si se seleccionó "Subir" y hay un archivo para subir
            if (fileUploaded) {
                console.log('Datos enviados al backend para "Subir":');
                for (const pair of formData.entries()) {
                    console.log(`${pair[0]}:`, pair[1]);
                }
                // Subir el archivo al backend si se seleccionó "Subir"
                const uploadResponse = await fetch('http://localhost:5000/api/documents/upload', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    throw new Error('Error al subir el archivo');
                }

                console.log('Archivo subido con éxito');
            }

            alert('Documentos actualizados con éxito');
            document.getElementById('documents-link').click(); // Recargar la tabla principal
        } catch (error) {
            console.error('Error al guardar los documentos:', error);
            alert('Error al guardar los documentos');
        }
    });



    
     
};








//aca termina















    // Inicio de sesión
    document.getElementById('home-link').addEventListener('click', () =>{ 
        content.innerHTML = `
            <h2>Iniciar Sesión</h2>
            <form id="login-form">
                <label for="email">Correo:</label>
                <input type="email" id="email" name="email" required><br><br>

                <label for="password">Contraseña:</label>
                <input type="password" id="password" name="password" required><br><br>

                <button type="submit">Iniciar Sesión</button>
            </form>
            <div id="response-message"></div>
        `;

        const form = document.getElementById('login-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const credentials = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
            };

            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials),
                });

                const result = await response.json();
                const messageDiv = document.getElementById('response-message');

                if (response.ok) {
                    messageDiv.innerHTML = `<p style="color: green;">Inicio de sesión exitoso</p>`;
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('role', result.role);
                } else {
                    messageDiv.innerHTML = `<p style="color: red;">Error: ${result.message}</p>`;
                }
            } catch (error) {
                const messageDiv = document.getElementById('response-message');
                messageDiv.innerHTML = `<p style="color: red;">Error al iniciar sesión.</p>`;
            }
        });
    });
//gestion de Modulo Usuario
    document.getElementById('users-link').addEventListener('click', async () => {
        const content = document.getElementById('content');
    
        // Verificar el rol del usuario
        if (!['developer', 'admin'].includes(localStorage.getItem('role'))) {
            content.innerHTML = `<p style="color: red;">No tienes permiso para acceder a esta sección</p>`;
            return;
        }
    
        content.innerHTML = `<p>Cargando usuarios...</p>`;
    
        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Enviar el token
                },
            });
    
            const users = await response.json();
    
            if (response.ok) {
                let html = '<h2>Lista de Usuarios</h2><table border="1">';
                // Mostrar botón "Registrar Usuario" solo para desarrolladores
                if (localStorage.getItem('role') === 'developer') {
                    html += `<button id="add-user-btn">Registrar Usuario</button>`;
                }
    
                html += '<table border="1">';
                html += '<tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr>';
                users.forEach(user => {
                    html += `
                        <tr>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td>
                                <button class="edit-user" data-id="${user._id}">Editar</button>
                                <button class="delete-user" data-id="${user._id}">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });
                html += '</table>';
                content.innerHTML = html;
    
                // Evento para registrar un nuevo usuario
                if (localStorage.getItem('role') === 'developer') {
                    document.getElementById('add-user-btn').addEventListener('click', () => {
                        showUserRegistrationForm();
                    });
                }
                
    
                // Añadir eventos para editar y eliminar
                document.querySelectorAll('.edit-user').forEach(button => {
                    button.addEventListener('click', async (e) => {
                        const userId = e.target.getAttribute('data-id'); // Obtener el ID del usuario
                        console.log('ID del usuario a editar:', userId); // Agrega este log para verificar el ID
                        const content = document.getElementById('content');
                        content.innerHTML = `<p>Cargando datos del usuario...</p>`;
                
                        try {
                            // Obtener los datos del usuario desde el backend
                            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                                method: 'GET',
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                                },
                            });
                
                            const user = await response.json();
                
                            if (response.ok) {
                                // Mostrar el formulario de edición con los datos del usuario
                                content.innerHTML = `
                                    <h2>Editar Usuario</h2>
                                    <form id="edit-user-form">
                                        <label for="name">Nombre:</label>
                                        <input type="text" id="name" name="name" value="${user.name}" required><br><br>
                
                                        <label for="email">Correo:</label>
                                        <input type="email" id="email" name="email" value="${user.email}" required><br><br>
                
                                        <label for="role">Rol:</label>
                                        <select id="role" name="role" required>
                                            <option value="developer" ${user.role === 'developer' ? 'selected' : ''}>Developer</option>
                                            <option value="director" ${user.role === 'director' ? 'selected' : ''}>Director</option>
                                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                                            <option value="archiver" ${user.role === 'archiver' ? 'selected' : ''}>Archiver</option>
                                        </select><br><br>
                
                                        <button type="submit">Guardar Cambios</button>
                                    </form>
                                    <div id="response-message"></div>
                                `;
                
                                // Manejar el envío del formulario de edición
                                const form = document.getElementById('edit-user-form');
                                form.addEventListener('submit', async (event) => {
                                    event.preventDefault();
                
                                    const updatedData = {
                                        name: document.getElementById('name').value,
                                        email: document.getElementById('email').value,
                                        role: document.getElementById('role').value,
                                    };
                
                                    try {
                                        // Enviar los datos actualizados al backend
                                        const updateResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                                            },
                                            body: JSON.stringify(updatedData),
                                        });
                
                                        const result = await updateResponse.json();
                                        const messageDiv = document.getElementById('response-message');
                
                                        if (updateResponse.ok) {
                                            messageDiv.innerHTML = `<p style="color: green;">Usuario actualizado con éxito</p>`;
                                        } else {
                                            messageDiv.innerHTML = `<p style="color: red;">Error: ${result.message}</p>`;
                                        }
                                    } catch (error) {
                                        const messageDiv = document.getElementById('response-message');
                                        messageDiv.innerHTML = `<p style="color: red;">Error al actualizar el usuario.</p>`;
                                    }
                                });
                            } else {
                                content.innerHTML = `<p style="color: red;">Error al cargar los datos del usuario</p>`;
                            }
                        } catch (error) {
                            content.innerHTML = `<p style="color: red;">Error al cargar los datos del usuario</p>`;
                        }
                    });
                });
                
    
                document.querySelectorAll('.delete-user').forEach(button => {
                    button.addEventListener('click', async (e) => {
                        const userId = e.target.getAttribute('data-id');
                        const confirmDelete = confirm('¿Estás seguro de eliminar este usuario?');
                        if (confirmDelete) {
                            // Llamar al backend para eliminar el usuario
                            try {
                                const deleteResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
                                    method: 'DELETE',
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                                    },
                                });
    
                                if (deleteResponse.ok) {
                                    alert('Usuario eliminado con éxito');
                                    e.target.closest('tr').remove(); // Quitar la fila de la tabla
                                } else {
                                    alert('Error al eliminar el usuario');
                                }
                            } catch (error) {
                                alert('Error en la solicitud de eliminación');
                            }
                        }
                    });
                });
            } else {
                content.innerHTML = `<p style="color: red;">Error al cargar los usuarios</p>`;
            }
        } catch (error) {
            content.innerHTML = `<p style="color: red;">Error al cargar los usuarios</p>`;
        }
    });
    const showUserRegistrationForm = () => {
        const content = document.getElementById('content');
    
        content.innerHTML = `
            <h2>Registrar Nuevo Usuario</h2>
            <form id="register-user-form">
                <label for="name">Nombre:</label>
                <input type="text" id="name" name="name" required><br><br>
    
                <label for="email">Correo Electrónico:</label>
                <input type="email" id="email" name="email" required><br><br>
    
                <label for="password">Contraseña:</label>
                <input type="password" id="password" name="password" required><br><br>
    
                <label for="role">Rol:</label>
                <select id="role" name="role" required>
                    <option value="developer">Developer</option>
                    <option value="director">Director</option>
                    <option value="admin">Admin</option>
                    <option value="archiver">Archiver</option>
                </select><br><br>
    
                <button type="submit">Registrar Usuario</button>
            </form>
            <div id="response-message"></div>
        `;
    // Función para mostrar el formulario de registro
        const form = document.getElementById('register-user-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
    
            const newUser = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                role: document.getElementById('role').value,
            };
    
            try {
                const response = await fetch('http://localhost:5000/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(newUser),
                });
    
                const result = await response.json();
                const messageDiv = document.getElementById('response-message');
    
                if (response.ok) {
                    messageDiv.innerHTML = `<p style="color: green;">Usuario registrado con éxito</p>`;
                    document.getElementById('users-link').click(); // Volver a la lista de usuarios
                } else {
                    messageDiv.innerHTML = `<p style="color: red;">Error: ${result.message}</p>`;
                }
            } catch (error) {
                const messageDiv = document.getElementById('response-message');
                messageDiv.innerHTML = `<p style="color: red;">Error al registrar el usuario.</p>`;
            }
        });
    };
    
    
});


