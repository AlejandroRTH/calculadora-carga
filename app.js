/******************************
 * Configuración
 ******************************/

const STORAGE_KEY = "calc_carga_ultimos_valores_v1";

// Formato moneda ARS
const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2
});


/******************************
 * Acceso a la interfaz
 ******************************/

const inputLitros    = document.getElementById("ld");
const inputPrecio    = document.getElementById("pl");
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

function guardarValores(ld, pl, d) {
  const datos = {
    ld: ld,
    pl: pl,
    d:  d
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
}

function cargarValores() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const datos = JSON.parse(raw);
    if (datos.ld !== undefined) inputLitros.value = datos.ld;
    if (datos.pl !== undefined) inputPrecio.value = datos.pl;
    if (datos.d  !== undefined) inputDescuento.value = datos.d;
  } catch {
    // si está roto, no hacemos nada
  }
}

function limpiarValores() {
  inputLitros.value = "";
  inputPrecio.value = "";
  inputDescuento.value = "20";
  salida.textContent = "";
  localStorage.removeItem(STORAGE_KEY);
}


/******************************
 * Lógica principal
 ******************************/

function calcular() {
  const ld = leerNumero(inputLitros);
  const pl = leerNumero(inputPrecio);
  const d  = leerNumero(inputDescuento);

  if (ld === null || pl === null || d === null) {
    mostrarMensaje("Verificá los valores ingresados.");
    return;
  }

  if (d >= 100) {
    mostrarMensaje("El descuento debe ser menor a 100%.");
    return;
  }

  const totalCarga = ld * pl;
  const importeDescuento = totalCarga * (d / 100);
  const importeFinal = totalCarga / (1 - d / 100);

  const texto =
    `Total a cargar (Tc): ${formatoMoneda.format(totalCarga)}\n` +
    `Descuento .........: ${formatoMoneda.format(importeDescuento)}\n` +
    `Total .............: ${formatoMoneda.format(totalCarga - importeDescuento)}\n` +
    `Solicitar cargar ..: ${formatoMoneda.format(importeFinal)}`;

  mostrarMensaje(texto);
  guardarValores(ld, pl, d);
}


/******************************
 * Eventos
 ******************************/

botonCalcular.addEventListener("click", calcular);
botonLimpiar.addEventListener("click", limpiarValores);

[inputLitros, inputPrecio, inputDescuento].forEach(input => {
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
  navigator.serviceWorker.register("service-worker.js");
}
