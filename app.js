const STORAGE_KEY = "calc_carga_ultimos_valores_v1";

// Moneda automática (Argentina). Si querés USD, cambiá 'ARS' por 'USD'.
const fmtARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2
});

function getEl(id) {
  return document.getElementById(id);
}

function leerNumero(id) {
  const v = parseFloat(getEl(id).value);
  return Number.isFinite(v) ? v : null;
}

function guardarUltimo() {
  const payload = {
    ld: getEl("ld").value ?? "",
    pl: getEl("pl").value ?? "",
    d:  getEl("d").value ?? ""
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function cargarUltimo() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const v = JSON.parse(raw);
    if (v.ld !== undefined) getEl("ld").value = v.ld;
    if (v.pl !== undefined) getEl("pl").value = v.pl;
    if (v.d  !== undefined) getEl("d").value  = v.d;
  } catch {
    // si está corrupto, lo ignoramos
  }
}

function limpiar() {
  getEl("ld").value = "";
  getEl("pl").value = "";
  getEl("d").value = "20";
  getEl("resultado").textContent = "";
  localStorage.removeItem(STORAGE_KEY);
}

function calcular() {
  const ld = leerNumero("ld");
  const pl = leerNumero("pl");
  const d  = leerNumero("d");

  if (ld === null || pl === null || d === null) {
    getEl("resultado").textContent = "Verificá los valores ingresados.";
    return;
  }
  if (d >= 100) {
    getEl("resultado").textContent = "El descuento debe ser menor a 100%.";
    return;
  }

  const tc = ld * pl;
  const imf = tc / (1 - (d / 100));

  getEl("resultado").textContent =
    `Total a cargar (Tc): ${fmtARS.format(tc)}\n` +
    `Importe final a abonar (Imf): ${fmtARS.format(imf)}`;

  guardarUltimo();
}

// Enter = calcular (en cualquiera de los inputs)
function bindEnterToCalc() {
  ["ld", "pl", "d"].forEach(id => {
    getEl(id).addEventListener("keydown", (e) => {
      if (e.key === "Enter") calcular();
    });
  });
}

// Botones
getEl("btnCalcular").addEventListener("click", calcular);
getEl("btnLimpiar").addEventListener("click", limpiar);

// Al cargar: restaurar último valor
cargarUltimo();
bindEnterToCalc();

// Service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
