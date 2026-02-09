/* =========================================================
   ESTADISTICAS.JS — Versión con filtros + rango personalizado
   ========================================================= */


/* =========================================================
   0. VARIABLES DE FILTRO
   ========================================================= */

let modoVistaEst = "hoy"; // hoy, semana, mes, año, personalizado

let rangoPersonalizado = {
    inicio: null,
    fin: null
};


/* =========================================================
   1. UTILIDADES
   ========================================================= */

function getPedidosRealizados() {
    const pedidos = leerLS("pedidos", []);
    return pedidos.filter(p => p.estado === "realizado");
}

function getGastosActivos() {
    const gastos = leerLS("gastos", []);
    return gastos.filter(g => g.estado !== "eliminado");
}

function getProductos() {
    return leerLS("productos", []);
}

function getExtras() {
    return leerLS("extras", []);
}

function getCategorias() {
    return leerLS("categorias", []);
}

function getSubcategorias() {
    return leerLS("subcategorias", []);
}



/* =========================================================
   2. RANGO DE FECHAS PARA ESTADÍSTICAS
   ========================================================= */

function obtenerRangoFechasEst() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = hoy.getMonth();
    const dia = hoy.getDate();

    let inicio, fin;

    if (modoVistaEst === "hoy") {
        inicio = fin = fechaActualClave();
    }

    if (modoVistaEst === "semana") {
        const lunes = new Date(hoy);
        lunes.setDate(dia - hoy.getDay() + 1);
        inicio = lunes.toISOString().split("T")[0];
        fin = fechaActualClave();
    }

    if (modoVistaEst === "mes") {
        const primeroMes = new Date(año, mes, 1);
        inicio = primeroMes.toISOString().split("T")[0];
        fin = fechaActualClave();
    }

    if (modoVistaEst === "año") {
        const primeroAño = new Date(año, 0, 1);
        inicio = primeroAño.toISOString().split("T")[0];
        fin = fechaActualClave();
    }

    if (modoVistaEst === "personalizado") {
        inicio = rangoPersonalizado.inicio;
        fin = rangoPersonalizado.fin;
    }

    return { inicio, fin };
}



/* =========================================================
   3. FILTRAR PEDIDOS Y GASTOS SEGÚN RANGO
   ========================================================= */

function filtrarPedidosPorRango() {
    const pedidos = getPedidosRealizados();
    const { inicio, fin } = obtenerRangoFechasEst();

    return pedidos.filter(p =>
        p.fecha >= inicio &&
        p.fecha <= fin
    );
}

function filtrarGastosPorRango() {
    const gastos = getGastosActivos();
    const { inicio, fin } = obtenerRangoFechasEst();

    return gastos.filter(g =>
        g.fecha >= inicio &&
        g.fecha <= fin
    );
}



/* =========================================================
   4. TARJETA: VENTAS (RESUMEN)
   ========================================================= */

function statsVentasResumen() {
    const pedidos = filtrarPedidosPorRango();

    let totalUSD = 0, totalBS = 0, totalCOP = 0;

    pedidos.forEach(p => {
        if (p.moneda === "usd") totalUSD += p.precio;
        if (p.moneda === "bs") totalBS += p.precio;
        if (p.moneda === "cop") totalCOP += p.precio;
    });

    const promedio = pedidos.length ? totalUSD / pedidos.length : 0;

    return {
        totalUSD,
        totalBS,
        totalCOP,
        cantidad: pedidos.length,
        promedio,
        ultimaFecha: pedidos.length ? pedidos[pedidos.length - 1].fecha : "Sin datos"
    };
}

function renderVentasResumen() {
    const s = statsVentasResumen();
    document.getElementById("statsVentasResumen").innerHTML = `
        <div class="bloque">
            <div class="stat-item"><span>Total USD</span><span class="stat-number">${formatearNumero(s.totalUSD)}</span></div>
            <div class="stat-item"><span>Total Bs</span><span class="stat-number">${formatearNumero(s.totalBS)}</span></div>
            <div class="stat-item"><span>Total COP</span><span class="stat-number">${formatearNumero(s.totalCOP)}</span></div>
            <div class="stat-item"><span>Pedidos realizados</span><span class="stat-number">${s.cantidad}</span></div>
            <div class="stat-item"><span>Promedio por pedido (USD)</span><span class="stat-number">${formatearNumero(s.promedio)}</span></div>
            <div class="stat-item"><span>Última venta</span><span class="stat-number">${s.ultimaFecha}</span></div>
        </div>
    `;
}



