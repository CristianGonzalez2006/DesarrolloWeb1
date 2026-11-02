document.addEventListener("DOMContentLoaded", () => {
  const btnValidar = document.getElementById("btnValidar");
  const alerta = document.getElementById("idAlerta");

  btnValidar.addEventListener("click", () => {
    // 1. Obtener valores de los inputs
    const carnet = document.getElementById("txtCarnet").value.trim();
    const nombre = document.getElementById("txtNombre").value.trim();
    const dui = document.getElementById("txtDUI").value.trim();
    const nit = document.getElementById("txtNIT").value.trim();
    const fecha = document.getElementById("txtFecha").value.trim();
    const correo = document.getElementById("txtCorreo").value.trim();
    const edad = document.getElementById("txtEdad").value.trim();

    // 2. Definir las Expresiones Regulares (Regex) según la guía
    const regexCarnet = /^[A-Za-z]{2}\d{3}$/; // 2 letras seguidas de 3 números
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Letras (incluyendo tildes y ñ) y espacios
    const regexDUI = /^\d{8}-\d{1}$/; // 8 números, guion, 1 número
    const regexNIT = /^\d{4}-\d{6}-\d{3}-\d{1}$/; // ####-######-###-#
    const regexFecha = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/; // DD/MM/AAAA
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Formato estándar de email
    const regexEdad = /^\d+$/; // Solo números

    // 3. Arreglo para guardar los errores
    let errores = [];

    // 4. Validar cada campo
    if (!regexCarnet.test(carnet)) {
      errores.push("El <b>Carnet</b> debe tener 2 letras y 3 números (Ej: AB001).");
    }
    if (!regexNombre.test(nombre) || nombre === "") {
      errores.push("El <b>Nombre</b> solo debe contener letras y espacios.");
    }
    if (!regexDUI.test(dui)) {
      errores.push("El <b>DUI</b> debe tener el formato ########-#.");
    }
    if (!regexNIT.test(nit)) {
      errores.push("El <b>NIT</b> debe tener el formato ####-######-###-#.");
    }
    if (!regexFecha.test(fecha)) {
      errores.push("La <b>Fecha</b> debe tener el formato DD/MM/AAAA (Ej: 25/10/2005).");
    }
    if (!regexCorreo.test(correo)) {
      errores.push("El <b>Correo</b> no es válido.");
    }
    if (!regexEdad.test(edad)) {
      errores.push("La <b>Edad</b> solo debe contener números.");
    }

    // 5. Mostrar resultados en el contenedor de alerta
    alerta.classList.remove("d-none"); // Hacemos visible la alerta

    if (errores.length > 0) {
      // Si hay errores, mostramos una alerta roja con la lista de fallos
      alerta.classList.remove("alert-success");
      alerta.classList.add("alert-danger");
      
      let listaErrores = "<ul class='mb-0'>";
      errores.forEach(error => {
        listaErrores += `<li>${error}</li>`;
      });
      listaErrores += "</ul>";

      alerta.innerHTML = `<strong>¡Hay errores en el formulario!</strong>${listaErrores}`;
    } else {
      // Si todo está perfecto, mostramos alerta verde
      alerta.classList.remove("alert-danger");
      alerta.classList.add("alert-success");
      alerta.innerHTML = `<i class="bi bi-check-circle-fill"></i> <strong>¡Éxito!</strong> Todos los datos tienen el formato correcto.`;
    }
  });
});