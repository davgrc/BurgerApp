/* =========================================================
   AJUSTES.JS
   Control de interfaz para gestión de usuarios y reset
   ========================================================= */


/* =========================================================
   1. REFERENCIAS AL DOM
   ========================================================= */

const listaUsuarios = document.getElementById("listaUsuarios");

const btnNuevoUsuario = document.getElementById("btnNuevoUsuario");
const btnResetApp = document.getElementById("btnResetApp");

/* Modales */
const modalCrear = document.getElementById("modalCrear");
const modalEditar = document.getElementById("modalEditar");

/* Inputs modal crear */
const nuevoUsuarioNombre = document.getElementById("nuevoUsuarioNombre");
const nuevoUsuarioClave = document.getElementById("nuevoUsuarioClave");
const crearUsuarioConfirmar = document.getElementById("crearUsuarioConfirmar");
const crearUsuarioCancelar = document.getElementById("crearUsuarioCancelar");

/* Inputs modal editar */
const editarUsuarioNombre = document.getElementById("editarUsuarioNombre");
const editarUsuarioClave = document.getElementById("editarUsuarioClave");
const editarUsuarioConfirmar = document.getElementById("editarUsuarioConfirmar");
const editarUsuarioCancelar = document.getElementById("editarUsuarioCancelar");

/* Variable temporal para saber qué usuario estamos editando */
let usuarioEditandoID = null;

/* =========================================================
   REFERENCIAS A TASAS
   ========================================================= */

const usd_cop = document.getElementById("usd_cop");
const usd_ves = document.getElementById("usd_ves");
const btnGuardarTasas = document.getElementById("guardarTasas");



/* =========================================================
   2. MOSTRAR LISTA DE USUARIOS
   ========================================================= */

function renderUsuarios() {
    const usuarios = obtenerUsuarios();
    const actual = obtenerUsuarioActual();

    if (usuarios.length === 0) {
        listaUsuarios.innerHTML = `
            <p style="opacity:0.6; text-align:center;">
                No hay usuarios registrados.
            </p>
        `;
        return;
    }

    listaUsuarios.innerHTML = usuarios.map((u, index) => {
        const esActual = u.id === actual;

        return `
            <div class="card" style="margin-bottom:12px;">
                <h3 style="margin-bottom:6px;">
                    ${index + 1}. ${u.usuario}
                    ${esActual ? '<span style="color:#4caf50;">(actual)</span>' : ''}
                </h3>

                <div style="display:flex; gap:10px; margin-top:10px;">
                    <button class="btn-guardar" style="flex:1;"
                        onclick="abrirModalEditar('${u.id}')">
                        Editar
                    </button>

                    <button class="btn-cerrar" style="flex:1;"
                        onclick="eliminarUsuarioAjustes('${u.id}')">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    }).join("");
}



/* =========================================================
   3. ABRIR / CERRAR MODALES
   ========================================================= */

function abrirModalCrear() {
    nuevoUsuarioNombre.value = "";
    nuevoUsuarioClave.value = "";
    modalCrear.style.display = "flex";
}

function cerrarModalCrear() {
    modalCrear.style.display = "none";
}

function abrirModalEditar(id) {
    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) return;

    usuarioEditandoID = id;
    editarUsuarioNombre.value = usuario.usuario;
    editarUsuarioClave.value = "";

    modalEditar.style.display = "flex";
}

function cerrarModalEditar() {
    modalEditar.style.display = "none";
    usuarioEditandoID = null;
}



/* =========================================================
   4. CREAR USUARIO
   ========================================================= */

crearUsuarioConfirmar.addEventListener("click", () => {
    const nombre = nuevoUsuarioNombre.value.trim();
    const clave = nuevoUsuarioClave.value.trim();

    if (crearUsuario(nombre, clave)) {
        alerta("Usuario creado correctamente.");
        cerrarModalCrear();
        renderUsuarios();
    }
});

crearUsuarioCancelar.addEventListener("click", cerrarModalCrear);



/* =========================================================
   5. EDITAR USUARIO
   ========================================================= */

editarUsuarioConfirmar.addEventListener("click", () => {
    if (!usuarioEditandoID) return;

    const nombre = editarUsuarioNombre.value.trim();
    const clave = editarUsuarioClave.value.trim();

    if (editarUsuario(usuarioEditandoID, nombre, clave)) {
        alerta("Usuario actualizado.");
        cerrarModalEditar();
        renderUsuarios();
    }
});

editarUsuarioCancelar.addEventListener("click", cerrarModalEditar);



/* =========================================================
   6. ELIMINAR USUARIO
   ========================================================= */

function eliminarUsuarioAjustes(id) {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
        if (eliminarUsuario(id)) {
            alerta("Usuario eliminado.");
            renderUsuarios();
        }
    }
}



/* =========================================================
   7. RESETEAR LA APLICACIÓN
   ========================================================= */

btnResetApp.addEventListener("click", () => {
    if (!confirm("¿Seguro que deseas resetear la aplicación?")) return;

    localStorage.removeItem("pedidos");
    localStorage.removeItem("gastos");
    localStorage.removeItem("productos");
    localStorage.removeItem("extras");
    localStorage.removeItem("categorias");

    alerta("Aplicación reseteada correctamente.");
});

/* =========================================================
   7.5 GUARDAR Y CARGAR TASAS
   ========================================================= */

function cargarTasasEnFormulario() {
    const tasas = obtenerTasas();

    usd_cop.value = tasas.usd_cop || "";
    usd_ves.value = tasas.usd_ves || "";
}

btnGuardarTasas.addEventListener("click", () => {
    const cop = parseFloat(usd_cop.value);
    const ves = parseFloat(usd_ves.value);

    if (isNaN(cop) || cop <= 0) {
        alerta("Debes ingresar un valor válido para USD → COP.");
        return;
    }

    if (isNaN(ves) || ves <= 0) {
        alerta("Debes ingresar un valor válido para USD → VES.");
        return;
    }

    guardarTasas({
        usd_cop: cop,
        usd_ves: ves
    });

    alerta("Tasas guardadas correctamente.");
});



/* =========================================================
   8. EVENTOS DE BOTONES PRINCIPALES
   ========================================================= */

btnNuevoUsuario.addEventListener("click", abrirModalCrear);



/* =========================================================
   9. INICIALIZACIÓN
   ========================================================= */

renderUsuarios();
