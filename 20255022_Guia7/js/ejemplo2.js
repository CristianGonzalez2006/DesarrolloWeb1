// Referencias al formulario, botón y modal
const formulario = document.forms["frmRegistro"];
const button = document.forms["frmRegistro"].elements["btnRegistro"];
const modal = new bootstrap.Modal(document.getElementById("idModal"), {});
const bodyModal = document.getElementById("idBodyModal");
const modalLabel = document.getElementById("modalLabel");

// Función para validar todos los campos del formulario
const validarFormulario = function () {
    const errores = [];

    // 1. Obtener valores de los controles
    const nombre = document.getElementById("idNombre").value.trim();
    const apellidos = document.getElementById("idApellidos").value.trim();
    const fechaNac = document.getElementById("idFechaNac").value;
    const correo = document.getElementById("idCorreo").value.trim();
    const password = document.getElementById("idPassword").value;
    const passwordRepetir = document.getElementById("idPasswordRepetir").value;
    const selectPais = document.getElementById("idCmPais");
    const archivo = document.getElementById("idArchivo");

    // a. Validar que los campos no estén vacíos
    if (nombre === "") {
        errores.push("El campo Nombres es obligatorio.");
    }
    if (apellidos === "") {
        errores.push("El campo Apellidos es obligatorio.");
    }
    if (fechaNac === "") {
        errores.push("Debe seleccionar una fecha de nacimiento.");
    }
    if (correo === "") {
        errores.push("El campo Correo electrónico es obligatorio.");
    }
    if (password === "") {
        errores.push("El campo Contraseña es obligatorio.");
    }
    if (passwordRepetir === "") {
        errores.push("El campo Repetir Contraseña es obligatorio.");
    }
    if (archivo.files.length === 0) {
        errores.push("Debe seleccionar una imagen para su avatar.");
    }

    // b. Validar que la fecha de nacimiento no supere la fecha actual
    if (fechaNac !== "") {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, "0");
        const dd = String(hoy.getDate()).padStart(2, "0");
        const fechaActual = `${yyyy}-${mm}-${dd}`;

        if (fechaNac > fechaActual) {
            errores.push("La fecha de nacimiento no puede superar la fecha actual.");
        }
    }

    // c. Validar correo electrónico con expresión regular
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (correo !== "" && !regexCorreo.test(correo)) {
        errores.push("El formato del correo electrónico no es válido.");
    }

    // d. Validar que contraseña y repetir contraseña sean iguales
    if (password !== "" && passwordRepetir !== "" && password !== passwordRepetir) {
        errores.push("Las contraseñas no coinciden.");
    }

    // e. Verificar que esté seleccionada al menos una opción de "algunos intereses"
    const checkboxesIntereses = document.querySelectorAll('input[type="checkbox"]:checked');
    const interesesSeleccionados = [];
    checkboxesIntereses.forEach((chk) => {
        const label = document.querySelector(`label[for="${chk.id}"]`);
        if (label) {
            interesesSeleccionados.push(label.textContent.trim());
        }
    });

    if (interesesSeleccionados.length === 0) {
        errores.push("Debe seleccionar al menos un interés.");
    }

    // f. Verificar que el usuario seleccione una carrera
    const radioCarrera = document.querySelector('input[name="idRdCarrera"]:checked');
    let carreraTexto = "";
    if (!radioCarrera) {
        errores.push("Debe seleccionar una carrera.");
    } else {
        const labelCarrera = document.querySelector(`label[for="${radioCarrera.id}"]`);
        carreraTexto = labelCarrera ? labelCarrera.textContent.trim() : "";
    }

    // g. Verificar que sea seleccionado un país de origen
    let paisTexto = "";
    if (selectPais.selectedIndex === 0) {
        errores.push("Debe seleccionar un país de origen.");
    } else {
        paisTexto = selectPais.options[selectPais.selectedIndex].text;
    }

    // Si hay errores, mostrar alerta y detener ejecución
    if (errores.length > 0) {
        alert("Corrija los siguientes errores antes de continuar:\n\n• " + errores.join("\n• "));
        return;
    }

    // Si todo es válido, construir la tabla usando exclusivamente métodos del DOM
    mostrarTablaDOM({
        nombre,
        apellidos,
        fechaNac,
        correo,
        intereses: interesesSeleccionados.join(", "),
        carrera: carreraTexto,
        pais: paisTexto,
        avatar: archivo.files[0].name,
    });
};

// Función para crear la tabla en el modal SIN usar innerHTML
const mostrarTablaDOM = function (datos) {
    // Limpiar el contenido previo del modal eliminando sus nodos hijos
    while (bodyModal.firstChild) {
        bodyModal.removeChild(bodyModal.firstChild);
    }

    // Actualizar título del modal usando textContent
    modalLabel.textContent = "Información Registrada";

    // Crear estructura de la tabla con createElement y setAttribute
    const tabla = document.createElement("table");
    tabla.setAttribute("class", "table table-striped table-bordered align-middle mb-0");

    const thead = document.createElement("thead");
    thead.setAttribute("class", "table-dark");

    const trHead = document.createElement("tr");
    const thCampo = document.createElement("th");
    thCampo.appendChild(document.createTextNode("Campo"));

    const thValor = document.createElement("th");
    thValor.appendChild(document.createTextNode("Valor"));

    trHead.appendChild(thCampo);
    trHead.appendChild(thValor);
    thead.appendChild(trHead);
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");

    const filas = [
        ["Nombres", datos.nombre],
        ["Apellidos", datos.apellidos],
        ["Fecha de nacimiento", datos.fechaNac],
        ["Correo electrónico", datos.correo],
        ["Intereses", datos.intereses],
        ["Carrera", datos.carrera],
        ["País de origen", datos.pais],
        ["Archivo de avatar", datos.avatar],
    ];

    filas.forEach(([campo, valor]) => {
        const tr = document.createElement("tr");

        const tdCampo = document.createElement("td");
        tdCampo.setAttribute("class", "fw-bold");
        tdCampo.appendChild(document.createTextNode(campo));

        const tdValor = document.createElement("td");
        tdValor.appendChild(document.createTextNode(valor));

        tr.appendChild(tdCampo);
        tr.appendChild(tdValor);
        tbody.appendChild(tr);
    });

    tabla.appendChild(tbody);
    bodyModal.appendChild(tabla);

    // Mostrar el modal de Bootstrap
    modal.show();
};

// Evento clic del botón Enviar registro
button.onclick = () => {
    validarFormulario();
};