/* =========================================================
   DASHBOARD.JS
   ========================================================= */


/* =========================================================
   1. REFERENCIAS AL DOM
   ========================================================= */

const sideMenu = document.getElementById("sideMenu");
const btnMenu = document.getElementById("btnMenu");

const monedaBtns = document.querySelectorAll(".moneda-btn");
const filtroBtns = document.querySelectorAll(".filtro-btn");

const ingBs = document.getElementById("ingBs");
const ingUsd = document.getElementById("ingUsd");
const ingCop = document.getElementById("ingCop");
const ingTotal = document.getElementById("ingTotal");

const gasBs = document.getElementById("gasBs");
const gasUsd = document.getElementById("gasUsd");
const gasCop = document.getElementById("gasCop");
const gasTotal = document.getElementById("gasTotal");

const gananciaDia = document.getElementById("gananciaDia");



/* =========================================================
   2. FUNCIÓN DEL MENÚ LATERAL (MOVER AQUÍ)
   ========================================================= */

function toggleMenuGroup(titleEl) {
    const group = titleEl.parentElement;
    group.classList.toggle("open");
}



/* =========================================================
   3. MENÚ LATERAL
   ========================================================= */

btnMenu.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
});

document.addEventListener("click", (e) => {
    if (!sideMenu.contains(e.target) && e.target !== btnMenu) {
        sideMenu.classList.remove("open");
    }
});



/* =========================================================
   4. ESTADO INICIAL
   ========================================================= */

let monedaActual = "usd";
let modoVistaDashboard = "hoy";

function sincronizarBotonesIniciales() {
    monedaBtns.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.moneda === monedaActual);
    });

    filtroBtns.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.modo === modoVistaDashboard);
    });
}



/* =========================================================
   5. CAMBIAR MONEDA
   ========================================================= */

monedaBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        monedaActual = btn.dataset.moneda;

        monedaBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        actualizarDashboard();
    });
});



/* =========================================================
   6. CAMBIAR RANGO
   ========================================================= */

filtroBtns.forEach(btn => {
    btn.addEventListener("click", () => {

        filtroBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        modoVistaDashboard = btn.dataset.modo;

        actualizarDashboard();
    });
});



/* =========================================================
   7. RANGO DE FECHAS
   ========================================================= */

function obtenerRangoFechasDashboard() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = hoy.getMonth();
    const dia = hoy.getDate();

    let inicio, fin;

    if (modoVistaDashboard === "hoy") {
        inicio = fin = fechaActualClave();
    }

    if (modoVistaDashboard === "semana") {
        const lunes = new Date(hoy);
        lunes.setDate(dia - hoy.getDay() + 1);
        inicio = lunes.toISOString().split("T")[0];
        fin = fechaActualClave();
    }

    if (modoVistaDashboard === "mes") {
        const primeroMes = new Date(año, mes, 1);
        inicio = primeroMes.toISOString().split("T")[0];
        fin = fechaActualClave();
    }

    if (modoVistaDashboard === "año") {
        const primeroAño = new Date(año, 0, 1);
        inicio = primeroAño.toISOString().split("T")[0];
        fin = fechaActualClave();
    }

    return { inicio, fin };
}



/* =========================================================
   8. INGRESOS
   ========================================================= */

function obtenerIngresosReales() {
    const pedidos = leerLS("pedidos", []);
    const { inicio, fin } = obtenerRangoFechasDashboard();

    const realizados = pedidos.filter(p =>
        p.estado === "realizado" &&
        p.fecha >= inicio &&
        p.fecha <= fin
    );

    let total = { bs: 0, usd: 0, cop: 0 };

    realizados.forEach(p => {
        total[p.moneda] += p.precio;
    });

    return total;
}



/* =========================================================
   9. GASTOS
   ========================================================= */

function obtenerGastosReales() {
    const gastos = leerLS("gastos", []);
    const { inicio, fin } = obtenerRangoFechasDashboard();

    const delRango = gastos.filter(g =>
        g.estado !== "eliminado" &&
        g.fecha >= inicio &&
        g.fecha <= fin
    );

    let total = { bs: 0, usd: 0, cop: 0 };

    delRango.forEach(g => {
        total[g.moneda] += g.monto;
    });

    return total;
}



/* =========================================================
   10. ACTUALIZAR DASHBOARD
   ========================================================= */

function actualizarDashboard() {

    const ingresos = obtenerIngresosReales();
    const gastos = obtenerGastosReales();

    ingBs.textContent = formatearNumero(ingresos.bs);
    ingUsd.textContent = formatearNumero(ingresos.usd);
    ingCop.textContent = formatearNumero(ingresos.cop);

    gasBs.textContent = formatearNumero(gastos.bs);
    gasUsd.textContent = formatearNumero(gastos.usd);
    gasCop.textContent = formatearNumero(gastos.cop);

    const totalIngresos =
        convertir(ingresos.usd, "usd", monedaActual) +
        convertir(ingresos.bs, "bs", monedaActual) +
        convertir(ingresos.cop, "cop", monedaActual);

    const totalGastos =
        convertir(gastos.usd, "usd", monedaActual) +
        convertir(gastos.bs, "bs", monedaActual) +
        convertir(gastos.cop, "cop", monedaActual);

    ingTotal.textContent = formatearNumero(totalIngresos);
    gasTotal.textContent = formatearNumero(totalGastos);

    gananciaDia.textContent = formatearNumero(totalIngresos - totalGastos);
}



/* =========================================================
   11. INICIALIZACIÓN
   ========================================================= */

sincronizarBotonesIniciales();
actualizarDashboard();
