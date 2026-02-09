/* =========================================================
   ADMIN-PRODUCTOS.JS
   ========================================================= */

const prodNombre = document.getElementById("prodNombre");
const prodPrecio = document.getElementById("prodPrecio");
const prodMoneda = document.getElementById("prodMoneda");

const btnAgregarProducto = document.getElementById("btnAgregarProducto");
const listaProductos = document.getElementById("listaProductos");

function obtenerProductos() {
    return leerLS("productos", []);
}

function guardarProductos(lista) {
    guardarLS("productos", lista);
}

function agregarProducto() {
    const nombre = prodNombre.value.trim();
    const precio = parseFloat(prodPrecio.value);
    const moneda = prodMoneda.value;

    if (campoVacio(nombre)) {
        mostrarMensaje("Debes ingresar un nombre.", "warning");
        return;
    }

    if (isNaN(precio) || precio <= 0) {
        mostrarMensaje("Precio inválido.", "warning");
        return;
    }

    const productos = obtenerProductos();

    productos.push({
        id: generarID(),
        nombre,
        precio,
        moneda
    });

    guardarProductos(productos);

    prodNombre.value = "";
    prodPrecio.value = "";

    mostrarProductos();
    mostrarMensaje("Producto agregado correctamente.", "success");
}

function eliminarProducto(id) {
    id = Number(id);

    let productos = obtenerProductos();
    productos = productos.filter(p => p.id !== id);
    guardarProductos(productos);
    mostrarProductos();

    mostrarMensaje("Producto eliminado correctamente.", "success");
}

let idEditando = null;

function editarProducto(id) {
    id = Number(id);

    const productos = obtenerProductos();
    const p = productos.find(x => x.id === id);

    if (!p) return;

    idEditando = id;

    document.getElementById("editNombre").value = p.nombre;
    document.getElementById("editPrecio").value = p.precio;
    document.getElementById("editMoneda").value = p.moneda;

    document.getElementById("modalEditar").classList.remove("oculto");
}

function guardarEdicion() {
    const nombre = document.getElementById("editNombre").value.trim();
    const precio = parseFloat(document.getElementById("editPrecio").value);
    const moneda = document.getElementById("editMoneda").value;

    if (campoVacio(nombre) || isNaN(precio) || precio <= 0) {
        mostrarMensaje("Debes completar todos los campos correctamente.", "warning");
        return;
    }

    let productos = obtenerProductos();

    productos = productos.map(p => {
        if (p.id === idEditando) {
            return { ...p, nombre, precio, moneda };
        }
        return p;
    });

    guardarProductos(productos);
    mostrarProductos();
    cerrarModal();

    mostrarMensaje("Producto actualizado correctamente.", "success");
}

function cerrarModal() {
    document.getElementById("modalEditar").classList.add("oculto");
    idEditando = null;
}

function crearTarjetaProducto(p) {
    const monedaMostrar = p.moneda === "bs" ? "Bs" : p.moneda.toUpperCase();

    return `
        <div class="card" style="margin-bottom:12px;">
            <h3 style="margin-bottom:6px;">${p.nombre}</h3>

            <p><strong>Precio:</strong> ${formatearNumero(p.precio)} ${monedaMostrar}</p>

            <div class="btn-row">
                <button class="btn-guardar" onclick="editarProducto('${p.id}')">Editar</button>
                <button class="btn-cerrar" onclick="eliminarProducto('${p.id}')">Eliminar</button>
            </div>
        </div>
    `;
}

function mostrarProductos() {
    const productos = obtenerProductos();

    if (productos.length === 0) {
        listaProductos.innerHTML = `
            <p style="opacity:0.6; text-align:center;">
                No hay productos registrados.
            </p>
        `;
        return;
    }

    listaProductos.innerHTML = productos.map(p => crearTarjetaProducto(p)).join("");
}

btnAgregarProducto.addEventListener("click", agregarProducto);

mostrarProductos();
