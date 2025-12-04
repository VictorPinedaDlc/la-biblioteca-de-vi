// cuento.js

async function cargarCuento() {
  const params = new URLSearchParams(window.location.search);
  const storyId = params.get("id");

  const titleEl = document.getElementById("storyTitle");
  const metaEl = document.getElementById("storyMeta");
  const tagsEl = document.getElementById("storyTags");
  const contentEl = document.getElementById("storyContent");
  const notFoundEl = document.getElementById("storyNotFound");
  const coverEl = document.getElementById("storyCover");

  try {
    const res = await fetch("assets/data/cuentos.json");
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    // Aseguramos que exista data.stories
    if (!data.stories || !Array.isArray(data.stories)) {
      throw new Error("El JSON no tiene la propiedad 'stories'.");
    }

    const story = data.stories.find((s) => s.id === storyId);

    if (!story) {
      notFoundEl.classList.remove("hidden");
      return;
    }

    // Ocultar mensaje de error si estaba visible
    notFoundEl.classList.add("hidden");

    // Título
    titleEl.textContent = story.title;
    document.title = story.title + " | La Biblioteca de Vi";

    // Meta: año + género
    metaEl.textContent = `${story.year} · ${story.genre}`;
    coverEl.src = "assets/data/img/" + story.cover;
    // Portada
    if (coverEl) {
      if (story.cover) {
        // Si en el JSON pusiste ruta completa (ej: "assets/img/uno-once-cero-tres.png")
        // la usamos tal cual. Si solo es el nombre del archivo, le agregamos "assets/img/".
        const hasPath = story.cover.startsWith("assets/");
        coverEl.src = hasPath ? story.cover : `assets/img/${story.cover}`;
        coverEl.alt = `Portada de ${story.title}`;
        coverEl.classList.remove("hidden");
      } else {
        // Si no hay portada, ocultamos la imagen
        coverEl.classList.add("hidden");
      }
    }

    // Tags
    tagsEl.innerHTML = "";
    story.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = `#${tag}`;
      tagsEl.appendChild(span);
    });

    // Contenido: cada elemento del array "content" es un párrafo
    contentEl.innerHTML = "";
    story.content.forEach((parrafo) => {
      const p = document.createElement("p");
      p.textContent = parrafo;
      contentEl.appendChild(p);
    });
  } catch (error) {
    console.error("Error cargando cuento:", error);
    notFoundEl.classList.remove("hidden");
    notFoundEl.textContent = "Error al cargar el cuento.";
  }
}

document.addEventListener("DOMContentLoaded", cargarCuento);
