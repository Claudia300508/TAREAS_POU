/* ======================================
   2. DATOS DE ENTRADA (LIBRERÍA)
   ====================================== */
let inventario = [
    { id: 1, nombre: "El Nombre del Viento", categoria: "Fantasía", cantidad: 7, precio: 22.50, agotado: false },
    { id: 2, nombre: "Trilogía: Las Cadenas del Rey", categoria: "Fantasía", cantidad: 0, precio: 35.00, agotado: true },
    { id: 3, nombre: "La Chica del Tren", categoria: "Suspenso", cantidad: 5, precio: 19.99, agotado: false },
    { id: 4, nombre: "El Psicoanalista", categoria: "Suspenso", cantidad: 10, precio: 21.00, agotado: false },
    { id: 5, nombre: "Código Limpio (Clean Code)", categoria: "Programación", cantidad: 12, precio: 45.00, agotado: false },
    { id: 6, nombre: "Heist", categoria: "Dark Romance y Fantasía", cantidad: 0, precio: 48.50, agotado: true },
    { id: 7, nombre: "Cien Años de Soledad", categoria: "Ficción", cantidad: 8, precio: 18.00, agotado: false },
    { id: 8, nombre: "Ciudades de Humo", categoria: "Fantasía", cantidad: 14, precio: 20.00, agotado: false }
];

/* ==============================
   3. FUNCIONES REQUERIDAS 
   ============================== */

// Generador de ID mediante closure (comienza en 100)
function crearGeneradorId() {
    let ultimoId = 99;
    return function() {
        ultimoId++;
        return ultimoId;
    };
}

// Calcular la suma de cantidad * precio utilizando un bucle for plano
function calcularValorTotal(items) {
    let suma = 0;
    for (let i = 0; i < items.length; i++) {
        suma += items[i].cantidad * items[i].precio;
    }
    return suma;
}

// Contar el total de unidades utilizando un bucle for plano
function contarUnidades(items) {
    let totalUnidades = 0;
    for (let i = 0; i < items.length; i++) {
        totalUnidades += items[i].cantidad;
    }
    return totalUnidades;
}

// Contar productos por categoría usando un bucle for plano
function contarPorCategoria(items) {
    let conteo = {};
    for (let i = 0; i < items.length; i++) {
        let cat = items[i].categoria;
        conteo[cat] = (conteo[cat] || 0) + 1;
    }
    return conteo;
}

// Crear celda segura con textContent
function crearCelda(texto) {
    let td = document.createElement("td");
    td.textContent = texto;
    return td;
}

// Crear fila completa del libro con nodos seguros
function crearFila(item) {
    let tr = document.createElement("tr");
    
    if (item.agotado) {
        tr.classList.add("fila-agotado");
    }

    tr.appendChild(crearCelda(item.nombre));
    tr.appendChild(crearCelda(item.categoria));
    tr.appendChild(crearCelda(item.cantidad));
    tr.appendChild(crearCelda(`$${item.precio.toFixed(2)}`));
    
    let subtotal = item.cantidad * item.precio;
    tr.appendChild(crearCelda(`$${subtotal.toFixed(2)}`));

    // Celda de Estado
    let tdEstado = document.createElement("td");
    let spanEstado = document.createElement("span");
    spanEstado.textContent = item.agotado ? "Agotado" : "Disponible";
    spanEstado.className = item.agotado ? "badge-estado badge-agotado" : "badge-estado badge-disponible";
    tdEstado.appendChild(spanEstado);
    tr.appendChild(tdEstado);

    // Celda de Acciones
    let tdAcciones = document.createElement("td");
    
    let btnEstado = document.createElement("button");
    btnEstado.textContent = "Cambiar Estado";
    btnEstado.className = "btn-estado";
    btnEstado.setAttribute("data-id", item.id);

    let btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "btn-eliminar";
    btnEliminar.setAttribute("data-id", item.id);

    tdAcciones.appendChild(btnEstado);
    tdAcciones.appendChild(btnEliminar);
    tr.appendChild(tdAcciones);

    return tr;
}

// Renderizar tabla e indicadores de forma limpia
function renderizar(items) {
    let tbody = document.getElementById("cuerpo-inventario");
    let mensajeVacio = document.getElementById("mensaje-vacio");
    
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    if (items.length === 0) {
        mensajeVacio.classList.remove("oculto");
        actualizarIndicadores(items);
        return; // Salida temprana (Early Return)
    }

    mensajeVacio.classList.add("oculto");
    for (let i = 0; i < items.length; i++) {
        let fila = crearFila(items[i]);
        tbody.appendChild(fila);
    }

    actualizarIndicadores(items);
}

// Función auxiliar para actualizar indicadores (Single Responsibility)
function actualizarIndicadores(items) {
    document.getElementById("total-productos").textContent = items.length;
    document.getElementById("total-unidades").textContent = contarUnidades(items);
    document.getElementById("valor-total").textContent = `$${calcularValorTotal(items).toFixed(2)}`;
    
    let agotadosCount = 0;
    for (let i = 0; i < items.length; i++) {
        if (items[i].agotado) agotadosCount++;
    }
    document.getElementById("total-agotados").textContent = agotadosCount;
}

// Filtrar por categoría sin modificar el inventario original
function filtrarPorCategoria(categoriaSeleccionada) {
    if (categoriaSeleccionada === "todas") return inventario;

    let filtrados = [];
    for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].categoria.toLowerCase() === categoriaSeleccionada.toLowerCase()) {
            filtrados.push(inventario[i]);
        }
    }
    return filtrados;
}

