/* =========================================================
   NUEVO-PEDIDO.JS — Versión FINAL con mejoras
   ========================================================= */


/* =========================================================
   1. REFERENCIAS AL DOM
   ========================================================= */

const productoSelect = document.getElementById("productoSelect");
const extrasContainer = document.getElementById("extrasContainer");

const precioInput = document.getElementById("precioInput");
const monedaPrecio = document.getElementById("monedaPrecio");

const dineroRecibido = document.getElementById("dineroRecibido");
const monedaRecibida = document.getElementById("monedaRecibida");

const monedaVueltos = document.getElementById("monedaVueltos");
const vueltosTexto = document.getElementById("vueltosTexto");

const paisSelect = document.getElementById("paisSelect");
const codigoManualContainer = document.getElementById("codigoManualContainer");
const codigoManual = document.getElementById("codigoManual");

const clienteNombre = document.getElementById("clienteNombre");
const clienteDireccion = document.getElementById("clienteDireccion");
const clienteTelefono = document.getElementById("clienteTelefono");

const guardarPedido = document.getElementById("guardarPedido");

/* NUEVO */
const btnContacto = document.getElementById("btnContacto");
const cardContacto = document.getElementById("cardContacto");
const btnListaContactos = document.getElementById("btnListaContactos");
const modalContactos = document.getElementById("modalContactos");
const listaContactos = document.getElementById("listaContactos");

/* SWITCHES SEPARADOS */
const switchContactoRow = document.querySelector(".switch-contacto");
const guardarContactoSwitch = document.getElementById("guardarContactoSwitch");

const switchVueltosRow = document.getElementById("switchVueltosRow");
const vueltosEntregadosSwitch = document.getElementById("vueltosEntregadosSwitch");



/* =========================================================
   2. FORMULARIO DE CONTACTO (TOGGLE)
   ========================================================= */

btnContacto.addEventListener("click", () => {
    const visible = cardContacto.style.display === "block";

    if (visible) {
        cardContacto.style.display = "none";

        clienteNombre.value = "Anónimo";
        clienteDireccion.value = "N/A";
        clienteTelefono.value = "N/A";
        paisSelect.value = "+58";

        guardarContactoSwitch.checked = false;
        switchContactoRow.style.display = "none";

        codigoManual.value = "";
        codigoManualContainer.classList.add("hidden");

        // Desbloquear campos
        clienteNombre.readOnly = false;
        clienteDireccion.readOnly = false;
        clienteTelefono.readOnly = false;
        paisSelect.disabled = false;

    } else {
        cardContacto.style.display = "block";

        clienteNombre.value = "";
        clienteDireccion.value = "";
        clienteTelefono.value = "";
        paisSelect.value = "+58";
        codigoManual.value = "";

        guardarContactoSwitch.checked = false;
        switchContactoRow.style.display = "none";

        codigoManualContainer.classList.add("hidden");

        // Desbloquear campos
        clienteNombre.readOnly = false;
        clienteDireccion.readOnly = false;
        clienteTelefono.readOnly = false;
        paisSelect.disabled = false;
    }
});



/* =========================================================
   3. MOSTRAR SWITCH CONTACTO SOLO CUANDO ESCRIBAN NOMBRE
   ========================================================= */

clienteNombre.addEventListener("input", () => {
    if (clienteNombre.readOnly) return; // si es contacto existente, no mostrar switch

    if (clienteNombre.value.trim().length > 0) {
        switchContactoRow.style.display = "flex";
    } else {
        switchContactoRow.style.display = "none";
        guardarContactoSwitch.checked = false;
    }
});



/* =========================================================
   4. CONTACTOS GUARDADOS
   ========================================================= */

function obtenerContactos() {
    return leerLS("contactos", []);
}

function guardarContactos(lista) {
    guardarLS("contactos", lista);
}

function abrirModalContactos() {
    const contactos = obtenerContactos();

    if (contactos.length === 0) {
        listaContactos.innerHTML = `<p style="opacity:0.6;">No hay contactos guardados.</p>`;
    } else {
        listaContactos.innerHTML = contactos.map(c => `
            <div class="contacto-item" onclick="seleccionarContacto('${c.id}')">
                <strong>${c.nombre.toUpperCase()}</strong>
            </div>
        `).join("");
    }

    modalContactos.style.display = "flex";
}

function cerrarModalContactos() {
    modalContactos.style.display = "none";
}

btnListaContactos.addEventListener("click", abrirModalContactos);



/* =========================================================
   5. SELECCIONAR CONTACTO
   ========================================================= */

