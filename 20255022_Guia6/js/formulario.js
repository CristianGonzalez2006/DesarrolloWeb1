// Accediendo a los elementos html
const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const notificacion = document.getElementById("idNotificacion");
const mensaje = document.getElementById("idMensaje");
const idModal = document.getElementById("idModal");

// Componente de Bootstrap Toast
const toast = new bootstrap.Toast(notificacion);

// ==========================================
// SOLUCIÓN EJERCICIO 2: LOCALSTORAGE
// ==========================================
// Intentamos leer los pacientes guardados. Si no hay, iniciamos un arreglo vacío.
let arrayPaciente = JSON.parse(localStorage.getItem("pacientes")) || [];
let editIndex = -1; // -1 significa que estamos creando uno nuevo, no editando

// Función para limpiar el formulario
const limpiarForm = () => {
  inputNombre.value = "";
  inputApellido.value = "";
  inputFechaNacimiento.value = "";
  inputRdMasculino.checked = false;
  inputRdFemenino.checked = false;
  cmbPais.value = 0;
  inputDireccion.value = "";
  inputNombrePais.value = "";
  inputNombre.focus();
  
  // Regresar el botón a su estado original por si estábamos editando
  editIndex = -1;
  buttonAgregarPaciente.innerHTML = '<i class="bi bi-person-plus-fill"></i> Guardar Datos';
  buttonAgregarPaciente.classList.replace("btn-primary", "btn-success");
};

// Función para validar el ingreso del paciente
const addPaciente = function () {
  let nombre = inputNombre.value;
  let apellido = inputApellido.value;
  let fechaNacimiento = inputFechaNacimiento.value;
  let sexo = inputRdMasculino.checked ? "Hombre" : inputRdFemenino.checked ? "Mujer" : "";
  let pais = cmbPais.value;
  let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
  let direccion = inputDireccion.value;

  if (
    nombre != "" &&
    apellido != "" &&
    fechaNacimiento != "" &&
    sexo != "" &&
    pais != 0 &&
    direccion != ""
  ) {
    if (editIndex === -1) {
      // Guardar nuevo paciente
      arrayPaciente.push([nombre, apellido, fechaNacimiento, sexo, labelPais, direccion]);
      mensaje.innerHTML = "Se ha registrado un nuevo paciente";
    } else {
      // Actualizar paciente existente
      arrayPaciente[editIndex] = [nombre, apellido, fechaNacimiento, sexo, labelPais, direccion];
      mensaje.innerHTML = "Paciente actualizado correctamente";
    }
    
    // Guardar en LocalStorage
    localStorage.setItem("pacientes", JSON.stringify(arrayPaciente));
    
    notificacion.classList.remove("text-bg-danger");
    notificacion.classList.add("text-bg-success");
    toast.show();
    limpiarForm();
    imprimirPacientes(); // Refrescar la tabla
  } else {
    mensaje.innerHTML = "Faltan campos por completar";
    notificacion.classList.remove("text-bg-success");
    notificacion.classList.add("text-bg-danger");
    toast.show();
  }
};

// ==========================================
// SOLUCIÓN EJERCICIO 1: EDITAR Y ELIMINAR
// ==========================================
// Funciones globales para que los botones de la tabla las reconozcan
window.editarPaciente = function (index) {
  let pac = arrayPaciente[index];
  inputNombre.value = pac[0];
  inputApellido.value = pac[1];
  inputFechaNacimiento.value = pac[2];
  
  if (pac[3] === "Hombre") {
    inputRdMasculino.checked = true;
  } else if (pac[3] === "Mujer") {
    inputRdFemenino.checked = true;
  }
  
  // Buscar el país en el select y seleccionarlo
  for(let i=0; i < cmbPais.options.length; i++) {
    if(cmbPais.options[i].text === pac[4]) {
      cmbPais.selectedIndex = i;
      break;
    }
  }
  
  inputDireccion.value = pac[5];
  
  // Cambiar el estado de la variable y del botón
  editIndex = index;
  buttonAgregarPaciente.innerHTML = '<i class="bi bi-pencil-square"></i> Actualizar Datos';
  buttonAgregarPaciente.classList.replace("btn-success", "btn-primary");
};

