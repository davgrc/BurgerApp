/* =========================================================
   PEDIDOS-REALIZADOS.JS
   Lista de pedidos marcados como "realizado"
   ========================================================= */


/* =========================================================
   1. REFERENCIAS AL DOM
   ========================================================= */

const listaRealizados = document.getElementById("listaRealizados");



/* =========================================================
   2. OBTENER PEDIDOS DESDE LOCALSTORAGE
   ========================================================= */

function obtenerPedidos() {
    return leerLS("pedidos", []);
}

function guardarPedidos(lista) {
    guardarLS("pedidos", lista);
}



/* =========================================================
   3. FILTRAR SOLO PEDIDOS REALIZADOS
   ========================================================= */

function pedidosRealizados() {
    const pedidos = obtenerPedidos();
    return pedidos.filter(p => p.estado === "realizado");
}



/* =========================================================
   4. MOVER PEDIDO A PAPELERA (estado: eliminado)
   ========================================================= */

function moverAPapelera(id) {
    const idNum = Number(id); // ← NORMALIZACIÓN

    const pedidos = obtenerPedidos();
    const pedido = pedidos.find(p => Number(p.id) === idNum);

    if (!pedido) return;

    pedido.estado = "eliminado";
    guardarPedidos(pedidos);
    mostrarRealizados();
}



/* =========================================================
   5. EXPANDIR / COLAPSAR TARJETA
   ========================================================= */

function toggleExpand(id) {
    const idStr = String(id); // ← NORMALIZACIÓN
    const tarjeta = document.getElementById("realizado-" + idStr);

    if (!tarjeta) return; // ← PREVENCIÓN DE ERRORES

    tarjeta.classList.toggle("expandido");
}



/* =========================================================
   6. CREAR TARJETA HTML PARA UN PEDIDO REALIZADO
   ========================================================= */

function crearTarjetaRealizado(p) {

    const extrasTexto = p.extras?.length
        ? p.extras.map(e => e.nombre || e.id).join(", ")
        : "Ninguno";

    const monedaMostrar = p.moneda === "bs" ? "Bs" : p.moneda.toUpperCase();
    const precioTexto = `${formatearNumero(p.precio)} ${monedaMostrar}`;

    const idStr = String(p.id); // ← NORMALIZACIÓN

    return `
        <div class="card pedido-item minimizado" id="realizado-${idStr}">

            <div class="pedido-header">
                <strong>${p.productoTexto}</strong>
                <span>${p.cliente.nombre}</span>
                <span>${precioTexto}</span>

                <div class="pedido-botones">
                    <button class="btn-restore" onclick="toggleExpand('${idStr}')">▼</button>
                    <button class="btn-del" onclick="moverAPapelera('${idStr}')">✖</button>
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
   7. MOSTRAR PEDIDOS REALIZADOS
   ========================================================= */

function mostrarRealizados() {
    const realizados = pedidosRealizados();

    if (realizados.length === 0) {
        listaRealizados.innerHTML = `
            <p style="opacity:0.6; text-align:center; margin-top:20px;">
                No hay pedidos realizados aún.
            </p>
        `;
        return;
    }

    listaRealizados.innerHTML = realizados
        .map(p => crearTarjetaRealizado(p))
        .join("");
}



/* =========================================================
   8. INICIALIZACIÓN
   ========================================================= */

mostrarRealizados();
