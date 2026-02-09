/* =========================================================
   USUARIOS.JS
   Módulo central para manejar usuarios en localStorage
   ========================================================= */


/* =========================================================
   1. OBTENER LISTA DE USUARIOS
   ========================================================= */

function obtenerUsuarios() {
    return leerLS("usuarios", []);
}



/* =========================================================
   2. GUARDAR LISTA DE USUARIOS
   ========================================================= */

function guardarUsuarios(lista) {
    guardarLS("usuarios", lista);
}



/* =========================================================
   3. OBTENER USUARIO ACTUAL
   ========================================================= */

function obtenerUsuarioActual() {
    return localStorage.getItem("usuarioActual") || null;
}



/* =========================================================
   4. GUARDAR USUARIO ACTUAL
   ========================================================= */

function guardarUsuarioActual(idUsuario) {
    localStorage.setItem("usuarioActual", idUsuario);
}



/* =========================================================
   5. CREAR USUARIO
   ========================================================= */

function crearUsuario(nombre, clave) {

    if (campoVacio(nombre) || campoVacio(clave)) {
        alerta("Debes ingresar nombre y contraseña.");
        return false;
    }

    const usuarios = obtenerUsuarios();

    if (usuarios.some(u => u.usuario.toLowerCase() === nombre.toLowerCase())) {
        alerta("Ya existe un usuario con ese nombre.");
        return false;
    }

    const nuevo = {
        id: generarID(),
        usuario: nombre,
        password: clave
    };

    usuarios.push(nuevo);
    guardarUsuarios(usuarios);

    if (usuarios.length === 1) {
        guardarUsuarioActual(nuevo.id);
    }

    return true;
}



/* =========================================================
   6. EDITAR USUARIO
   ========================================================= */

function editarUsuario(id, nuevoNombre, nuevaClave) {

    id = Number(id); // ← CORRECCIÓN CRÍTICA

    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        alerta("Usuario no encontrado.");
        return false;
    }

    if (campoVacio(nuevoNombre)) {
        alerta("El nombre no puede estar vacío.");
        return false;
    }

    if (usuarios.some(u => u.usuario.toLowerCase() === nuevoNombre.toLowerCase() && u.id !== id)) {
        alerta("Ya existe otro usuario con ese nombre.");
        return false;
    }

    usuario.usuario = nuevoNombre;

    if (!campoVacio(nuevaClave)) {
        usuario.password = nuevaClave;
    }

    guardarUsuarios(usuarios);
    return true;
}



/* =========================================================
   7. ELIMINAR USUARIO
   ========================================================= */

function eliminarUsuario(id) {

    id = Number(id); // ← CORRECCIÓN CRÍTICA

    let usuarios = obtenerUsuarios();

    if (usuarios.length === 1) {
        alerta("No puedes eliminar el único usuario existente.");
        return false;
    }

    usuarios = usuarios.filter(u => u.id !== id);
    guardarUsuarios(usuarios);

    const actual = obtenerUsuarioActual();

    if (Number(actual) === id) {
        guardarUsuarioActual(usuarios[0].id);
    }

    return true;
}



/* =========================================================
   8. VALIDAR LOGIN
   ========================================================= */

function validarLogin(nombre, clave) {
    const usuarios = obtenerUsuarios();

    const usuario = usuarios.find(
        u => u.usuario.toLowerCase() === nombre.toLowerCase() && u.password === clave
    );

    if (!usuario) return null;

    guardarUsuarioActual(usuario.id);
    return usuario;
}