/* =========================================================
   5. TARJETA: PRODUCTOS
   ========================================================= */

function statsProductos() {
    const pedidos = filtrarPedidosPorRango();
    const productos = getProductos();

    const conteo = {};

    pedidos.forEach(p => {
        conteo[p.productoID] = (conteo[p.productoID] || 0) + 1;
    });

    const lista = Object.entries(conteo).map(([id, cantidad]) => {
        const prod = productos.find(p => p.id == id);
        return {
            nombre: prod?.nombre || "Desconocido",
            cantidad
        };
    });

    lista.sort((a, b) => b.cantidad - a.cantidad);

    return {
        masVendido: lista[0] || { nombre: "Sin datos", cantidad: 0 },
        menosVendido: lista[lista.length - 1] || { nombre: "Sin datos", cantidad: 0 },
        lista
    };
}

function renderProductos() {
    const s = statsProductos();

    const listaHTML = s.lista.map(p => `
        <div class="stat-item">
            <span>${p.nombre}</span>
            <span class="stat-number">${p.cantidad}</span>
        </div>
    `).join("");

    document.getElementById("statsProductos").innerHTML = `
        <div class="bloque">
            <div class="stat-item"><span>Más vendido</span><span class="stat-number">${s.masVendido.nombre}</span></div>
            <div class="stat-item"><span>Menos vendido</span><span class="stat-number">${s.menosVendido.nombre}</span></div>
        </div>

        <h3 class="subtitulo">Lista</h3>
        <div class="bloque">${listaHTML || "<p>Sin datos</p>"}</div>
    `;
}



/* =========================================================
   6. TARJETA: EXTRAS
   ========================================================= */

function statsExtras() {
    const pedidos = filtrarPedidosPorRango();
    const extras = getExtras();

    const conteo = {};

    pedidos.forEach(p => {
        p.extras?.forEach(e => {
            conteo[e.id] = (conteo[e.id] || 0) + 1;
        });
    });

    const lista = Object.entries(conteo).map(([id, cantidad]) => {
        const extra = extras.find(x => x.id == id);
        return {
            nombre: extra?.nombre || "Desconocido",
            cantidad
        };
    });

    lista.sort((a, b) => b.cantidad - a.cantidad);

    return {
        masVendido: lista[0] || { nombre: "Sin datos", cantidad: 0 },
        menosVendido: lista[lista.length - 1] || { nombre: "Sin datos", cantidad: 0 },
        lista
    };
}

function renderExtras() {
    const s = statsExtras();

    const listaHTML = s.lista.map(e => `
        <div class="stat-item">
            <span>${e.nombre}</span>
            <span class="stat-number">${e.cantidad}</span>
        </div>
    `).join("");

    document.getElementById("statsExtras").innerHTML = `
        <div class="bloque">
            <div class="stat-item"><span>Más vendido</span><span class="stat-number">${s.masVendido.nombre}</span></div>
            <div class="stat-item"><span>Menos vendido</span><span class="stat-number">${s.menosVendido.nombre}</span></div>
        </div>

        <h3 class="subtitulo">Lista</h3>
        <div class="bloque">${listaHTML || "<p>Sin datos</p>"}</div>
    `;
}



/* =========================================================
   7. TARJETA: CLIENTES
   ========================================================= */

function statsClientes() {
    const pedidos = filtrarPedidosPorRango();

    const conteo = {};

    pedidos.forEach(p => {
        const nombre = p.cliente?.nombre || "Desconocido";
        conteo[nombre] = (conteo[nombre] || 0) + 1;
    });

    const lista = Object.entries(conteo).map(([nombre, cantidad]) => ({
        nombre,
        cantidad
    }));

    lista.sort((a, b) => b.cantidad - a.cantidad);

    return {
        masFrecuente: lista[0] || { nombre: "Sin datos", cantidad: 0 },
        totalUnicos: lista.length,
        lista
    };
}