window.eliminarPaciente = function (index) {
  if (confirm("¿Estás seguro de eliminar este paciente?")) {
    arrayPaciente.splice(index, 1); // Lo borra del arreglo
    localStorage.setItem("pacientes", JSON.stringify(arrayPaciente)); // Actualiza el LocalStorage
    imprimirPacientes(); // Refresca la tabla
    
    mensaje.innerHTML = "Paciente eliminado correctamente";
    notificacion.classList.remove("text-bg-danger");
    notificacion.classList.add("text-bg-success");
    toast.show();
  }
};

// Funcion que imprime la ficha de los pacientes registrados
function imprimirFilas() {
  let fila = "";
  let contador = 1;

  arrayPaciente.forEach((element, index) => {
    fila += `<tr>
      <td scope="row" class="text-center fw-bold">${contador}</td>
      <td>${element[0]}</td>
      <td>${element[1]}</td>
      <td>${element[2]}</td>
      <td>${element[3]}</td>
      <td>${element[4]}</td>
      <td>${element[5]}</td>
      <td>
        <!-- Se agregaron los eventos onclick -->
        <button onclick="editarPaciente(${index})" type="button" class="btn btn-primary btn-sm" title="Editar">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button onclick="eliminarPaciente(${index})" type="button" class="btn btn-danger btn-sm" title="Eliminar">
          <i class="bi bi-trash3-fill"></i>
        </button>
      </td>
    </tr>`;
    contador++;
  });
  return fila;
}

const imprimirPacientes = () => {
  let table = `<div class="table-responsive">
    <table class="table table-striped table-hover table-bordered">
      <thead>
        <tr>
          <th scope="col" class="text-center" style="width:5%">#</th>
          <th scope="col" class="text-center" style="width:15%">Nombre</th>
          <th scope="col" class="text-center" style="width:15%">Apellido</th>
          <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
          <th scope="col" class="text-center" style="width:10%">Sexo</th>
          <th scope="col" class="text-center" style="width:10%">Pais</th>
          <th scope="col" class="text-center" style="width:25%">Dirección</th>
          <th scope="col" class="text-center" style="width:10%">Opciones</th>
        </tr>
      </thead>
      <tbody>
        ${imprimirFilas()}
      </tbody>
    </table>
  </div>`;
  document.getElementById("idTablaPacientes").innerHTML = table;
};

// Contador global de los option correspondiente al select (cmb) pais
let contadorGlobalOption = cmbPais.children.length;
const addPais = () => {
  let paisNew = inputNombrePais.value;
  if (paisNew != "") {
    let option = document.createElement("option");
    option.textContent = paisNew;
    option.value = contadorGlobalOption + 1;
    cmbPais.appendChild(option);
    
    mensaje.innerHTML = "País agregado correctamente";
    notificacion.classList.remove("text-bg-danger");
    notificacion.classList.add("text-bg-success");
    toast.show();
  } else {
    mensaje.innerHTML = "Faltan campos por completar";
    notificacion.classList.remove("text-bg-success");
    notificacion.classList.add("text-bg-danger");
    toast.show();
  }
};

// Agregando eventos a los botones
buttonLimpiarPaciente.onclick = () => {
  limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
  addPaciente();
};

buttonMostrarPaciente.onclick = () => {
  imprimirPacientes();
};

buttonAgregarPais.onclick = () => {
  addPais();
};

idModal.addEventListener("shown.bs.modal", () => {
  inputNombrePais.value = "";
  inputNombrePais.focus();
});

// Al cargar la página mostramos los que ya estén guardados en LocalStorage
limpiarForm();
imprimirPacientes();