// Validación estricta del producto con lanzamiento de errores
function validarProducto(datos) {
    if (!datos.nombre || datos.nombre.trim() === "") {
        throw new Error("El título del libro no puede estar vacío.");
    }
    if (!datos.categoria || datos.categoria.trim() === "") {
        throw new Error("La categoría no puede estar vacía.");
    }
    if (isNaN(datos.cantidad) || datos.cantidad <= 0 || !Number.isInteger(Number(datos.cantidad))) {
        throw new Error("La cantidad debe ser un número entero mayor que cero.");
    }
    if (isNaN(datos.precio) || Number(datos.precio) < 0) {
        throw new Error("El precio debe ser un número mayor o igual a cero.");
    }
}

// Eliminar libro devolviendo un nuevo array
function eliminarProducto(id) {
    let nuevoInventario = [];
    for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].id !== id) {
            nuevoInventario.push(inventario[i]);
        }
    }
    return nuevoInventario;
}

// Cambiar estado
function cambiarEstado(id) {
    for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].id === id) {
            inventario[i].agotado = !inventario[i].agotado;
            break;
        }
    }
}

/* ==================================================
   4. FLUJO PRINCIPAL E INICIALIZACIÓN
   ================================================== */
const obtenerSiguienteId = crearGeneradorId();

function categoriaYaExiste(categorias, categoria) {
    for (let i = 0; i < categorias.length; i++) {
        if (categorias[i].toLowerCase() === categoria.toLowerCase()) return true;
    }
    return false;
}

function inicializarFiltros() {
    let selectFiltro = document.getElementById("filtro-categoria");
    let categoriasUnicas = [];
    
    for (let i = 0; i < inventario.length; i++) {
        let cat = inventario[i].categoria;
        if (!categoriaYaExiste(categoriasUnicas, cat)) {
            categoriasUnicas.push(cat);
        }
    }

    selectFiltro.innerHTML = '<option value="todas">Todas</option>';
    
    for (let i = 0; i < categoriasUnicas.length; i++) {
        let option = document.createElement("option");
        option.value = categoriasUnicas[i];
        option.textContent = categoriasUnicas[i];
        selectFiltro.appendChild(option);
    }
}

// Manejador del envío del formulario (Alta)
function agregarProducto(event) {
    event.preventDefault();
    let divError = document.getElementById("mensaje-error");
    divError.classList.add("oculto");
    divError.textContent = "";

    try {
        let nombreInput = document.getElementById("nombre").value.trim();
        let categoriaInput = document.getElementById("categoria").value.trim();
        let cantidadInput = Number(document.getElementById("formulario-producto").querySelector("#cantidad").value);
        let precioInput = Number(document.getElementById("formulario-producto").querySelector("#precio").value);

        let datosNuevos = { nombre: nombreInput, categoria: categoriaInput, cantidad: cantidadInput, precio: precioInput };
        validarProducto(datosNuevos);

        let nuevoItem = {
            id: obtenerSiguienteId(),
            nombre: nombreInput,
            categoria: categoriaInput,
            cantidad: cantidadInput,
            precio: precioInput,
            agotado: cantidadInput === 0
        };

        inventario.push(nuevoItem);
        inicializarFiltros();

        let categoriaActual = document.getElementById("filtro-categoria").value;
        renderizar(filtrarPorCategoria(categoriaActual));

        document.getElementById("formulario-producto").reset();

        console.log("ALTA EXITOSA - Libro agregado:", nuevoItem);
        console.table(inventario);

    } catch (error) {
        console.error("Error de validación o alta:", error.message);
        divError.textContent = error.message;
        divError.classList.remove("oculto");
    }
}

function manejarEliminacion(id) {
    inventario = eliminarProducto(id);
    inicializarFiltros();
    
    let categoriaActual = document.getElementById("filtro-categoria").value;
    let filtrados = filtrarPorCategoria(categoriaActual);
    
    if (filtrados.length === 0 && categoriaActual !== "todas") {
        document.getElementById("filtro-categoria").value = "todas";
        filtrados = inventario;
    }
    
    renderizar(filtrados);
    console.log(`BAJA EXITOSA - Libro con ID ${id} eliminado.`);
    console.table(inventario);
}

function manejarCambioEstado(id) {
    cambiarEstado(id);
    let categoriaActual = document.getElementById("filtro-categoria").value;
    renderizar(filtrarPorCategoria(categoriaActual));
    console.log(`CAMBIO DE ESTADO - Libro con ID ${id} actualizado.`);
    console.table(inventario);
}

document.addEventListener("DOMContentLoaded", function() {
    renderizar(inventario);
    inicializarFiltros();

    document.getElementById("formulario-producto").addEventListener("submit", agregarProducto);

    document.getElementById("filtro-categoria").addEventListener("change", function(e) {
        renderizar(filtrarPorCategoria(e.target.value));
    });

    let cuerpoInventario = document.getElementById("cuerpo-inventario");
    cuerpoInventario.addEventListener("click", function(e) {
        let boton = e.target.closest("button");
        if (!boton) return;

        let idStr = boton.getAttribute("data-id");
        if (!idStr) return;
        let id = Number(idStr);

        if (boton.classList.contains("btn-eliminar")) {
            manejarEliminacion(id);
            return;
        }

        if (boton.classList.contains("btn-estado")) {
            manejarCambioEstado(id);
            return;
        }
    });

    console.log("Inventario inicial de librería cargado correctamente:");
    console.table(inventario);
    console.log("Resumen por categoría:", contarPorCategoria(inventario));
});