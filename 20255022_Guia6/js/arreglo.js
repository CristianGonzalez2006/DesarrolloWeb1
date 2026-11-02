// Accedemos al contenedor donde se mostrara el arreglo
const containerArreglo = document.querySelector("#idContainerArreglo");
const containerArregloOrdenado = document.querySelector("#idContainerArregloOrdenado");

// Accedemos a cada boton por medio de la API DOM
const btnAgregar = document.querySelector("#idBtnAgregar");
const btnOrdenar = document.querySelector("#idBtnOrdenar");

// Agregamos el evento click a los botones y asignamos funciones
btnAgregar.addEventListener("click", agregarElemento);
btnOrdenar.addEventListener("click", ordenarElementos);

let arreglo = new Array();

function agregarElemento() {
  const numero = parseInt(document.querySelector("#inputNumero").value);
  
  // verificando que sea un numero
  if (isNaN(numero)) {
    alert("Debe ingresar un numero válido");
  } else {
    // Agregamos un nuevo elemento al arreglo
    arreglo.push(numero);

    // Utilizaremos la API DOM para crear un elemento html
    let caja = document.createElement("div"); // Creamos un elemento div
    caja.className = "col-md-1 colum"; // Agregamos una clase al elemento div
    
    let valor = document.createElement("h3"); // Creamos un elemento h3
    valor.textContent = numero; // Agrégamos texto al elemento h3
    
    caja.appendChild(valor); // Le pasamos como hijo la etiqueta h3 a nuestro div

    // Insertamos los nuevos elementos en el contenedor
    containerArreglo.insertAdjacentElement("beforeend", caja);
  }
}

function ordenarElementos() {
  // Limpiar contenedor antes de mostrar los ordenados para que no se dupliquen
  containerArregloOrdenado.innerHTML = "<h3>Arreglo ordenado</h3>";

  // Utilizamos el método sort() pero pasándole una función de comparación 
  // para que ordene numéricamente y no como texto.
  let arregloOrdenado = [...arreglo].sort((a, b) => a - b);

  for (let i of arregloOrdenado) {
    let caja = document.createElement("div");
    caja.className = "col-md-1 colum-green";
    
    let valor = document.createElement("h3");
    valor.textContent = i;
    
    caja.appendChild(valor);
    containerArregloOrdenado.insertAdjacentElement("beforeend", caja);
  }
}