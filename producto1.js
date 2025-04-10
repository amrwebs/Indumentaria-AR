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

// Carrusel de imágenes
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

producto.imagenes.forEach((src, index) => {
  const mini = document.createElement("img");
  mini.src = src;
  mini.alt = `Miniatura ${index + 1}`;
  mini.onclick = () => mostrarImagen(index);
  miniaturas.appendChild(mini);
});

mostrarImagen(0);

// Formulario de envío
document.getElementById('form-comprador').addEventListener('submit', async function(e) {
  e.preventDefault();

  const datos = {
    nombre: document.getElementById('nombre').value,
    domicilio: document.getElementById('domicilio').value,
    localidad: document.getElementById('localidad').value,
    codigoPostal: document.getElementById('codigo-postal').value,
    telefono: document.getElementById('telefono').value,
    correo: document.getElementById('correo').value,
    producto: producto.nombre,
    precio: producto.precio
  };

  console.log("📨 Enviando datos:", datos);

  try {
    const res = await fetch("https://indumentariaar-production.up.railway.app/datos", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    const resultado = await res.json();  // 🔧 corregido aquí
    alert(resultado.mensaje);
  } catch (error) {
    console.error("❌ Error al enviar datos:", error);
    alert('❌ Error al enviar los datos. Asegurate de que el servidor Flask esté corriendo.');
  }
});

