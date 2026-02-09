/* =========================================================
   ADMIN-CATEGORIAS.JS
   Gestión profesional de categorías: agregar, editar, eliminar
   ========================================================= */


/* =========================================================
   1. REFERENCIAS AL DOM
   ========================================================= */

const catNombre = document.getElementById("catNombre");
const btnAgregarCategoria = document.getElementById("btnAgregarCategoria");
const listaCategorias = document.getElementById("listaCategorias");

const modalEditar = document.getElementById("modalEditar");
const editarNombre = document.getElementById("editarNombre");
const btnGuardarEdicion = document.getElementById("btnGuardarEdicion");

let categoriaEditandoID = null;



/* =========================================================
   2. OBTENER / GUARDAR CATEGORÍAS
   ========================================================= */

function obtenerCategorias() {
    return leerLS("categorias", []);
}

function guardarCategorias(lista) {
    guardarLS("categorias", lista);
}



/* =========================================================
   3. AGREGAR CATEGORÍA
   ========================================================= */

function agregarCategoria() {

    const nombre = catNombre.value.trim();

    if (campoVacio(nombre)) {
        alerta("Debes ingresar un nombre para la categoría.");
        return;
    }

    const categorias = obtenerCategorias();

    // Evitar duplicados
    if (categorias.some(c => c.nombre.toLowerCase() === nombre.toLowerCase())) {
        alerta("Ya existe una categoría con ese nombre.");
        return;
    }

    const nuevaCategoria = {
        id: generarID(),
        nombre
    };

    categorias.push(nuevaCategoria);
    guardarCategorias(categorias);

    alerta("Categoría agregada correctamente.");

    catNombre.value = "";
    mostrarCategorias();
}



/* =========================================================
   4. ELIMINAR CATEGORÍA
   ========================================================= */

function eliminarCategoria(id) {

    const subcategorias = leerLS("subcategorias", []);

    // Evitar eliminar categorías que tienen subcategorías
    if (subcategorias.some(s => s.categoriaID == id)) {
        alerta("No puedes eliminar esta categoría porque tiene subcategorías asociadas.");
        return;
    }

    let categorias = obtenerCategorias();
    categorias = categorias.filter(c => c.id !== id);

    guardarCategorias(categorias);
    mostrarCategorias();
}



/* =========================================================
   5. ABRIR MODAL DE EDICIÓN
   ========================================================= */

function abrirModalEditar(id, nombreActual) {
    categoriaEditandoID = id;
    editarNombre.value = nombreActual;
    modalEditar.style.display = "flex";
}



/* =========================================================
   6. GUARDAR EDICIÓN DE CATEGORÍA
   ========================================================= */

btnGuardarEdicion.addEventListener("click", () => {

    const nuevoNombre = editarNombre.value.trim();

    if (campoVacio(nuevoNombre)) {
        alerta("El nombre no puede estar vacío.");
        return;
    }

    const categorias = obtenerCategorias();

    // Evitar duplicados
    if (categorias.some(c => c.nombre.toLowerCase() === nuevoNombre.toLowerCase() && c.id !== categoriaEditandoID)) {
        alerta("Ya existe otra categoría con ese nombre.");
        return;
    }

    // Actualizar categoría
    const categoria = categorias.find(c => c.id === categoriaEditandoID);
    categoria.nombre = nuevoNombre;

    guardarCategorias(categorias);

    // Actualizar subcategorías que dependan de esta categoría
    const subcategorias = leerLS("subcategorias", []);
    subcategorias.forEach(s => {
        if (s.categoriaID === categoriaEditandoID) {
            // No cambiamos ID, solo el nombre se usa en nuevo-gasto.js
        }
    });
    guardarLS("subcategorias", subcategorias);

    modalEditar.style.display = "none";
    mostrarCategorias();
    alerta("Categoría actualizada correctamente.");
});



/* =========================================================
   7. CREAR TARJETA HTML PARA UNA CATEGORÍA
   ========================================================= */

function crearTarjetaCategoria(c) {
    return `
        <div class="cat-item">
            <span>${c.nombre}</span>

            <div class="cat-btns">
                <button class="btn-edit" onclick="abrirModalEditar('${c.id}', '${c.nombre}')">Editar</button>
                <button class="btn-delete" onclick="eliminarCategoria('${c.id}')">Eliminar</button>
            </div>
        </div>
    `;
}



/* =========================================================
   8. MOSTRAR CATEGORÍAS
   ========================================================= */

function mostrarCategorias() {
    const categorias = obtenerCategorias();

    if (categorias.length === 0) {
        listaCategorias.innerHTML = `
            <p style="opacity:0.6; text-align:center;">
                No hay categorías registradas.
            </p>
        `;
        return;
    }

    listaCategorias.innerHTML = categorias
        .map(c => crearTarjetaCategoria(c))
        .join("");
}



/* =========================================================
   9. EVENTOS
   ========================================================= */

btnAgregarCategoria.addEventListener("click", agregarCategoria);



/* =========================================================
   10. INICIALIZACIÓN
   ========================================================= */

mostrarCategorias();
