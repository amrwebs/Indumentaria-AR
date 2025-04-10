// Datos del producto
const producto = {
  nombre: "Camiseta ROMA 24/25",
  precio: 37900,
  descripcion: "Talles: S | M | L | XL | XXL.",
  imagenes: ["img/roma.jpg", "img/roma1.jpg", "img/roma3.jpg"]
};

// Cargar datos en la página
document.getElementById("titulo-pagina").textContent = producto.nombre;
document.getElementById("nombre-producto").textContent = producto.nombre;
document.getElementById("precio-producto").textContent = `$${producto.precio.toLocaleString()}`;
document.getElementById("descripcion-producto").textContent = producto.descripcion;

// Carrusel
let indiceActual = 0;
const imgPrincipal = document.getElementById("img-principal");
const miniaturas = document.getElementById("miniaturas");

function mostrarImagen(indice) {
  indiceActual = (indice + producto.imagenes.length) % producto.imagenes.length;
  imgPrincipal.src = producto.imagenes[indiceActual];
}

function cambiarImagen(direccion) {
  mostrarImagen(indiceActual + direccion);
}

// Crear miniaturas
producto.imagenes.forEach((src, index) => {
  const mini = document.createElement("img");
  mini.src = src;
  mini.alt = `Miniatura ${index + 1}`;
  mini.onclick = () => mostrarImagen(index);
  miniaturas.appendChild(mini);
});

// Mostrar la primera imagen al cargar
mostrarImagen(0);
