/* =========================================================
   PEDIDOS.JS — Versión FINAL minimalista + chips + estado pago
   ========================================================= */


/* =========================================================
   1. REFERENCIAS AL DOM
   ========================================================= */

const listaPedidos = document.getElementById("listaPedidos");
const botonesFiltro = document.querySelectorAll(".filtro-btn");

let modoVista = "hoy"; // hoy, semana, mes, año



/* =========================================================
   2. FUNCIONES BASE DE LOCALSTORAGE
   ========================================================= */

function obtenerPedidos() {
    return leerLS("pedidos", []);
}

function guardarPedidos(lista) {
    guardarLS("pedidos", lista);
}



/* =========================================================
   3. CALCULAR RANGOS DE FECHA
   ========================================================= */

function obtenerRangoFechas() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = hoy.getMonth();
    const dia = hoy.getDate();

    let inicio, fin;

    if (modoVista === "hoy") {
        inicio = fin = fechaActualClave();
    }

    if (modoVista === "semana") {
        const lunes = new Date(hoy);
        lunes.setDate(dia - hoy.getDay() + 1);
        inicio = lunes.toISOString().split("T")[0];
        fin = fechaActualClave();
    }

    if (modoVista === "mes") {
        const primeroMes = new Date(año, mes, 1);
        inicio = primeroMes.toISOString().split("T")[0];
        fin = fechaActualClave();
    }

    if (modoVista === "año") {
        const primeroAño = new Date(año, 0, 1);
        inicio = primeroAño.toISOString().split("T")[0];
        fin = fechaActualClave();
    }

    return { inicio, fin };
}



/* =========================================================
   4. FILTRAR PEDIDOS SEGÚN EL RANGO
   ========================================================= */

function filtrarPedidosPorRango() {
    const pedidos = obtenerPedidos();
    const { inicio, fin } = obtenerRangoFechas();

    return pedidos.filter(p =>
        p.estado === "pendiente" &&
        p.fecha >= inicio &&
        p.fecha <= fin
    );
}



/* =========================================================
   5. MARCAR PEDIDO COMO REALIZADO
   ========================================================= */

function marcarPedidoRealizado(id) {
    id = Number(id);

    const pedidos = obtenerPedidos();
    const pedido = pedidos.find(p => p.id === id);

    if (!pedido) return;

    pedido.estado = "realizado";
    guardarPedidos(pedidos);
    mostrarPedidos();
}



/* =========================================================
   6. MARCAR PEDIDO COMO ELIMINADO
   ========================================================= */

function eliminarPedido(id) {
    id = Number(id);

    const pedidos = obtenerPedidos();
    const pedido = pedidos.find(p => p.id === id);

    if (!pedido) return;

    pedido.estado = "eliminado";
    guardarPedidos(pedidos);
    mostrarPedidos();
}



/* =========================================================
   7. EXPANDIR / COLAPSAR TARJETA
   ========================================================= */

function toggleExpand(id) {
    const tarjeta = document.getElementById("pedido-" + id);
    tarjeta.classList.toggle("expandido");
}



/* =========================================================
   8. CREAR CHIP DE ESTADO DE PAGO (MINIMALISTA)
   ========================================================= */

function crearChipEstadoPago(p) {
    const recibido = convertir(p.dineroRecibido, p.monedaRecibida, p.moneda);
    const diferencia = recibido - p.precio;

    if (diferencia < 0) {
        return `<span class="chip chip-rojo">Faltan ${formatearNumero(Math.abs(diferencia))} ${p.moneda.toUpperCase()}</span>`;
    }

    if (diferencia === 0) {
        return `<span class="chip chip-verde">Exacto</span>`;
    }

    if (p.vueltosEntregados) {
        return `<span class="chip chip-azul">Vueltos ✔</span>`;
    }

    return `<span class="chip chip-amarillo">+${formatearNumero(diferencia)} ${p.moneda.toUpperCase()}</span>`;
}



/* =========================================================
   9. CREAR TARJETA HTML
   ========================================================= */

function crearTarjetaPedido(p) {

    const extrasHTML = p.extras?.length
    ? p.extras.map(e => `
        <div class="extra-chip-pedido">
            <span class="nombre">${e.nombre}</span>
        </div>
    `).join("")
    : `<span style="opacity:0.6;">Ninguno</span>`;


    const monedaMostrar = p.moneda === "bs" ? "Bs" : p.moneda.toUpperCase();
    const precioTexto = `${formatearNumero(p.precio)} ${monedaMostrar}`;

    const chipPago = crearChipEstadoPago(p);

    return `
        <div class="card pedido-item" id="pedido-${p.id}">

            <div class="pedido-header">
                <div>
                    <strong>${p.productoTexto}</strong>
                    <p style="opacity:0.7; font-size:13px;">${p.cliente.nombre}</p>
                </div>

                <div class="precio">${precioTexto}</div>
            </div>

            <div class="pedido-acciones">
                <button class="btn-ver" onclick="toggleExpand('${p.id}')">Ver</button>
                <button class="btn-ok" onclick="marcarPedidoRealizado('${p.id}')">✔</button>
                <button class="btn-del" onclick="eliminarPedido('${p.id}')">✖</button>
            </div>

            <div class="pedido-detalles">
                <p><strong>Dirección:</strong> ${p.cliente.direccion}</p>
                <p><strong>Tel:</strong> ${p.cliente.telefono}</p>

                <p><strong>Extras:</strong></p>
                <div class="extras-list">${extrasHTML}</div>

                <p><strong>Pago:</strong> ${chipPago}</p>
            </div>

        </div>
    `;
}



/* =========================================================
   10. MOSTRAR PEDIDOS
   ========================================================= */

function mostrarPedidos() {
    const pedidos = filtrarPedidosPorRango();

    if (pedidos.length === 0) {
        listaPedidos.innerHTML = `
            <p style="opacity:0.6; text-align:center; margin-top:20px;">
                No hay pedidos en este rango.
            </p>
        `;
        return;
    }

    listaPedidos.innerHTML = pedidos
        .map(p => crearTarjetaPedido(p))
        .join("");
}



/* =========================================================
   11. EVENTOS DE LOS BOTONES DE FILTRO
   ========================================================= */

botonesFiltro.forEach(btn => {
    btn.addEventListener("click", () => {
        botonesFiltro.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        modoVista = btn.dataset.modo;
        mostrarPedidos();
    });
});



/* =========================================================
   12. INICIALIZACIÓN
   ========================================================= */

mostrarPedidos();
