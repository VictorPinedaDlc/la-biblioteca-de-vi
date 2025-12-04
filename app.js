// Referencias a elementos del DOM
const GRID = document.getElementById("storiesGrid");
const SEARCH = document.getElementById("searchInput");
const GENRE = document.getElementById("genreFilter");
const NO_RESULTS = document.getElementById("noResultsMessage");

let allStories = [];

// 1. Cargar cuentos desde cuentos.json
async function cargarCuentos() {
  try {
    const res = await fetch("assets/data/cuentos.json");
    const data = await res.json();

    allStories = data.stories || [];
    pintarGrid(allStories);
  } catch (err) {
    console.error("Error cargando cuentos:", err);
  }
}

// 2. Pintar tarjetas tipo Netflix
function pintarGrid(lista) {
  GRID.innerHTML = "";

  if (!lista.length) {
    NO_RESULTS.classList.remove("hidden");
    return;
  }

  NO_RESULTS.classList.add("hidden");

  lista.forEach((story) => {
    const card = document.createElement("article");
    card.className = "story-card";

    card.innerHTML = `
      <div class="story-cover">
        <img src="${story.cover}" alt="${story.title}">
      </div>
      <div class="story-info">
        <h4 class="story-title">${story.title}</h4>
        <p class="story-meta">${story.year} • ${story.genre || ""}</p>
        <p class="story-tags">
          ${(story.tags || []).map((t) => "#" + t).join(" ")}
        </p>
      </div>
    `;

    // Al hacer clic -> abrir cuento en nueva pestaña
    card.addEventListener("click", () => {
      const url = `cuento.html?id=${encodeURIComponent(story.id)}`;
      window.open(url, "_blank");
    });

    GRID.appendChild(card);
  });
}

// 3. Filtros (texto + género)
function aplicarFiltros() {
  const q = (SEARCH.value || "").toLowerCase();
  const g = GENRE.value;

  const filtrados = allStories.filter((story) => {
    const titulo = (story.title || "").toLowerCase();
    const resumen = (story.summary || "").toLowerCase();
    const tags = (story.tags || []).map((t) => t.toLowerCase());

    const coincideTexto =
      titulo.includes(q) ||
      resumen.includes(q) ||
      tags.some((t) => t.includes(q));

    const generoStory = (story.genre || "").toLowerCase();
    const coincideGenero =
      g === "todos" || generoStory.includes(g.toLowerCase());

    return coincideTexto && coincideGenero;
  });

  pintarGrid(filtrados);
}

// 4. Listeners
if (SEARCH) {
  SEARCH.addEventListener("input", aplicarFiltros);
}

if (GENRE) {
  GENRE.addEventListener("change", aplicarFiltros);
}

// 5. Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", cargarCuentos);
