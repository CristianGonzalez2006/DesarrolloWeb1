// Configuración de RapidAPI
const RAPIDAPI_KEY = "7d604c7b14msh11c46d90b8832d4p15a780jsna15322c4dc61";
const RAPIDAPI_HOST = "free-to-play-games-database.p.rapidapi.com";
const BASE_URL = "https://free-to-play-games-database.p.rapidapi.com/api";

const opcionesFetch = {
    method: "GET",
    headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
    },
};

// Referencias del DOM
const contenedorJuegos = document.getElementById("idContenedorJuegos");
const estadoCarga = document.getElementById("idEstadoCarga");
const filtroCategoria = document.getElementById("idFiltroCategoria");
const buscador = document.getElementById("idBuscador");

const modalDetalle = new bootstrap.Modal(document.getElementById("idModalDetalle"));
const modalTitulo = document.getElementById("idModalTitulo");
const modalCuerpo = document.getElementById("idModalCuerpo");
const btnJugar = document.getElementById("idBtnJugar");

let listaJuegosActual = [];

// Función auxiliar para mostrar mensajes de carga o error
const mostrarEstado = (tipo, mensaje) => {
    if (tipo === "cargando") {
        estadoCarga.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2 fw-semibold text-primary">${mensaje}</p>
        `;
    } else if (tipo === "error") {
        estadoCarga.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <strong>Error:</strong> ${mensaje}
            </div>
        `;
    } else {
        estadoCarga.innerHTML = "";
    }
};

// ENDPOINT 1: Obtener listado de recursos (juegos)
const obtenerListadoJuegos = async (categoria = "") => {
    contenedorJuegos.innerHTML = "";
    mostrarEstado("cargando", "Cargando catálogo de videojuegos desde RapidAPI...");

    try {
        const endpoint = categoria
            ? `${BASE_URL}/games?category=${encodeURIComponent(categoria)}`
            : `${BASE_URL}/games`;

        const respuesta = await fetch(endpoint, opcionesFetch);

        if (!respuesta.ok) {
            if (respuesta.status === 401 || respuesta.status === 403) {
                throw new Error("API Key inválida o falta suscribirse al plan gratuito (Basic $0.00) en RapidAPI.");
            }
            throw new Error(`Error HTTP ${respuesta.status} al consultar el listado.`);
        }

        const datos = await respuesta.json();
        listaJuegosActual = Array.isArray(datos) ? datos.slice(0, 24) : [];

        mostrarEstado("limpiar");
        renderizarTarjetas(listaJuegosActual);
    } catch (error) {
        console.error("Error en obtenerListadoJuegos:", error);
        mostrarEstado("error", error.message || "No se pudo conectar con RapidAPI.");
    }
};

// Renderizar dinámicamente las tarjetas en el DOM
const renderizarTarjetas = (juegos) => {
    contenedorJuegos.innerHTML = "";

    if (juegos.length === 0) {
        mostrarEstado("error", "No se encontraron videojuegos que coincidan con tu búsqueda.");
        return;
    }

    mostrarEstado("limpiar");

    juegos.forEach((juego) => {
        const col = document.createElement("div");
        col.className = "col";

        const card = document.createElement("div");
        card.className = "card h-100 shadow-sm game-card";

        card.innerHTML = `
            <img src="${juego.thumbnail}" class="card-img-top" alt="${juego.title}">
            <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title fw-bold mb-0">${juego.title}</h5>
                    <span class="badge bg-primary">${juego.genre}</span>
                </div>
                <p class="card-text text-muted game-description">${juego.short_description}</p>
                <div class="mt-auto pt-3 d-flex justify-content-between align-items-center">
                    <small class="text-secondary">${juego.platform}</small>
                    <button type="button" class="btn btn-outline-dark btn-sm btn-ver-detalle" data-id="${juego.id}">
                        Ver detalles
                    </button>
                </div>
            </div>
        `;

        // Evento para consultar el segundo endpoint sin recargar la página
        const btnDetalle = card.querySelector(".btn-ver-detalle");
        btnDetalle.addEventListener("click", () => {
            obtenerDetalleJuego(juego.id);
        });

        col.appendChild(card);
        contenedorJuegos.appendChild(col);
    });
};

