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
//cambiar xxxx
        if (response.ok) {
            let html = `
        <div class="container mt-4">
            <h2 class="text-center mb-4">Lista de Funcionarios</h2>
            <div class="text-end mb-3">
                <button id="add-employee-btn" class="btn btn-success">Registrar Nuevo Funcionario</button>
            </div>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>CI</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Unidad</th>
                            <th>Cargo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
            employees.forEach(employee => {
                html += `
                    <tr>
                        <td>${employee.ci}</td>
                        <td>${employee.firstName}</td>
                        <td>${employee.lastName}</td>
                        <td>${employee.unit}</td>
                        <td>${employee.position}</td>
                        <td>
                    <button class="btn btn-warning btn-sm edit-employee" data-id="${employee._id}">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>
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
    <div class="container mt-4">
        <h2 class="text-center mb-4">Registrar Nuevo Funcionario</h2>
        <form id="register-employee-form" class="needs-validation" novalidate>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="ci" class="form-label">Cédula de Identidad:</label>
                    <input type="text" class="form-control" id="ci" name="ci" required>
                </div>
                <div class="col-md-6">
                    <label for="phone" class="form-label">Teléfono:</label>
                    <input type="text" class="form-control" id="phone" name="phone">
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="firstName" class="form-label">Nombres:</label>
                    <input type="text" class="form-control" id="firstName" name="firstName" required>
                </div>
                <div class="col-md-6">
                    <label for="lastName" class="form-label">Apellidos:</label>
                    <input type="text" class="form-control" id="lastName" name="lastName" required>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="position" class="form-label">Cargo:</label>
                    <input type="text" class="form-control" id="position" name="position" required>
                </div>
                <div class="col-md-6">
                    <label for="unit" class="form-label">Unidad:</label>
                    <input type="text" class="form-control" id="unit" name="unit" required>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="startDate" class="form-label">Fecha Inicio:</label>
                    <input type="date" class="form-control" id="startDate" name="startDate" required>
                </div>
                <div class="col-md-6">
                    <label for="endDate" class="form-label">Fecha Fin:</label>
                    <input type="date" class="form-control" id="endDate" name="endDate">
                </div>
            </div>
            <button type="submit" class="btn btn-primary w-100">Registrar Funcionario</button>
        </form>
        <div id="response-message" class="mt-3"></div>
    </div>
`;
// Agrega funcionalidad para enviar datos

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
                messageDiv.innerHTML = `<div class="alert alert-success">Funcionario registrado con éxito</div>`;
                document.getElementById('employees-link').click(); // Recargar la lista de funcionarios
            } else {
                messageDiv.innerHTML = `<div class="alert alert-danger">Error: ${result.message}</div>`;
            }
        } catch (error) {
            const messageDiv = document.getElementById('response-message');
            messageDiv.innerHTML = `<div class="alert alert-danger">Error al registrar el funcionario.</div>`;
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
                <div class="container mt-4">
                    <h2 class="text-center mb-4">Editar Funcionario</h2>
                    <form id="edit-employee-form" class="needs-validation" novalidate>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="ci" class="form-label">Cédula de Identidad:</label>
                                <input type="text" class="form-control" id="ci" name="ci" value="${employee.ci}" required>
                            </div>
                            <div class="col-md-6">
                                <label for="phone" class="form-label">Teléfono:</label>
                                <input type="text" class="form-control" id="phone" name="phone" value="${employee.phone}">
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="firstName" class="form-label">Nombres:</label>
                                <input type="text" class="form-control" id="firstName" name="firstName" value="${employee.firstName}" required>
                            </div>
                            <div class="col-md-6">
                                <label for="lastName" class="form-label">Apellidos:</label>
                                <input type="text" class="form-control" id="lastName" name="lastName" value="${employee.lastName}" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="position" class="form-label">Cargo:</label>
                                <input type="text" class="form-control" id="position" name="position" value="${employee.position}" required>
                            </div>
                            <div class="col-md-6">
                                <label for="unit" class="form-label">Unidad:</label>
                                <input type="text" class="form-control" id="unit" name="unit" value="${employee.unit}" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="startDate" class="form-label">Fecha Inicio:</label>
                                <input type="date" class="form-control" id="startDate" name="startDate" value="${employee.startDate.split('T')[0]}" required>
                            </div>
                            <div class="col-md-6">
                                <label for="endDate" class="form-label">Fecha Fin:</label>
                                <input type="date" class="form-control" id="endDate" name="endDate" value="${employee.endDate ? employee.endDate.split('T')[0] : ''}">
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Guardar Cambios</button>
                    </form>
                    <div id="response-message" class="mt-3"></div>
                </div>
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
                        messageDiv.innerHTML = `<div class="alert alert-success">Funcionario actualizado con éxito</div>`;
                        document.getElementById('employees-link').click(); // Volver a la lista de funcionarios
                    } else {
                        messageDiv.innerHTML = `<div class="alert alert-danger">Error: ${result.message}</div>`;
                    }
                } catch (error) {
                    const messageDiv = document.getElementById('response-message');
                    messageDiv.innerHTML = `<div class="alert alert-danger">Error al actualizar el funcionario.</div>`;
                }
            });
        } else {
            content.innerHTML = `<div class="alert alert-danger">Error al cargar los datos del funcionario.</div>`;
        }
    } catch (error) {
        content.innerHTML = `<div class="alert alert-danger">Error al conectar con el servidor.</div>`;
    }
};

// Navegación: Gestión de Documentosxxxx



// Navegación: Gestión de Documentos
document.getElementById('documents-link').addEventListener('click', async () => {
    const content = document.getElementById('content');

    // Verificar rol
    if (!verifyRole(['developer', 'admin', 'archiver'])) {
        content.innerHTML = `
            <div class="alert alert-danger">No tienes permiso para acceder a esta sección</div>
             `;
        return;
    }
    // Mostrar cargando
    content.innerHTML = `<div class="alert alert-info">Cargando lista de funcionarios y documentos...</div>`;
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
        content.innerHTML = `<div class="alert alert-danger">Error al cargar la lista de documentos</div>`;
        console.error('Error:', error);
    }
});

const showEmployeeDocumentsTable = (employees) => {
    const content = document.getElementById('content');

    let html = `
        <div class="container mt-4">
            <h2 class="text-center mb-4">Gestión de Documentos</h2>
            <table class="table table-striped table-bordered">
                <thead class="thead-dark">
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
                </thead>
                <tbody>
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
                    <button class="btn btn-info btn-sm view-docs" data-id="${employee._id}">Ver</button>
                    <button class="btn btn-success btn-sm upload-docs" 
                    data-id="${employee._id}" 
                    data-name="${employee.firstName}" 
                    data-lastname="${employee.lastName}" 
                    data-ci="${employee.ci}">Subir Documentos</button>
                </td>
            </tr>  
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;
    content.innerHTML = html;
    // Botones "Ver"
    document.querySelectorAll('.view-docs').forEach(button => {
    button.addEventListener('click', async (e) => {
        const employeeId = e.target.getAttribute('data-id');
        console.log('ID recibido:', employeeId);
        
        if (!employeeId) {
            console.error('ID del funcionario no definido.');
            return; // Evita continuar si no hay ID
        }

        try {
            // Obtener datos personales del empleado
            const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener los datos del funcionario.');
            }

            const employee = await response.json();

            // Obtener los documentos del empleado
            const docsResponse = await fetch(`http://localhost:5000/api/documents/employee/${employeeId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!docsResponse.ok) {
                throw new Error('Error al obtener los documentos del funcionario.');
            }

            const docsData = await docsResponse.json(); // Asegúrate de que aquí usas docsData, no data
            console.log('Documentos recibidos:', docsData); // Verifica la estructura de los datos recibidos

            // Ahora pasamos los documentos correctamente a la función
            populateEmployeeDetails(employee, docsData.documents); // Usamos docsData.documents
        } catch (error) {
            console.error('Error al obtener los datos o documentos del funcionario:', error);
            alert('No se pudieron cargar los datos del funcionario o sus documentos.');
        }
    });
});
const populateEmployeeDetails = (employee, documents) => {
    const content = document.getElementById('content');
    let html = `
        <h2>Datos del Funcionario</h2>
        <form>
            <label for="ci">Cédula de Identidad:</label>
            <input type="text" id="ci" value="${employee.ci || ''}" disabled><br>

            <label for="firstName">Nombres:</label>
            <input type="text" id="firstName" value="${employee.firstName || ''}" disabled><br>

            <label for="lastName">Apellidos:</label>
            <input type="text" id="lastName" value="${employee.lastName || ''}" disabled><br>

            <label for="phone">Teléfono:</label>
            <input type="text" id="phone" value="${employee.phone || ''}" disabled><br>

            <label for="position">Cargo:</label>
            <input type="text" id="position" value="${employee.position || ''}" disabled><br>

            <label for="unit">Unidad:</label>
            <input type="text" id="unit" value="${employee.unit || ''}" disabled><br>

            <label for="startDate">Fecha Inicio:</label>
            <input type="date" id="startDate" value="${employee.startDate || ''}" disabled><br>

            <label for="endDate">Fecha Fin:</label>
            <input type="date" id="endDate" value="${employee.endDate || ''}" disabled><br>
        </form>

        <h3>Documentos del Empleado</h3>
        <table>
            <thead>
                <tr>
                    <th>Documento</th>
                    <th>Estado</th>
                    <th>Archivo</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Verifica si documents tiene algún dato
    if (documents && Object.keys(documents).length > 0) {
        // Convertir el objeto 'documents' a un array de entradas (clave-valor)
        const documentsList = Object.entries(documents);

        // Recorrer los documentos y agregar a la tabla
        documentsList.forEach(([docName, docDetails]) => {
            html += `
                <tr>
                    <td><strong>${docName}</strong></td>
                    <td>${docDetails.status}</td>
                    <td>${docDetails.fileName ? `<a href="/uploads/${encodeURIComponent(docDetails.fileName)}" target="_blank">Ver Archivo</a>` : 'No Subido'}</td>
                </tr>
            `;
        });
    } else {
        html += `
            <tr>
                <td colspan="3">No se han encontrado documentos para este empleado.</td>
            </tr>
        `;
    }

    html += `
            </tbody>
        </table>
        <!-- Botón para generar formulario -->
            <div class="form-group">
                <button class="btn btn-primary btn-lg" id="generate-form-button">Generar Formulario</button>
            </div>
    `;
    
    content.innerHTML = html;

    //BOton Generar Un Informe
    
    document.getElementById('generate-form-button').addEventListener('click', () => {
        alert('Formulario generado!');
        // Aquí puedes agregar más lógica para generar un formulario en PDF o lo que necesites.
    });
};

    
    // Asociar eventos a los botones de Subir Documentosxxx
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
// Mostrar formulario de subida de documentos (ahora solo con el mensaje "Bienvenido")xxxx
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
                <h2 class="text-center mb-4 text-primary">Iniciar Sesión</h2>
            <form id="login-form" class="bg-white p-4 rounded shadow">
                <div class="mb-3">
                    <label for="email" class="form-label">Correo:</label>
                    <input type="email" id="email" name="email" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Contraseña:</label>
                    <input type="password" id="password" name="password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Iniciar Sesión</button>
            </form>
            <div id="response-message" class="mt-3"></div>
        </div>
        `;
     //Validacion del incio de sesion en el frontend   
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
//Gestion del Modulo de Usuarios
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
                let html = `
                    <div class="container mt-4">
                        <h2 class="text-center mb-4">Lista de Usuarios</h2>
                             ${
                                localStorage.getItem('role') === 'developer'
                                    ? '<button id="add-user-btn" class="btn btn-success mb-3">Registrar Usuario</button>'
                                    : ''
                             }
                            <table class="table table-striped table-bordered">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Rol</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                            <tbody>
                `;

                users.forEach(user => {
                    html += `
                        <tr>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td>
                                <button class="btn btn-primary btn-sm edit-user" data-id="${user._id}">Editar</button>
                                <button class="btn btn-danger btn-sm delete-user" data-id="${user._id}">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });
                html += `
                            </tbody>
                        </table>
                    </div>
                `;
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
                                    <div class="container mt-4">
                                        <h2 class="text-center mb-4">Editar Usuario</h2>
                                        <form id="edit-user-form" class="needs-validation" novalidate>
                                            <div class="mb-3">
                                                <label for="name" class="form-label">Nombre:</label>
                                                <input type="text" class="form-control" id="name" name="name" value="${user.name}" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="email" class="form-label">Correo Electrónico:</label>
                                                <input type="email" class="form-control" id="email" name="email" value="${user.email}" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="role" class="form-label">Rol:</label>
                                                <select id="role" name="role" class="form-select" required>
                                                    <option value="developer" ${user.role === 'developer' ? 'selected' : ''}>Developer</option>
                                                    <option value="director" ${user.role === 'director' ? 'selected' : ''}>Director</option>
                                                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                                                    <option value="archiver" ${user.role === 'archiver' ? 'selected' : ''}>Archiver</option>
                                                </select>
                                            </div>
                                            <button type="submit" class="btn btn-primary w-100">Guardar Cambios</button>
                                        </form>
                                        <div id="response-message" class="mt-3"></div>
                                    </div>
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
                                            messageDiv.innerHTML = `<div class="alert alert-success">Usuario actualizado con éxito</div>`;
                                        } else {
                                            messageDiv.innerHTML = `<div class="alert alert-danger">Error: ${result.message}</div>`;
                                        }
                                    } catch (error) {
                                        const messageDiv = document.getElementById('response-message');
                                        messageDiv.innerHTML = `<div class="alert alert-danger">Error al actualizar el usuario.</div>`;
                                    }
                                });
                            } else {
                                content.innerHTML = `<div class="alert alert-danger">Error al cargar los datos del usuario</div>`;
                            }
                        } catch (error) {
                            content.innerHTML = `<div class="alert alert-danger">Error al conectar con el servidor</div>`;
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
            <div class="container mt-4">
            <h2 class="text-center mb-4">Registrar Nuevo Usuario</h2>
            <form id="register-user-form" class="needs-validation" novalidate>
                <div class="mb-3">
                    <label for="name" class="form-label">Nombre:</label>
                    <input type="text" class="form-control" id="name" name="name" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Correo Electrónico:</label>
                    <input type="email" class="form-control" id="email" name="email" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Contraseña:</label>
                    <input type="password" class="form-control" id="password" name="password" required>
                </div>
                <div class="mb-3">
                    <label for="role" class="form-label">Rol:</label>
                    <select id="role" name="role" class="form-select" required>
                        <option value="developer">Developer</option>
                        <option value="director">Director</option>
                        <option value="admin">Admin</option>
                        <option value="archiver">Archiver</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary w-100">Registrar Usuario</button>
            </form>
            <div id="response-message" class="mt-3"></div>
        </div>
        `;
    // Agregar Nuevo Usuario
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
                    messageDiv.innerHTML = `<div class="alert alert-success">Usuario registrado con éxito</div>`;
                    document.getElementById('users-link').click(); // Volver a la lista de usuarios
                } else {
                    messageDiv.innerHTML = `<div class="alert alert-danger">Error: ${result.message}</div>`;
                }
            } catch (error) {
                const messageDiv = document.getElementById('response-message');
                messageDiv.innerHTML = `<div class="alert alert-danger">Error al registrar el usuario.</div>`;
            }
        });
    };
    
    
});


