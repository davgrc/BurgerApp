/* =========================================================
   GLOBAL.JS
   Funciones universales para toda la aplicación
   ========================================================= */


/* =========================================================
   1. FORMATEAR NÚMEROS (1.250.000,00)
   ========================================================= */

function formatearNumero(num) {
    if (num === null || num === undefined || num === "") return "0";

    return Number(num).toLocaleString("es-VE", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}



/* =========================================================
   2. FORMATEAR TELÉFONOS
   ========================================================= */

function formatearTelefono(numero, codigoPais) {

    // Venezuela (+58)
    if (codigoPais === "+58") {
        let limpio = numero.replace(/\D/g, "");

        if (limpio.length >= 11) {
            return limpio.slice(0, 4) + "-" + limpio.slice(4);
        }

        return limpio;
    }

    // Otros países
    let limpio = numero.replace(/\D/g, "");
    return limpio.replace(/(.{3})/g, "$1 ").trim();
}



/* =========================================================
   3. FECHA ACTUAL (YYYY-MM-DD)
   ========================================================= */

function fechaActualClave() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
}



/* =========================================================
   4. FECHA HUMANA
   ========================================================= */

function fechaHumana(fechaTexto) {
    const fecha = new Date(fechaTexto);

    const dias = [
        "Domingo", "Lunes", "Martes", "Miércoles",
        "Jueves", "Viernes", "Sábado"
    ];

    const meses = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];

    const diaSemana = dias[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();

    return {
        diaSemana,
        fechaCompleta: `${dia} ${mes} ${año}`
    };
}



/* =========================================================
   5. GUARDAR EN LOCALSTORAGE
   ========================================================= */

function guardarLS(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
}



/* =========================================================
   6. LEER DE LOCALSTORAGE
   ========================================================= */

function leerLS(clave, defecto = null) {
    const data = localStorage.getItem(clave);
    return data ? JSON.parse(data) : defecto;
}



/* =========================================================
   7. GENERAR ID ÚNICO
   ========================================================= */

function generarID() {
    return Date.now();
}



/* =========================================================
   8. VALIDAR CAMPOS VACÍOS
   ========================================================= */

function campoVacio(valor) {
    return valor === null || valor === undefined || valor === "";
}



/* =========================================================
   9. ALERTA SIMPLE
   ========================================================= */

function alerta(msg) {
    alert(msg);
}



/* =========================================================
   10. EXPANDIR / COLAPSAR TARJETAS (ESTADÍSTICAS)
   ========================================================= */

function toggleStat(card) {
    card.classList.toggle("expandido");
}



/* =========================================================
   11. TARJETAS PLEGABLES UNIVERSALES (AJUSTES)
   ========================================================= */

function toggleFold(card) {
    card.classList.toggle("open");
}
