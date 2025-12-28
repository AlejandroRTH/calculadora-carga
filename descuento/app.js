/******************************
 * Configuración
 ******************************/

const STORAGE_KEY = "calc_dto_ultimos_valores_v1";

// Formato moneda ARS
const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2
});

// Formato Porcentaje
const formatoP = new Intl.NumberFormat("es-AR", {
  style: "percent",
  maximumFractionDigits: 1
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
}

function cargarValores() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const datos = JSON.parse(raw);
    if (datos.ld !== undefined) inputMonto.value = datos.ld;
    if (datos.d  !== undefined) inputDescuento.value = datos.d;
  } catch {
    // si está roto, no hacemos nada
  }
}

function limpiarValores() {
  inputMonto.value = "";
  inputDescuento.value = "";
  salida.textContent = "";
  localStorage.removeItem(STORAGE_KEY);
}


/******************************
 * Lógica principal
 ******************************/

function calcular() {
  const ld = leerNumero(inputMonto);
  const d  = leerNumero(inputDescuento);

  if (ld === null || d === null) {
    mostrarMensaje("Verificá los valores ingresados.");
    return;
  }

  if (d >= 100) {
    mostrarMensaje("El descuento debe ser menor a 100%.");
    return;
  }

  const importe = ld;
  const descuento = 1 - (d / 100);
  const importeSinDesc = ld / descuento;

  const texto =
    // `Total a cargar ....: ${formatoMoneda.format(importeSinDesc)}\n` +
    `Solicitar carga por ..: ${formatoMoneda.format(importeSinDesc)}\n` +
    `Descuento del ........: ${formatoP.format(d / 100)}\n` +
    `Total a pagar.........: ${formatoMoneda.format(importe)}\n`;
    

  mostrarMensaje(texto);
  guardarValores(ld, d);
}


/******************************
 * Eventos
 ******************************/

botonCalcular.addEventListener("click", calcular);
botonLimpiar.addEventListener("click", limpiarValores);

[inputMonto, inputDescuento].forEach(input => {
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
  navigator.serviceWorker.register("./service-worker.js");
}
