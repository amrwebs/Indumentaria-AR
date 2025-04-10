// Datos del producto (reemplazá estos datos por los de cada camiseta)
const producto = {
    nombre: "Camiseta ROMA 24/25",
    precio: 37900,
    descripcion1: "ENVIO: $7500",
    descripcion: "Talles: S | M | L | XL | XXL.",
    imagenes: [
      "img/roma.jpg",
      "img/roma1.jpg",
      "img/roma3.jpg"
    ],
    link: "https://mpago.la/1SvcrA8"
  };
  
  // Cargar datos en la página
  document.getElementById("titulo-pagina").textContent = producto.nombre;
  document.getElementById("nombre-producto").textContent = producto.nombre;
  document.getElementById("precio-producto").textContent = `$${producto.precio.toLocaleString()}`;
  document.getElementById("descripcion-producto").textContent = producto.descripcion;
  document.getElementById("boton-compra").href = producto.link;
  
  // Carrusel manual
  let indiceActual = 0;
  const imgPrincipal = document.getElementById("img-principal");
  const miniaturas = document.getElementById("miniaturas");
  
  function mostrarImagen(indice) {
    indiceActual = (indice + producto.imagenes.length) % producto.imagenes.length;
    imgPrincipal.src = producto.imagenes[indiceActual];
  }
  
  // Botones ← →
  function cambiarImagen(direccion) {
    mostrarImagen(indiceActual + direccion);
  }
  
  // Miniaturas
  producto.imagenes.forEach((src, index) => {
    const mini = document.createElement("img");
    mini.src = src;
    mini.alt = `Miniatura ${index + 1}`;
    mini.onclick = () => mostrarImagen(index);
    miniaturas.appendChild(mini);
  });
  
  // Mostrar imagen inicial
  mostrarImagen(0);
  