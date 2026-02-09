/* =========================================================
   GASTOS.JS
   Sistema completo de gastos con filtros HOY / SEMANA / MES / AÑO
   ========================================================= */


/* =========================================================
   1. REFERENCIAS AL DOM
   ========================================================= */

const listaGastos = document.getElementById("listaGastos");
const botonesFiltro = document.querySelectorAll(".filtro-btn");

let modoVista = "hoy"; // hoy, semana, mes, año



/* =========================================================
   2. FUNCIONES BASE DE LOCALSTORAGE
   ========================================================= */

function obtenerGastos() {
    return leerLS("gastos", []);
}

function guardarGastos(lista) {
    guardarLS("gastos", lista);
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
   4. FILTRAR GASTOS SEGÚN EL RANGO
   ========================================================= */

function filtrarGastosPorRango() {
    const gastos = obtenerGastos();
    const { inicio, fin } = obtenerRangoFechas();

    return gastos.filter(g =>
        g.estado !== "eliminado" &&   // NO mostrar eliminados
        g.fecha >= inicio &&
        g.fecha <= fin
    );
}



/* =========================================================
   5. ELIMINAR GASTO
   ========================================================= */

function eliminarGasto(id) {
    id = Number(id);

    const gastos = obtenerGastos();
    const gasto = gastos.find(g => g.id === id);

    if (!gasto) return;

    gasto.estado = "eliminado";
    guardarGastos(gastos);
    mostrarGastos(); // recargar lista
}



/* =========================================================
   6. EXPANDIR / COLAPSAR TARJETA
   ========================================================= */

function toggleExpand(id) {
    const tarjeta = document.getElementById("gasto-" + id);
    tarjeta.classList.toggle("expandido");
}



/* =========================================================
   7. CREAR TARJETA HTML
   ========================================================= */

function crearTarjetaGasto(g) {

    const monedaMostrar = g.moneda === "bs" ? "Bs" : g.moneda.toUpperCase();
    const montoTexto = `${formatearNumero(g.monto)} ${monedaMostrar}`;

    // Fecha corta estilo: 09 Feb 26
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
                    <button class="btn-del" onclick="eliminarGasto('${g.id}')">✖</button>
                </div>

            </div>

        </div>
    `;
}



/* =========================================================
   8. MOSTRAR GASTOS
   ========================================================= */

function mostrarGastos() {
    const gastos = filtrarGastosPorRango();

    if (gastos.length === 0) {
        listaGastos.innerHTML = `
            <p style="opacity:0.6; text-align:center; margin-top:20px;">
                No hay gastos en este rango.
            </p>
        `;
        return;
    }

    listaGastos.innerHTML = gastos
        .map(g => crearTarjetaGasto(g))
        .join("");
}



/* =========================================================
   9. EVENTOS DE LOS BOTONES DE FILTRO
   ========================================================= */

botonesFiltro.forEach(btn => {
    btn.addEventListener("click", () => {
        botonesFiltro.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        modoVista = btn.dataset.modo;
        mostrarGastos();
    });
});



/* =========================================================
   10. INICIALIZACIÓN
   ========================================================= */

mostrarGastos();
