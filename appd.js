/******************************
 * Configuración
 ******************************/

const STORAGE_KEY_D = "calc_carga_ultimos_valores_v1";

// Formato moneda ARS
const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2
});


/******************************
 * Acceso a la interfaz
 ******************************/

const inputMonto    = document.getElementById("ld");
const inputDescuento = document.getElementById("d");
const salida         = document.getElementById("resultado");

const botonCalcular  = document.getElementById("btnCalcular");
const botonLimpiar   = document.getElementById("btnLimpiar");


/******************************
 * Utilidades (tipo Python)
 ******************************/

function leerNumero(input) {
  const valor = parseFloat(input.value);
  if (Number.isFinite(valor)) {
    return valor;
  }
  return null;
}

function mostrarMensaje(texto) {
  salida.textContent = texto;
}


/******************************
 * Persistencia (localStorage)
 ******************************/

function guardarValores(ld, d) {
  const datos = {
    ld: ld,
    d:  d
  };
  localStorage.setItem(STORAGE_KEY_D, JSON.stringify(datos));
}

function cargarValores() {
  const raw = localStorage.getItem(STORAGE_KEY_D);
  if (!raw) return;

  try {
    const datos = JSON.parse(raw);
    if (datos.ld !== undefined) inputIMPfinal.value = datos.ld;
    if (datos.d  !== undefined) inputDescuento.value = datos.d;
  } catch {
    // si está roto, no hacemos nada
  }
}

function limpiarValores() {
  inputIMPfinal.value = "";
  inputDescuento.value = "20";
  salida.textContent = "";
  localStorage.removeItem(STORAGE_KEY_D);
}


/******************************
 * Lógica principal
 ******************************/

function calcular() {
  const ld = leerNumero(inputIMPfinal);
  const d  = leerNumero(inputDescuento);

  if (ld === null || d === null) {
    mostrarMensaje("Verificá los valores ingresados.");
    return;
  }

  if (d >= 100) {
    mostrarMensaje("El descuento debe ser menor a 100%.");
    return;
  }

  const importe = inputMonto;
  const descuento = 1 - (d / 100);
  const importeSinDesc = importe / descuento;

  const texto =
    `Total a cargar ....: ${formatoMoneda.format(importeSinDesc)}\n` +
    `Descuento .........: ${formatoMoneda.format(d)}\n` +
    `Total .............: ${formatoMoneda.format(importe)}\n`;
    

  mostrarMensaje(texto);
  guardarValores(ld, d);
}


/******************************
 * Eventos
 ******************************/

botonCalcular.addEventListener("click", calcular);
botonLimpiar.addEventListener("click", limpiarValores);

[inputIMPfinal, inputDescuento].forEach(input => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      calcular();
    }
  });
});


/******************************
 * Inicialización
 ******************************/

cargarValores();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker2.js");
}
