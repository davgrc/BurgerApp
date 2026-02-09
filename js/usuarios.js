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
        mostrarMensaje("Debes ingresar nombre y contraseña.", "warning");
        return false;
    }

    const usuarios = obtenerUsuarios();

    if (usuarios.some(u => u.usuario.toLowerCase() === nombre.toLowerCase())) {
        mostrarMensaje("Ya existe un usuario con ese nombre.", "warning");
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

    mostrarMensaje("Usuario creado correctamente.", "success");
    return true;
}


/* =========================================================
   6. EDITAR USUARIO
   ========================================================= */

function editarUsuario(id, nuevoNombre, nuevaClave) {

    id = Number(id);

    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        mostrarMensaje("Usuario no encontrado.", "warning");
        return false;
    }

    if (campoVacio(nuevoNombre)) {
        mostrarMensaje("El nombre no puede estar vacío.", "warning");
        return false;
    }

    if (usuarios.some(u => u.usuario.toLowerCase() === nuevoNombre.toLowerCase() && u.id !== id)) {
        mostrarMensaje("Ya existe otro usuario con ese nombre.", "warning");
        return false;
    }

    usuario.usuario = nuevoNombre;

    if (!campoVacio(nuevaClave)) {
        usuario.password = nuevaClave;
    }

    guardarUsuarios(usuarios);

    mostrarMensaje("Usuario actualizado correctamente.", "success");
    return true;
}


/* =========================================================
   7. ELIMINAR USUARIO
   ========================================================= */

function eliminarUsuario(id) {

    id = Number(id);

    let usuarios = obtenerUsuarios();

    if (usuarios.length === 1) {
        mostrarMensaje("No puedes eliminar el único usuario existente.", "warning");
        return false;
    }

    usuarios = usuarios.filter(u => u.id !== id);
    guardarUsuarios(usuarios);

    const actual = obtenerUsuarioActual();

    if (Number(actual) === id) {
        guardarUsuarioActual(usuarios[0].id);
    }

    mostrarMensaje("Usuario eliminado correctamente.", "success");
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
