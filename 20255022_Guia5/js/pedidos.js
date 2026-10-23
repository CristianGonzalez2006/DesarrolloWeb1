let pedidos = [];
const formPedido = document.querySelector("#formPedido");
const inputProducto = document.querySelector("#inputProducto");
const inputPrecio = document.querySelector("#inputPrecio");
const inputCantidad = document.querySelector("#inputCantidad");
const inputFiltroPrecio = document.querySelector("#inputFiltroPrecio");
const tablaCuerpo = document.querySelector("#tablaCuerpo");
const labelTotalUnidades = document.querySelector("#totalUnidades");
const labelMontoTotal = document.querySelector("#montoTotal");
const btnFiltrar = document.querySelector("#btnFiltrar");
const btnMostrarTodos = document.querySelector("#btnMostrarTodos");
const btnLimpiar = document.querySelector("#btnLimpiar");
function renderizarTabla(arregloRender) {
    const filasHTML = arregloRender.map(pedido => {
        const subtotal = pedido.precio * pedido.cantidad;
        return `
            <tr>
                <td>${pedido.producto}</td>
                <td>$${pedido.precio.toFixed(2)}</td>
                <td>${pedido.cantidad}</td>
                <td>$${subtotal.toFixed(2)}</td>
            </tr>
        `;
    }).join(""); 
    tablaCuerpo.innerHTML = filasHTML;
    actualizarTotales(arregloRender);
}
function actualizarTotales(arregloCalcular) {
    const totalUnidades = arregloCalcular.reduce((acumulador, pedido) => acumulador + pedido.cantidad, 0);
    const montoTotal = arregloCalcular.reduce((acumulador, pedido) => acumulador + (pedido.precio * pedido.cantidad), 0);
    labelTotalUnidades.textContent = totalUnidades;
    labelMontoTotal.textContent = montoTotal.toFixed(2);
}
function agregarPedido(evento) {
    evento.preventDefault(); 
    const producto = inputProducto.value.trim();
    const precio = parseFloat(inputPrecio.value);
    const cantidad = Number(inputCantidad.value); 
    if (producto === "") {
        alert("El nombre del producto no puede estar vacío.");
        return;
    }
    if (isNaN(precio) || precio <= 0) {
        alert("El precio debe ser un número mayor a cero.");
        return;
    }
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        alert("La cantidad debe ser un número entero positivo.");
        return;
    }
    const nuevoPedido = { producto, precio, cantidad };
    pedidos.push(nuevoPedido);
    formPedido.reset();
    renderizarTabla(pedidos);
}
function filtrarPedidos() {
    const precioMax = parseFloat(inputFiltroPrecio.value);
    if (isNaN(precioMax) || precioMax < 0) {
        alert("Ingrese un precio máximo válido para filtrar.");
        return;
    }
    const pedidosFiltrados = pedidos.filter(pedido => pedido.precio <= precioMax);
    renderizarTabla(pedidosFiltrados);
}
function mostrarTodos() {
    inputFiltroPrecio.value = "";
    renderizarTabla(pedidos);
}
function limpiarPedidos() {
    pedidos = []; 
    renderizarTabla(pedidos);
}
formPedido.addEventListener("submit", agregarPedido);
btnFiltrar.addEventListener("click", filtrarPedidos);
btnMostrarTodos.addEventListener("click", mostrarTodos);
btnLimpiar.addEventListener("click", limpiarPedidos);