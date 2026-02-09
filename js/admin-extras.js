/* =========================================================
   ADMIN-EXTRAS.JS
   Gestión de extras: agregar, listar, editar y eliminar
   ========================================================= */

const extraNombre = document.getElementById("extraNombre");
const extraPrecio = document.getElementById("extraPrecio");
const extraMoneda = document.getElementById("extraMoneda");

const btnAgregarExtra = document.getElementById("btnAgregarExtra");
const listaExtras = document.getElementById("listaExtras");

/* Modal */
const modalEditar = document.getElementById("modalEditarExtra");
const editNombre = document.getElementById("editExtraNombre");
const editPrecio = document.getElementById("editExtraPrecio");
const editMoneda = document.getElementById("editExtraMoneda");

let extraEditandoID = null;

/* =========================================================
   OBTENER / GUARDAR
   ========================================================= */

function obtenerExtras() {
    return leerLS("extras", []);
}

function guardarExtras(lista) {
    guardarLS("extras", lista);
}

/* =========================================================
   AGREGAR EXTRA
   ========================================================= */

function agregarExtra() {
    const nombre = extraNombre.value.trim();
    const precio = parseFloat(extraPrecio.value);
    const moneda = extraMoneda.value;

    if (campoVacio(nombre)) return alerta("Debes ingresar un nombre.");
    if (isNaN(precio) || precio <= 0) return alerta("Precio inválido.");

    const extras = obtenerExtras();

    extras.push({
        id: generarID(),
        nombre,
        precio,
        moneda
    });

    guardarExtras(extras);

    extraNombre.value = "";
    extraPrecio.value = "";

    mostrarExtras();
}

/* =========================================================
   ELIMINAR EXTRA
   ========================================================= */

function eliminarExtra(id) {
    id = Number(id);

    let extras = obtenerExtras();
    extras = extras.filter(e => e.id !== id);

    guardarExtras(extras);
    mostrarExtras();
}

/* =========================================================
   ABRIR MODAL DE EDICIÓN
   ========================================================= */

function editarExtra(id) {
    id = Number(id);

    const extras = obtenerExtras();
    const extra = extras.find(e => e.id === id);
    if (!extra) return;

    extraEditandoID = id;

    editNombre.value = extra.nombre;
    editPrecio.value = extra.precio;
    editMoneda.value = extra.moneda;

    modalEditar.classList.remove("oculto");
}

/* =========================================================
   CERRAR MODAL
   ========================================================= */

function cerrarModalExtra() {
    modalEditar.classList.add("oculto");
    extraEditandoID = null;
}

/* =========================================================
   GUARDAR EDICIÓN
   ========================================================= */

function guardarEdicionExtra() {
    const nombre = editNombre.value.trim();
    const precio = parseFloat(editPrecio.value);
    const moneda = editMoneda.value;

    if (campoVacio(nombre)) return alerta("Nombre inválido.");
    if (isNaN(precio) || precio <= 0) return alerta("Precio inválido.");

    const extras = obtenerExtras();
    const extra = extras.find(e => e.id === extraEditandoID);

    if (!extra) return;

    extra.nombre = nombre;
    extra.precio = precio;
    extra.moneda = moneda;

    guardarExtras(extras);
    cerrarModalExtra();
    mostrarExtras();
}

/* =========================================================
   TARJETA HTML
   ========================================================= */

function crearTarjetaExtra(e) {
    const monedaMostrar = e.moneda === "bs" ? "Bs" : e.moneda.toUpperCase();

    return `
        <div class="card" style="margin-bottom:12px;">
            <h3>${e.nombre}</h3>
            <p><strong>Precio:</strong> ${formatearNumero(e.precio)} ${monedaMostrar}</p>

            <div class="btn-row">
                <button class="btn-guardar" onclick="editarExtra('${e.id}')">Editar</button>
                <button class="btn-cerrar" onclick="eliminarExtra('${e.id}')">Eliminar</button>
            </div>
        </div>
    `;
}


/* =========================================================
   MOSTRAR EXTRAS
   ========================================================= */

function mostrarExtras() {
    const extras = obtenerExtras();

    if (extras.length === 0) {
        listaExtras.innerHTML = `<p style="opacity:0.6; text-align:center;">No hay extras registrados.</p>`;
        return;
    }

    listaExtras.innerHTML = extras.map(e => crearTarjetaExtra(e)).join("");
}

/* =========================================================
   EVENTOS
   ========================================================= */

btnAgregarExtra.addEventListener("click", agregarExtra);

/* =========================================================
   INICIO
   ========================================================= */

mostrarExtras();
