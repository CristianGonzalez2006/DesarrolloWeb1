// Acceder al elemento HTML utilizando getElementById
const campo = document.getElementById("idTxtNumero");

// Definimos una funcion anonima que permita validar en tiempo real el ingreso de un numero
const validarNumero = function (e) {
  // Creamos una expresion regular que valida que sean numeros (del 0 al 9)
  let validar = /^[0-9]$/;
  let tecla = e.key;

  // test valida que la expresión regular coincida con el valor ingresado
  // si intentas teclear una letra, el preventDefault evita que se escriba
  if (!validar.test(tecla)) e.preventDefault();
};

// Definiendo el evento keypress para el campo
campo.addEventListener("keypress", validarNumero);

// Trabajando con el boton Calcular
const boton = document.getElementById("idBtnCalcular");

// Definiendo una funcion tradicional para calcular el factorial de un numero usando recursividad
function calcularFactorial(numero) {
  return numero < 2 ? 1 : numero * calcularFactorial(numero - 1);
}

// Definimos una funcion de tipo flecha para imprimir el resultado del factorial
const imprimir = (numero, resultado) => {
  const contenedor = document.getElementById("idDivResultado");
  contenedor.innerHTML = `El factorial de ${numero} es ${resultado}`;
};

// Definiendo una funcion tradicional
function calcular() {
  let numero = document.getElementById("idTxtNumero").value;
  
  if (numero >= 1) {
    // Llamamos a la funcion para que calcule el factorial
    let resultado = calcularFactorial(numero);
    // Enviando el resultado a la funcion de tipo flecha
    imprimir(numero, resultado);
  } else {
    alert("Debe ingresar un numero válido mayor a 0");
  }
}

// Definiendo el evento click para el boton
boton.addEventListener("click", calcular);