function renderClientes() {
    const s = statsClientes();

    const listaHTML = s.lista.map(c => `
        <div class="stat-item">
            <span>${c.nombre}</span>
            <span class="stat-number">${c.cantidad}</span>
        </div>
    `).join("");

    document.getElementById("statsClientes").innerHTML = `
        <div class="bloque">
            <div class="stat-item"><span>Cliente frecuente</span><span class="stat-number">${s.masFrecuente.nombre}</span></div>
            <div class="stat-item"><span>Clientes únicos</span><span class="stat-number">${s.totalUnicos}</span></div>
        </div>

        <h3 class="subtitulo">Lista</h3>
        <div class="bloque">${listaHTML || "<p>Sin datos</p>"}</div>
    `;
}



/* =========================================================
   8. TARJETA: GASTOS (RESUMEN)
   ========================================================= */

function statsGastosResumen() {
    const gastos = filtrarGastosPorRango();

    let totalUSD = 0, totalBS = 0, totalCOP = 0;

    gastos.forEach(g => {
        if (g.moneda === "usd") totalUSD += g.monto;
        if (g.moneda === "bs") totalBS += g.monto;
        if (g.moneda === "cop") totalCOP += g.monto;
    });

    const masCostoso = gastos.reduce((a, b) => a.monto > b.monto ? a : b, { titulo: "Sin datos" });

    const conteo = {};
    gastos.forEach(g => conteo[g.titulo] = (conteo[g.titulo] || 0) + 1);

    const masRec = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0]?.[0] || "Sin datos";

    return {
        totalUSD,
        totalBS,
        totalCOP,
        masCostoso: masCostoso.titulo,
        masRecurrente: masRec
    };
}

function renderGastosResumen() {
    const s = statsGastosResumen();

    document.getElementById("statsGastosResumen").innerHTML = `
        <div class="bloque">
            <div class="stat-item"><span>Total USD</span><span class="stat-number">${formatearNumero(s.totalUSD)}</span></div>
            <div class="stat-item"><span>Total Bs</span><span class="stat-number">${formatearNumero(s.totalBS)}</span></div>
            <div class="stat-item"><span>Total COP</span><span class="stat-number">${formatearNumero(s.totalCOP)}</span></div>
            <div class="stat-item"><span>Más costoso</span><span class="stat-number">${s.masCostoso}</span></div>
            <div class="stat-item"><span>Más recurrente</span><span class="stat-number">${s.masRecurrente}</span></div>
        </div>
    `;
}



/* =========================================================
   9. TARJETA: CATEGORÍAS DE GASTOS (USD)
   ========================================================= */

function statsCategoriasGasto() {
    const gastos = filtrarGastosPorRango();

    const totales = {};

    gastos.forEach(g => {
        const montoUSD = convertir(g.monto, g.moneda, "usd");
        totales[g.categoriaNombre] = (totales[g.categoriaNombre] || 0) + montoUSD;
    });

    return Object.entries(totales)
        .map(([cat, total]) => ({ cat, total }))
        .sort((a, b) => b.total - a.total);
}

function renderCategoriasGasto() {
    const lista = statsCategoriasGasto();

    const html = lista.map(c => `
        <div class="stat-item">
            <span>${c.cat}</span>
            <span class="stat-number">${formatearNumero(c.total)}</span>
        </div>
    `).join("");

    document.getElementById("statsCategoriasGasto").innerHTML = `
        <div class="bloque">${html || "<p>Sin datos</p>"}</div>
    `;
}



/* =========================================================
   10. TARJETA: SUBCATEGORÍAS DE GASTOS (USD)
   ========================================================= */

function statsSubcategoriasGasto() {
    const gastos = filtrarGastosPorRango();

    const totales = {};

    gastos.forEach(g => {
        const montoUSD = convertir(g.monto, g.moneda, "usd");
        totales[g.subcategoriaNombre] = (totales[g.subcategoriaNombre] || 0) + montoUSD;
    });

    return Object.entries(totales)
        .map(([sub, total]) => ({ sub, total }))
        .sort((a, b) => b.total - a.total);
}

function renderSubcategoriasGasto() {
    const lista = statsSubcategoriasGasto();

    const html = lista.map(s => `
        <div class="stat-item">
            <span>${s.sub}</span>
            <span class="stat-number">${formatearNumero(s.total)}</span>
        </div>
    `).join("");

    document.getElementById("statsSubcategoriasGasto").innerHTML = `
        <div class="bloque">${html || "<p>Sin datos</p>"}</div>
    `;
}



