/* =========================================================
   ADMIN-SUBCATEGORIAS.JS
   Gestión profesional de subcategorías: agregar, editar, eliminar
   ========================================================= */


/* =========================================================
   1. REFERENCIAS AL DOM
   ========================================================= */

const subcatCategoria = document.getElementById("subcatCategoria");
const subcatNombre = document.getElementById("subcatNombre");
const btnAgregarSubcategoria = document.getElementById("btnAgregarSubcategoria");
const listaSubcategorias = document.getElementById("listaSubcategorias");

const modalEditarSubcat = document.getElementById("modalEditarSubcat");
const editarSubcatCategoria = document.getElementById("editarSubcatCategoria");
const editarSubcatNombre = document.getElementById("editarSubcatNombre");
const btnGuardarEdicionSubcat = document.getElementById("btnGuardarEdicionSubcat");

let subcatEditandoID = null;



/* =========================================================
   2. OBTENER / GUARDAR CATEGORÍAS Y SUBCATEGORÍAS
   ========================================================= */

function obtenerCategorias() {
    return leerLS("categorias", []);
}

function obtenerSubcategorias() {
    return leerLS("subcategorias", []);
}

function guardarSubcategorias(lista) {
    guardarLS("subcategorias", lista);
}



/* =========================================================
   3. CARGAR CATEGORÍAS EN SELECTS
   ========================================================= */

function cargarCategoriasEnSelects() {
    const categorias = obtenerCategorias();

    // Select principal
    subcatCategoria.innerHTML = `<option value="">Seleccione categoría</option>`;
    categorias.forEach(c => {
        subcatCategoria.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
    });

    // Select del modal de edición
    editarSubcatCategoria.innerHTML = "";
    categorias.forEach(c => {
        editarSubcatCategoria.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
    });
}



/* =========================================================
   4. AGREGAR SUBCATEGORÍA
   ========================================================= */

function agregarSubcategoria() {

    const categoriaID = subcatCategoria.value;
    const nombre = subcatNombre.value.trim();

    if (campoVacio(categoriaID)) {
        alerta("Debes seleccionar una categoría.");
        return;
    }

    if (campoVacio(nombre)) {
        alerta("Debes ingresar un nombre para la subcategoría.");
        return;
    }

    const subcategorias = obtenerSubcategorias();

    // Evitar duplicados dentro de la misma categoría
    if (subcategorias.some(s =>
        s.categoriaID == categoriaID &&
        s.nombre.toLowerCase() === nombre.toLowerCase()
    )) {
        alerta("Ya existe una subcategoría con ese nombre en esta categoría.");
        return;
    }

    const nueva = {
        id: generarID(),
        categoriaID,
        nombre
    };

    subcategorias.push(nueva);
    guardarSubcategorias(subcategorias);

    alerta("Subcategoría agregada correctamente.");

    subcatNombre.value = "";
    mostrarSubcategorias();
}



/* =========================================================
   5. ELIMINAR SUBCATEGORÍA
   ========================================================= */

function eliminarSubcategoria(id) {
    let subcategorias = obtenerSubcategorias();
    subcategorias = subcategorias.filter(s => s.id !== id);

    guardarSubcategorias(subcategorias);
    mostrarSubcategorias();
}



/* =========================================================
   6. ABRIR MODAL DE EDICIÓN
   ========================================================= */

function abrirModalEditarSubcat(id) {
    const subcategorias = obtenerSubcategorias();
    const subcat = subcategorias.find(s => s.id === id);

    if (!subcat) return;

    subcatEditandoID = id;

    editarSubcatNombre.value = subcat.nombre;
    editarSubcatCategoria.value = subcat.categoriaID;

    modalEditarSubcat.style.display = "flex";
}



/* =========================================================
   7. GUARDAR EDICIÓN DE SUBCATEGORÍA
   ========================================================= */

btnGuardarEdicionSubcat.addEventListener("click", () => {

    const nuevoNombre = editarSubcatNombre.value.trim();
    const nuevaCategoriaID = editarSubcatCategoria.value;

    if (campoVacio(nuevoNombre)) {
        alerta("El nombre no puede estar vacío.");
        return;
    }

    const subcategorias = obtenerSubcategorias();

    // Evitar duplicados dentro de la misma categoría
    if (subcategorias.some(s =>
        s.id !== subcatEditandoID &&
        s.categoriaID == nuevaCategoriaID &&
        s.nombre.toLowerCase() === nuevoNombre.toLowerCase()
    )) {
        alerta("Ya existe una subcategoría con ese nombre en esta categoría.");
        return;
    }

    const subcat = subcategorias.find(s => s.id === subcatEditandoID);
    subcat.nombre = nuevoNombre;
    subcat.categoriaID = nuevaCategoriaID;

    guardarSubcategorias(subcategorias);

    modalEditarSubcat.style.display = "none";
    mostrarSubcategorias();
    alerta("Subcategoría actualizada correctamente.");
});



/* =========================================================
   8. CREAR TARJETA HTML PARA UNA SUBCATEGORÍA
   ========================================================= */

function crearTarjetaSubcategoria(s) {
    const categorias = obtenerCategorias();
    const categoria = categorias.find(c => c.id == s.categoriaID);

    return `
        <div class="subcat-item">
            <span>${s.nombre} <small style="opacity:0.6;">(${categoria?.nombre || "Sin categoría"})</small></span>

            <div class="subcat-btns">
                <button class="btn-edit" onclick="abrirModalEditarSubcat('${s.id}')">Editar</button>
                <button class="btn-delete" onclick="eliminarSubcategoria('${s.id}')">Eliminar</button>
            </div>
        </div>
    `;
}



/* =========================================================
   9. MOSTRAR SUBCATEGORÍAS
   ========================================================= */

function mostrarSubcategorias() {
    const subcategorias = obtenerSubcategorias();

    if (subcategorias.length === 0) {
        listaSubcategorias.innerHTML = `
            <p style="opacity:0.6; text-align:center;">
                No hay subcategorías registradas.
            </p>
        `;
        return;
    }

    listaSubcategorias.innerHTML = subcategorias
        .map(s => crearTarjetaSubcategoria(s))
        .join("");
}



/* =========================================================
   10. EVENTOS
   ========================================================= */

btnAgregarSubcategoria.addEventListener("click", agregarSubcategoria);



/* =========================================================
   11. INICIALIZACIÓN
   ========================================================= */

cargarCategoriasEnSelects();
mostrarSubcategorias();
