/* =========================================================
   LOGIN.JS
   Manejo del login y registro desde el index.html
   ========================================================= */


/* =========================================================
   1. REFERENCIAS AL DOM
   ========================================================= */

const inputUsuario = document.getElementById("loginUsuario");
const inputClave = document.getElementById("loginClave");

const btnLogin = document.getElementById("btnLogin");
const btnRegistrar = document.getElementById("btnRegistrar");

/* Modal */
const modalRegistro = document.getElementById("modalRegistro");
const registroNombre = document.getElementById("registroNombre");
const registroClave = document.getElementById("registroClave");
const registroConfirmar = document.getElementById("registroConfirmar");
const registroCancelar = document.getElementById("registroCancelar");



/* =========================================================
   2. FUNCIÓN PARA ABRIR Y CERRAR MODAL
   ========================================================= */

function abrirModalRegistro() {
    registroNombre.value = "";
    registroClave.value = "";
    modalRegistro.style.display = "flex";
}

function cerrarModalRegistro() {
    modalRegistro.style.display = "none";
}



/* =========================================================
   3. EVENTO: LOGIN
   ========================================================= */

btnLogin.addEventListener("click", () => {
    const usuario = inputUsuario.value.trim();
    const clave = inputClave.value.trim();

    if (campoVacio(usuario) || campoVacio(clave)) {
        alerta("Debes ingresar usuario y contraseña.");
        return;
    }

    const resultado = validarLogin(usuario, clave);

    if (!resultado) {
        alerta("Usuario o contraseña incorrectos.");
        return;
    }

    // Login correcto → redirigir
    window.location.href = "dashboard.html";
});



/* =========================================================
   4. EVENTO: ABRIR MODAL DE REGISTRO
   ========================================================= */

btnRegistrar.addEventListener("click", abrirModalRegistro);



/* =========================================================
   5. EVENTO: CREAR USUARIO DESDE EL MODAL
   ========================================================= */

registroConfirmar.addEventListener("click", () => {
    const nombre = registroNombre.value.trim();
    const clave = registroClave.value.trim();

    if (crearUsuario(nombre, clave)) {
        alerta("Usuario creado correctamente.");
        cerrarModalRegistro();
    }
});

registroCancelar.addEventListener("click", cerrarModalRegistro);



/* =========================================================
   6. CERRAR MODAL AL HACER CLICK FUERA DEL CONTENIDO
   ========================================================= */

window.addEventListener("click", (e) => {
    if (e.target === modalRegistro) {
        cerrarModalRegistro();
    }
});
