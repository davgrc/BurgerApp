/* =========================================================
   NUEVO-GASTO.JS
   Registro profesional de gastos con categorías y subcategorías
   ========================================================= */


/* =========================================================
   1. REFERENCIAS AL DOM
   ========================================================= */

const gastoTitulo = document.getElementById("gastoTitulo");
const gastoMonto = document.getElementById("gastoMonto");
const gastoMoneda = document.getElementById("gastoMoneda");

const gastoCategoria = document.getElementById("gastoCategoria");
const gastoSubcategoria = document.getElementById("gastoSubcategoria");

const btnAddCategoria = document.getElementById("btnAddCategoria");
const btnAddSubcategoria = document.getElementById("btnAddSubcategoria");

const modalCategoria = document.getElementById("modalCategoria");
const modalSubcategoria = document.getElementById("modalSubcategoria");

const nuevaCategoriaNombre = document.getElementById("nuevaCategoriaNombre");
const nuevaSubcategoriaNombre = document.getElementById("nuevaSubcategoriaNombre");

const guardarNuevaCategoria = document.getElementById("guardarNuevaCategoria");
const guardarNuevaSubcategoria = document.getElementById("guardarNuevaSubcategoria");

const cancelarNuevaCategoria = document.getElementById("cancelarNuevaCategoria");
const cancelarNuevaSubcategoria = document.getElementById("cancelarNuevaSubcategoria");

const guardarGasto = document.getElementById("guardarGasto");



/* =========================================================
   2. CARGAR CATEGORÍAS
   ========================================================= */

function cargarCategorias() {
    const categorias = leerLS("categorias", []);

    gastoCategoria.innerHTML = `<option value="">Seleccione categoría</option>`;

    categorias.forEach(cat => {
        gastoCategoria.innerHTML += `
            <option value="${cat.id}">${cat.nombre}</option>
        `;
    });
}



/* =========================================================
   3. CARGAR SUBCATEGORÍAS SEGÚN CATEGORÍA
   ========================================================= */

function cargarSubcategorias() {
    const subcategorias = leerLS("subcategorias", []);
    const categoriaID = gastoCategoria.value;

    gastoSubcategoria.innerHTML = `<option value="">Seleccione subcategoría</option>`;

    if (!categoriaID) return;

    subcategorias
        .filter(s => s.categoriaID == categoriaID)
        .forEach(s => {
            gastoSubcategoria.innerHTML += `
                <option value="${s.id}">${s.nombre}</option>
            `;
        });
}



/* =========================================================
   4. ABRIR MODALES
   ========================================================= */

btnAddCategoria.addEventListener("click", () => {
    nuevaCategoriaNombre.value = "";
    modalCategoria.style.display = "flex";
});

btnAddSubcategoria.addEventListener("click", () => {
    if (!gastoCategoria.value) {
        alerta("Primero selecciona una categoría.");
        return;
    }

    nuevaSubcategoriaNombre.value = "";
    modalSubcategoria.style.display = "flex";
});



/* =========================================================
   5. CERRAR MODALES (BOTÓN CANCELAR)
   ========================================================= */

cancelarNuevaCategoria.addEventListener("click", () => {
    modalCategoria.style.display = "none";
});

cancelarNuevaSubcategoria.addEventListener("click", () => {
    modalSubcategoria.style.display = "none";
});



/* =========================================================
   6. CERRAR MODALES AL TOCAR FUERA
   ========================================================= */

window.addEventListener("click", (e) => {
    if (e.target === modalCategoria) modalCategoria.style.display = "none";
    if (e.target === modalSubcategoria) modalSubcategoria.style.display = "none";
});



/* =========================================================
   7. GUARDAR NUEVA CATEGORÍA
   ========================================================= */

guardarNuevaCategoria.addEventListener("click", () => {
    const nombre = nuevaCategoriaNombre.value.trim();
    if (campoVacio(nombre)) {
        alerta("Debes ingresar un nombre para la categoría.");
        return;
    }

    const categorias = leerLS("categorias", []);
    const nueva = {
        id: generarID(),
        nombre
    };

    categorias.push(nueva);
    guardarLS("categorias", categorias);

    modalCategoria.style.display = "none";
    cargarCategorias();
    gastoCategoria.value = nueva.id;
    cargarSubcategorias();
});



/* =========================================================
   8. GUARDAR NUEVA SUBCATEGORÍA
   ========================================================= */

guardarNuevaSubcategoria.addEventListener("click", () => {
    const nombre = nuevaSubcategoriaNombre.value.trim();
    if (campoVacio(nombre)) {
        alerta("Debes ingresar un nombre para la subcategoría.");
        return;
    }

    const categoriaID = gastoCategoria.value;
    const subcategorias = leerLS("subcategorias", []);

    const nueva = {
        id: generarID(),
        categoriaID,
        nombre
    };

    subcategorias.push(nueva);
    guardarLS("subcategorias", subcategorias);

    modalSubcategoria.style.display = "none";
    cargarSubcategorias();
    gastoSubcategoria.value = nueva.id;
});



/* =========================================================
   9. OBTENER DATOS DEL FORMULARIO
   ========================================================= */

function obtenerDatosGasto() {

    const categorias = leerLS("categorias", []);
    const subcategorias = leerLS("subcategorias", []);

    const categoria = categorias.find(c => c.id == gastoCategoria.value);
    const subcategoria = subcategorias.find(s => s.id == gastoSubcategoria.value);

    return {
        id: generarID(),
        fecha: fechaActualClave(),
        titulo: gastoTitulo.value.trim(),

        categoriaID: categoria?.id || "",
        categoriaNombre: categoria?.nombre || "",

        subcategoriaID: subcategoria?.id || "",
        subcategoriaNombre: subcategoria?.nombre || "",

        monto: parseFloat(gastoMonto.value),
        moneda: gastoMoneda.value,

        estado: "activo"
    };
}



/* =========================================================
   10. VALIDAR CAMPOS
   ========================================================= */

function validarGasto(data) {
    if (campoVacio(data.titulo)) return "El título del gasto es obligatorio.";
    if (campoVacio(data.categoriaID)) return "Debes seleccionar una categoría.";
    if (campoVacio(data.subcategoriaID)) return "Debes seleccionar una subcategoría.";
    if (isNaN(data.monto) || data.monto <= 0) return "Debes ingresar un monto válido.";
    return null;
}



/* =========================================================
   11. GUARDAR GASTO EN LOCALSTORAGE
   ========================================================= */

function guardarGastoLS(gasto) {
    const gastos = leerLS("gastos", []);
    gastos.push(gasto);
    guardarLS("gastos", gastos);
}



/* =========================================================
   12. EVENTO: GUARDAR GASTO
   ========================================================= */

guardarGasto.addEventListener("click", () => {

    const data = obtenerDatosGasto();
    const error = validarGasto(data);

    if (error) {
        alerta(error);
        return;
    }

    guardarGastoLS(data);

    alerta("Gasto registrado correctamente.");
    window.location.href = "gastos.html";
});



/* =========================================================
   13. INICIALIZACIÓN
   ========================================================= */

cargarCategorias();
gastoCategoria.addEventListener("change", cargarSubcategorias);