/* =========================================================
   11. TARJETA: RENTABILIDAD
   ========================================================= */

function statsRentabilidad() {
    const pedidos = filtrarPedidosPorRango();
    const gastos = filtrarGastosPorRango();

    let ingresosUSD = 0;
    pedidos.forEach(p => ingresosUSD += convertir(p.precio, p.moneda, "usd"));

    let gastosUSD = 0;
    gastos.forEach(g => gastosUSD += convertir(g.monto, g.moneda, "usd"));

    const ganancia = ingresosUSD - gastosUSD;
    const margen = ingresosUSD ? (ganancia / ingresosUSD) * 100 : 0;

    return {
        ingresosUSD,
        gastosUSD,
        ganancia,
        margen,
        estado: ganancia >= 0 ? "🟢 Rentable" : "🔴 En pérdida"
    };
}

function renderRentabilidad() {
    const s = statsRentabilidad();

    document.getElementById("statsRentabilidad").innerHTML = `
        <div class="bloque">
            <div class="stat-item"><span>Ingresos USD</span><span class="stat-number">${formatearNumero(s.ingresosUSD)}</span></div>
            <div class="stat-item"><span>Gastos USD</span><span class="stat-number">${formatearNumero(s.gastosUSD)}</span></div>
            <div class="stat-item"><span>Ganancia USD</span><span class="stat-number">${formatearNumero(s.ganancia)}</span></div>
            <div class="stat-item"><span>Margen</span><span class="stat-number">${s.margen.toFixed(1)}%</span></div>
            <div class="stat-item"><span>Estado</span><span class="stat-number">${s.estado}</span></div>
        </div>
    `;
}



/* =========================================================
   12. RENDER GENERAL
   ========================================================= */

function renderTodo() {
    renderVentasResumen();
    renderProductos();
    renderExtras();
    renderClientes();
    renderGastosResumen();
    renderCategoriasGasto();
    renderSubcategoriasGasto();
    renderRentabilidad();
}



/* =========================================================
   13. EVENTOS DE FILTRO
   ========================================================= */

const filtroBtns = document.querySelectorAll(".filtro-btn");
const btnRango = document.getElementById("btnRangoPersonalizado");

filtroBtns.forEach(btn => {
    btn.addEventListener("click", () => {

        // El botón de rango no cambia el modo aquí, solo abre el modal
        if (btn === btnRango) return;

        filtroBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        modoVistaEst = btn.dataset.modo; // hoy, semana, mes, año
        rangoPersonalizado.inicio = null;
        rangoPersonalizado.fin = null;

        renderTodo();
    });
});


/* =========================================================
   14. MODAL DE RANGO PERSONALIZADO
   ========================================================= */

const modalRango = document.getElementById("modalRango");
const fechaInicio = document.getElementById("fechaInicio");
const fechaFin = document.getElementById("fechaFin");
const btnAplicarRango = document.getElementById("btnAplicarRango");
const btnCerrarRango = document.getElementById("btnCerrarRango");

// Abrir modal
btnRango.addEventListener("click", () => {
    modalRango.style.display = "flex";
});

// Cerrar modal con botón
btnCerrarRango.addEventListener("click", () => {
    modalRango.style.display = "none";
});

// Cerrar modal haciendo clic fuera del contenido
modalRango.addEventListener("click", (e) => {
    if (e.target === modalRango) {
        modalRango.style.display = "none";
    }
});

// Aplicar rango personalizado
btnAplicarRango.addEventListener("click", () => {

    if (!fechaInicio.value || !fechaFin.value) {
        alerta("Debes seleccionar fecha inicial y final.");
        return;
    }

    if (fechaInicio.value > fechaFin.value) {
        alerta("La fecha inicial no puede ser mayor que la final.");
        return;
    }

    rangoPersonalizado.inicio = fechaInicio.value;
    rangoPersonalizado.fin = fechaFin.value;

    modoVistaEst = "personalizado";

    // Marcar solo el botón de rango como activo
    filtroBtns.forEach(b => b.classList.remove("active"));
    btnRango.classList.add("active");

    modalRango.style.display = "none";
    renderTodo();
});


/* =========================================================
   15. INICIALIZACIÓN
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    renderTodo();
});