// ENDPOINT 2: Obtener detalle de un recurso seleccionado por su ID
const obtenerDetalleJuego = async (idJuego) => {
    modalTitulo.textContent = "Cargando información...";
    modalCuerpo.innerHTML = `
        <div class="text-center my-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Obteniendo ficha completa del juego...</p>
        </div>
    `;
    btnJugar.classList.add("d-none");
    modalDetalle.show();

    try {
        const endpointDetalle = `${BASE_URL}/game?id=${encodeURIComponent(idJuego)}`;
        const respuesta = await fetch(endpointDetalle, opcionesFetch);

        if (!respuesta.ok) {
            throw new Error(`No se pudieron cargar los detalles (HTTP ${respuesta.status}).`);
        }

        const detalle = await respuesta.json();

        modalTitulo.textContent = detalle.title;
        btnJugar.href = detalle.game_url;
        btnJugar.classList.remove("d-none");

        // Requisitos mínimos (pueden ser null en juegos de navegador)
        const req = detalle.minimum_system_requirements;
        const bloqueRequisitos = req
            ? `
                <h6 class="fw-bold mt-4">Requisitos mínimos del sistema (PC)</h6>
                <ul class="list-group list-group-flush mb-3">
                    <li class="list-group-item"><strong>SO:</strong> ${req.os || "No especificado"}</li>
                    <li class="list-group-item"><strong>Procesador:</strong> ${req.processor || "No especificado"}</li>
                    <li class="list-group-item"><strong>Memoria:</strong> ${req.memory || "No especificado"}</li>
                    <li class="list-group-item"><strong>Gráficos:</strong> ${req.graphics || "No especificado"}</li>
                    <li class="list-group-item"><strong>Almacenamiento:</strong> ${req.storage || "No especificado"}</li>
                </ul>
            `
            : `<p class="text-muted fst-italic mt-3">Este título se ejecuta directamente en navegador y no requiere especificaciones de hardware dedicadas.</p>`;

        // Capturas de pantalla
        const capturasHTML =
            Array.isArray(detalle.screenshots) && detalle.screenshots.length > 0
                ? `
                    <h6 class="fw-bold mt-4">Capturas de pantalla</h6>
                    <div class="row g-2">
                        ${detalle.screenshots
                            .slice(0, 2)
                            .map(
                                (img) => `
                                <div class="col-md-6">
                                    <img src="${img.image}" class="screenshot-img shadow-sm" alt="Captura de ${detalle.title}">
                                </div>
                            `
                            )
                            .join("")}
                    </div>
                `
                : "";

        modalCuerpo.innerHTML = `
            <img src="${detalle.thumbnail}" class="img-fluid rounded mb-3 w-100" alt="${detalle.title}">
            <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="badge bg-primary">${detalle.genre}</span>
                <span class="badge bg-secondary">${detalle.platform}</span>
                <span class="badge bg-info text-dark">Desarrollador: ${detalle.developer}</span>
                <span class="badge bg-dark">Lanzamiento: ${detalle.release_date}</span>
            </div>
            <p>${detalle.description}</p>
            ${bloqueRequisitos}
            ${capturasHTML}
        `;
    } catch (error) {
        console.error("Error en obtenerDetalleJuego:", error);
        modalTitulo.textContent = "Error al cargar detalle";
        modalCuerpo.innerHTML = `
            <div class="alert alert-danger mb-0">
                ${error.message || "Ocurrió un problema al consultar el detalle del juego."}
            </div>
        `;
    }
};

// Eventos de filtrado y búsqueda en tiempo real
filtroCategoria.addEventListener("change", (e) => {
    buscador.value = "";
    obtenerListadoJuegos(e.target.value);
});

buscador.addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase().trim();
    const filtrados = listaJuegosActual.filter((juego) =>
        juego.title.toLowerCase().includes(texto)
    );
    renderizarTarjetas(filtrados);
});

// Cargar el listado inicial al abrir la página
document.addEventListener("DOMContentLoaded", () => {
    obtenerListadoJuegos();
});