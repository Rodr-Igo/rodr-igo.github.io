// Bouquet: genera el arreglo en el mismo orden/rotación del sitio original.
const FLOWERS = [
  // orchids
  { src: "./assets/color/flowers/orchid.png", alt: "orchid", w: 120, h: 120, order: 9, rot: -4.480667074115834 },
  { src: "./assets/color/flowers/orchid.png", alt: "orchid", w: 120, h: 120, order: 3, rot:  1.738641551333215 },

  // lilies
  { src: "./assets/color/flowers/lily.png",   alt: "lily",   w: 160, h: 160, order: 0, rot: -3.8130190983892587 },
  { src: "./assets/color/flowers/lily.png",   alt: "lily",   w: 160, h: 160, order: 2, rot: -0.9391309829204992 },
  { src: "./assets/color/flowers/lily.png",   alt: "lily",   w: 160, h: 160, order: 6, rot: -0.8680521682130315 },
  { src: "./assets/color/flowers/lily.png",   alt: "lily",   w: 160, h: 160, order: 8, rot:  3.06024983876463   },
  { src: "./assets/color/flowers/lily.png",   alt: "lily",   w: 160, h: 160, order: 1, rot: -1.9189161518215037 },

  // daisies
  { src: "./assets/color/flowers/daisy.png",  alt: "daisy",  w: 80,  h: 80,  order: 2, rot:  3.5192827630123205 },
  { src: "./assets/color/flowers/daisy.png",  alt: "daisy",  w: 80,  h: 80,  order: 6, rot:  2.1503199822442065 },
  { src: "./assets/color/flowers/daisy.png",  alt: "daisy",  w: 80,  h: 80,  order: 8, rot:  4.631460437288224  },
];

function makeFlower({ src, alt, w, h, order, rot }) {
  const wrap = document.createElement("div");
  wrap.className = "flower";
  wrap.style.order = String(order);

  const img = document.createElement("img");
  img.src = src;           // <-- ajusta rutas si tus imágenes están en otra carpeta
  img.alt = alt;
  img.width = w;
  img.height = h;
  // guardamos rotación en custom prop para hover consistente
  img.style.setProperty("--rot", `${rot}deg`);
  img.style.transform = `rotate(${rot}deg)`;

  wrap.appendChild(img);
  return wrap;
}

function mountBouquet() {
  const host = document.getElementById("flowers");
  if (!host) return;
  // Limpia por si hay restos
  host.textContent = "";
  // Inserta en el DOM
  FLOWERS.forEach(f => host.appendChild(makeFlower(f)));
}

// Usa defer en el script, pero por si acaso:
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountBouquet);
} else {
  mountBouquet();
}