function seleccionarContacto(id) {
    const contactos = obtenerContactos();
    const c = contactos.find(x => x.id == id);
    if (!c) return;

    clienteNombre.value = c.nombre;
    clienteDireccion.value = c.direccion;
    clienteTelefono.value = c.telefono;
    paisSelect.value = c.codigoPais || "+58";

    // Bloquear edición
    clienteNombre.readOnly = true;
    clienteDireccion.readOnly = true;
    clienteTelefono.readOnly = true;
    paisSelect.disabled = true;

    // Ocultar switch porque es un contacto existente
    switchContactoRow.style.display = "none";
    guardarContactoSwitch.checked = false;

    cerrarModalContactos();
}



/* =========================================================
   6. CARGAR PRODUCTOS
   ========================================================= */

function cargarProductos() {
    const productos = leerLS("productos", []);

    let html = `<option value="">Seleccione un producto</option>`;

    if (productos.length === 0) {
        html += `<option value="">No hay productos registrados</option>`;
        productoSelect.innerHTML = html;
        return;
    }

    html += productos
        .map(p => {
            const monedaMostrar = p.moneda === "bs" ? "Bs" : p.moneda.toUpperCase();
            return `
                <option value="${p.id}" data-precio="${p.precio}" data-moneda="${p.moneda}">
                    ${p.nombre} (${p.precio} ${monedaMostrar})
                </option>
            `;
        })
        .join("");

    productoSelect.innerHTML = html;
}



/* =========================================================
   7. CARGAR EXTRAS COMO CHIPS
   ========================================================= */

function cargarExtras() {
    const extras = leerLS("extras", []);

    if (extras.length === 0) {
        extrasContainer.innerHTML = `<p style="opacity:0.6;">No hay extras registrados</p>`;
        return;
    }

    extrasContainer.innerHTML = extras
        .map(e => `
            <label class="extra-chip">
                <input type="checkbox" value="${e.id}" data-precio="${e.precio}" data-moneda="${e.moneda}">
                <span>${e.nombre} (+${e.precio} ${e.moneda === "bs" ? "Bs" : e.moneda.toUpperCase()})</span>
            </label>
        `)
        .join("");
}



/* =========================================================
   8. PRECIO FINAL Y VUELTOS
   ========================================================= */

productoSelect.addEventListener("change", () => {
    const opt = productoSelect.options[productoSelect.selectedIndex];

    if (!opt || opt.value === "") {
        precioInput.value = "";
        vueltosTexto.textContent = "";
        switchVueltosRow.style.display = "none";
        return;
    }

    monedaPrecio.value = opt.dataset.moneda;
    calcularTodo();
});

paisSelect.addEventListener("change", () => {
    if (paisSelect.value === "otro") {
        codigoManualContainer.classList.remove("hidden");
    } else {
        codigoManualContainer.classList.add("hidden");
        codigoManual.value = "";
    }
});

clienteTelefono.addEventListener("input", () => {
    let codigo = paisSelect.value === "otro" ? codigoManual.value : paisSelect.value;
    clienteTelefono.value = formatearTelefono(clienteTelefono.value, codigo);
});

function obtenerPrecioFinal() {
    const opt = productoSelect.options[productoSelect.selectedIndex];
    const monedaMostrar = monedaPrecio.value;

    if (!opt || opt.value === "") {
        precioInput.value = "";
        return { total: 0, moneda: monedaMostrar };
    }

    const precioProducto = parseFloat(opt.dataset.precio);
    const monedaProducto = opt.dataset.moneda;

    let total = precioProducto;

    const extrasChecks = extrasContainer.querySelectorAll("input[type='checkbox']:checked");

    extrasChecks.forEach(chk => {
        const precioExtra = parseFloat(chk.dataset.precio);
        const monedaExtra = chk.dataset.moneda;

        const convertido = convertir(precioExtra, monedaExtra, monedaProducto);
        total += convertido;
    });

    const totalConvertido = convertir(total, monedaProducto, monedaMostrar);

    precioInput.value = `${formatearNumero(totalConvertido)} ${monedaMostrar.toUpperCase()}`;

    return { total: totalConvertido, moneda: monedaMostrar };
}

function calcularVueltos() {
    const opt = productoSelect.options[productoSelect.selectedIndex];

    if (!opt || opt.value === "") {
        vueltosTexto.textContent = "";
        switchVueltosRow.style.display = "none";
        return;
    }

    const { total, moneda } = obtenerPrecioFinal();

    const recibido = parseFloat(dineroRecibido.value || 0);
    const monedaRec = monedaRecibida.value;

    if (!recibido) {
        vueltosTexto.textContent = "";
        switchVueltosRow.style.display = "none";
        return;
    }

    const recibidoConvertido = convertir(recibido, monedaRec, moneda);
    let diferencia = recibidoConvertido - total;

    const monedaMostrar = monedaVueltos.value;
    const diferenciaConvertida = convertir(diferencia, moneda, monedaMostrar);

    /* ============================
       CASO 1: FALTA DINERO
       ============================ */
    if (diferencia < 0) {
        vueltosTexto.style.color = "#ff4d4d";
        vueltosTexto.textContent =
            `Faltan ${formatearNumero(Math.abs(diferenciaConvertida))} ${monedaMostrar.toUpperCase()}`;

        switchVueltosRow.style.display = "none";
        vueltosEntregadosSwitch.checked = false;
        vueltosEntregadosSwitch.dataset.falta = "true";
        return;
    }

    /* ============================
       CASO 2: NO FALTA DINERO
       ============================ */
    vueltosEntregadosSwitch.dataset.falta = "false";
    switchVueltosRow.style.display = "flex";

    if (diferencia === 0) {
        vueltosTexto.style.color = "#4caf50";
        vueltosTexto.textContent = "El cliente ha cancelado el monto exacto";
    } else {
        vueltosTexto.style.color = "#4caf50";
        vueltosTexto.textContent =
            `Vueltos: ${formatearNumero(diferenciaConvertida)} ${monedaMostrar.toUpperCase()}`;
    }
}

