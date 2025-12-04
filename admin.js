// admin.js

// Función para generar un id "bonito" a partir del título
function generarIdDesdeTitulo(titulo) {
  return titulo
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/[^a-z0-9]+/g, "-") // reemplaza espacios y símbolos por -
    .replace(/^-+|-+$/g, "");    // quita guiones al inicio o final
}

document.getElementById("formNuevoCuento").addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const anio = parseInt(document.getElementById("anio").value, 10);
  const genero = document.getElementById("genero").value.trim();
  const tagsRaw = document.getElementById("tags").value.trim();
  const portada = document.getElementById("portada").value.trim();
  const resumen = document.getElementById("resumen").value.trim();
  const contenidoRaw = document.getElementById("contenido").value;

  // Convertir tags a arreglo
  const tags = tagsRaw
    ? tagsRaw.split(",").map(t => t.trim()).filter(t => t.length > 0)
    : [];

  // Convertir el contenido en un arreglo de párrafos
  const contenido = contenidoRaw
    .split(/\n\s*\n/)           // corta por líneas en blanco
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const nuevoCuento = {
    id: generarIdDesdeTitulo(titulo),
    title: titulo,
    year: anio,
    genre: genero,
    tags: tags,
    cover: portada || "assets/img/pendiente.jpg",
    summary: resumen,
    content: contenido
  };

  const jsonGenerado = JSON.stringify(nuevoCuento, null, 2);

  const output = document.getElementById("outputJson");
  output.value = jsonGenerado;
  output.scrollTop = 0;
});
