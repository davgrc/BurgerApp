/* =========================================================
   TASAS.JS
   Motor universal de conversión de monedas (USD, BS, COP)
   ========================================================= */


/* =========================================================
   1. GUARDAR TASAS EN LOCALSTORAGE
   ========================================================= */

function guardarTasas(tasas) {
    guardarLS("tasas", tasas);
}



/* =========================================================
   2. OBTENER TASAS DESDE LOCALSTORAGE
   ========================================================= */

function obtenerTasas() {
    return leerLS("tasas", {
        usd_cop: 0,
        usd_ves: 0   // ← AHORA COINCIDE CON AJUSTES
    });
}



/* =========================================================
   3. CONVERTIR ENTRE MONEDAS
   ========================================================= */

function convertir(valor, desde, hacia) {
    const tasas = obtenerTasas();

    const usd_cop = parseFloat(tasas.usd_cop) || 0;
    const usd_ves = parseFloat(tasas.usd_ves) || 0;  // ← CORREGIDO

    if (desde === hacia) return valor;

    /* ============================
       1. CONVERSIONES DIRECTAS
       ============================ */

    // USD → COP
    if (desde === "usd" && hacia === "cop") {
        return valor * usd_cop;
    }

    // USD → BS
    if (desde === "usd" && hacia === "bs") {
        return valor * usd_ves;
    }

    // COP → USD
    if (desde === "cop" && hacia === "usd") {
        return valor / usd_cop;
    }

    // BS → USD
    if (desde === "bs" && hacia === "usd") {
        return valor / usd_ves;
    }


    /* ============================
       2. CONVERSIONES INDIRECTAS
       ============================ */

    // COP → BS  (COP → USD → BS)
    if (desde === "cop" && hacia === "bs") {
        const usd = valor / usd_cop;
        return usd * usd_ves;
    }

    // BS → COP  (BS → USD → COP)
    if (desde === "bs" && hacia === "cop") {
        const usd = valor / usd_ves;
        return usd * usd_cop;
    }

    return 0;
}



/* =========================================================
   4. FORMATEAR MONTO CON MONEDA
   ========================================================= */

function formatearMoneda(valor, moneda) {
    const num = formatearNumero(valor);
    return `${num} ${moneda.toUpperCase()}`;
}
