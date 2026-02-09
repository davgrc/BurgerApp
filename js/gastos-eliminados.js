/* =========================================================
   GASTOS ELIMINADOS
   ========================================================= */

const lista = document.getElementById("listaGastosEliminados");


/* =========================================================
   CARGAR GASTOS ELIMINADOS
   ========================================================= */

function cargarGastosEliminados() {
    const gastos = leerLS("gastos", []);
    const eliminados = gastos.filter(g => g.estado === "eliminado");

    lista.innerHTML = "";

    if (eliminados.length === 0) {
        lista.innerHTML = `
            <p style="opacity:0.7; text-align:center; margin-top:20px;">
                No hay gastos eliminados.
            </p>
        `;
        return;
    }

    eliminados.forEach(g => {
        lista.innerHTML += crearTarjetaGastoEliminado(g);
    });
}


/* =========================================================
   TARJETA DE GASTO ELIMINADO
   ========================================================= */

function crearTarjetaGastoEliminado(g) {

    const monedaMostrar = g.moneda === "bs" ? "Bs" : g.moneda.toUpperCase();
    const montoTexto = `${formatearNumero(g.monto)} ${monedaMostrar}`;

    // Fecha corta
    const fechaObj = new Date(g.fecha);
    const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const fechaCorta = `${String(fechaObj.getDate()).padStart(2,"0")} ${meses[fechaObj.getMonth()]} ${String(fechaObj.getFullYear()).slice(2)}`;

    return `
    <div class="card pedido-item" id="gasto-${g.id}">

        <div class="pedido-header">

            <div>
                <p style="opacity:0.7; font-size:13px;">
                    ${g.categoriaNombre} → ${g.subcategoriaNombre}
                </p>

                <strong>${g.titulo}</strong>

                <p style="opacity:0.5; font-size:12px; margin-top:4px;">
                    ${fechaCorta}
                </p>
            </div>

            <div style="text-align:right;">
                <div class="precio">${montoTexto}</div>

                <div style="display:flex; gap:6px; margin-top:6px; justify-content:flex-end;">
                    <button class="btn-restore" onclick="restaurarGasto('${g.id}')">
                        ↩
                    </button>

                    <button class="btn-del" onclick="eliminarDefinitivo('${g.id}')">
                        ✖
                    </button>
                </div>
            </div>

        </div>

    </div>
`;

}


/* =========================================================
   RESTAURAR GASTO
   ========================================================= */

function restaurarGasto(id) {
    id = Number(id); // ← CORRECCIÓN CRÍTICA

    const gastos = leerLS("gastos", []);
    const idx = gastos.findIndex(g => g.id === id);

    if (idx !== -1) {

        // Quitar estado eliminado → vuelve a ser gasto normal
        delete gastos[idx].estado;

        guardarLS("gastos", gastos);

        // Recargar lista de eliminados
        cargarGastosEliminados();
    }
}


/* =========================================================
   ELIMINAR DEFINITIVAMENTE
   ========================================================= */

function eliminarDefinitivo(id) {
    id = Number(id); // ← TAMBIÉN NECESARIO

    let gastos = leerLS("gastos", []);
    gastos = gastos.filter(g => g.id !== id);

    guardarLS("gastos", gastos);
    cargarGastosEliminados();
}


/* =========================================================
   INICIALIZAR
   ========================================================= */

cargarGastosEliminados();