function calcularTodo() {
    obtenerPrecioFinal();
    calcularVueltos();
}

extrasContainer.addEventListener("change", calcularTodo);
monedaPrecio.addEventListener("change", calcularTodo);
dineroRecibido.addEventListener("input", calcularTodo);
monedaRecibida.addEventListener("change", calcularTodo);
monedaVueltos.addEventListener("change", calcularTodo);



/* =========================================================
   9. OBTENER DATOS DEL PEDIDO (DINERO REAL + CONTACTO ANÓNIMO)
   ========================================================= */

function obtenerDatosPedido() {
    const opt = productoSelect.options[productoSelect.selectedIndex];
    const { total, moneda } = obtenerPrecioFinal();

    const extrasSeleccionados = [];
    const extrasChecks = extrasContainer.querySelectorAll("input[type='checkbox']:checked");

    extrasChecks.forEach(chk => {
        extrasSeleccionados.push({
            id: chk.value,
            nombre: chk.parentElement.innerText.trim(),
            precio: parseFloat(chk.dataset.precio),
            moneda: chk.dataset.moneda
        });
    });

    /* CONTACTO ANÓNIMO SI NO ABRIERON EL FORMULARIO */
    let nombre = "Anónimo";
    let direccion = "N/A";
    let telefono = "N/A";
    let codigoPais = "+58";

    if (cardContacto.style.display === "block") {
        nombre = clienteNombre.value.trim();
        direccion = clienteDireccion.value.trim();
        telefono = clienteTelefono.value.trim();
        codigoPais = paisSelect.value === "otro" ? codigoManual.value.trim() : paisSelect.value;
    }

    const recibido = parseFloat(dineroRecibido.value || 0);
    const recibidoConvertido = convertir(recibido, monedaRecibida.value, moneda);
    const diferencia = recibidoConvertido - total;

    let dineroReal = 0;

    if (vueltosEntregadosSwitch.dataset.falta === "true") {
        dineroReal = recibidoConvertido;
    } else if (diferencia < 0) {
        dineroReal = recibidoConvertido;
    } else if (diferencia === 0) {
        dineroReal = total;
    } else {
        dineroReal = vueltosEntregadosSwitch.checked ? total : recibidoConvertido;
    }

    return {
        id: generarID(),
        fecha: fechaActualClave(),
        estado: "pendiente",
        productoID: productoSelect.value,
        productoTexto: opt ? opt.textContent : "",
        extras: extrasSeleccionados,
        precio: total,
        moneda: moneda,
        dineroRecibido: recibido,
        monedaRecibida: monedaRecibida.value,
        dineroReal: dineroReal,
        vueltosEntregados: vueltosEntregadosSwitch.checked,
        cliente: {
            nombre,
            direccion,
            telefono,
            codigoPais
        }
    };
}



/* =========================================================
   10. VALIDAR Y GUARDAR
   ========================================================= */

function validarPedido(data) {
    if (campoVacio(data.productoID)) return "Debes seleccionar un producto.";
    return null;
}

guardarPedido.addEventListener("click", () => {
    const data = obtenerDatosPedido();
    const error = validarPedido(data);

    if (error) {
        mostrarMensaje(error, "warning");
        return;
    }

    if (guardarContactoSwitch.checked && cardContacto.style.display === "block") {
        const contactos = obtenerContactos();

        contactos.push({
            id: generarID(),
            nombre: data.cliente.nombre,
            direccion: data.cliente.direccion,
            telefono: data.cliente.telefono,
            codigoPais: data.cliente.codigoPais
        });

        guardarContactos(contactos);
    }

    const pedidos = leerLS("pedidos", []);
    pedidos.push(data);
    guardarLS("pedidos", pedidos);

    mostrarMensaje("Pedido guardado correctamente.", "success");
    window.location.href = "pedidos.html";
});




/* =========================================================
   11. INICIALIZACIÓN
   ========================================================= */

cargarProductos();
cargarExtras();
