/* =========================================================
   PEDIDOS-ELIMINADOS.JS
   Lista de pedidos marcados como "eliminado"
   ========================================================= */


/* =========================================================
   1. REFERENCIAS AL DOM
   ========================================================= */

const listaEliminados = document.getElementById("listaEliminados");



/* =========================================================
   2. OBTENER Y GUARDAR PEDIDOS
   ========================================================= */

function obtenerPedidos() {
    return leerLS("pedidos", []);
}

function guardarPedidos(lista) {
    guardarLS("pedidos", lista);
}



/* =========================================================
   3. FILTRAR SOLO PEDIDOS ELIMINADOS
   ========================================================= */

function pedidosEliminados() {
    const pedidos = obtenerPedidos();
    return pedidos.filter(p => p.estado === "eliminado");
}



/* =========================================================
   4. RESTAURAR PEDIDO (volver a pendiente)
   ========================================================= */

function restaurarPedido(id) {
    id = Number(id);

    const pedidos = obtenerPedidos();
    const pedido = pedidos.find(p => p.id === id);

    if (!pedido) return;

    pedido.estado = "pendiente";
    guardarPedidos(pedidos);
    mostrarEliminados();
}



/* =========================================================
   5. ELIMINAR DEFINITIVAMENTE
   ========================================================= */

function eliminarDefinitivo(id) {
    id = Number(id);

    let pedidos = obtenerPedidos();
    pedidos = pedidos.filter(p => p.id !== id);

    guardarPedidos(pedidos);
    mostrarEliminados();
}



/* =========================================================
   6. EXPANDIR / COLAPSAR TARJETA
   ========================================================= */

function toggleExpand(id) {
    const tarjeta = document.getElementById("eliminado-" + id);
    tarjeta.classList.toggle("expandido");
}



/* =========================================================
   7. CREAR TARJETA HTML PARA UN PEDIDO ELIMINADO
   ========================================================= */

function crearTarjetaEliminado(p) {

    const extrasTexto = p.extras?.length
        ? p.extras.map(e => e.nombre || e.id).join(", ")
        : "Ninguno";

    const monedaMostrar = p.moneda === "bs" ? "Bs" : p.moneda.toUpperCase();
    const precioTexto = `${formatearNumero(p.precio)} ${monedaMostrar}`;

    return `
        <div class="card pedido-item minimizado" id="eliminado-${p.id}">

            <div class="pedido-header">
                <strong>${p.productoTexto}</strong>
                <span>${p.cliente.nombre}</span>
                <span>${precioTexto}</span>

                <div class="pedido-botones">
                    <button onclick="toggleExpand('${p.id}')">👁</button>
                    <button onclick="restaurarPedido('${p.id}')">↩</button>
                    <button onclick="eliminarDefinitivo('${p.id}')">❌</button>
                </div>
            </div>

            <div class="pedido-detalles">
                <p><strong>Dirección:</strong> ${p.cliente.direccion}</p>
                <p><strong>Tel:</strong> ${p.cliente.telefono}</p>
                <p><strong>Extras:</strong> ${extrasTexto}</p>
                <p><strong>Fecha:</strong> ${p.fecha}</p>
            </div>

        </div>
    `;
}



/* =========================================================
   8. MOSTRAR PEDIDOS ELIMINADOS
   ========================================================= */

function mostrarEliminados() {
    const eliminados = pedidosEliminados();

    if (eliminados.length === 0) {
        listaEliminados.innerHTML = `
            <p style="opacity:0.6; text-align:center; margin-top:20px;">
                No hay pedidos eliminados.
            </p>
        `;
        return;
    }

    listaEliminados.innerHTML = eliminados
        .map(p => crearTarjetaEliminado(p))
        .join("");
}



/* =========================================================
   9. INICIALIZACIÓN
   ========================================================= */

mostrarEliminados();
