const imagenes = [
  "/static/img/producto1.jpg",
  "/static/img/producto2.jpg",
  "/static/img/producto3.jpg"
];
let indiceActual = 0;
function mostrarImagen(indice) {
  document.getElementById("img-principal").src = imagenes[indice];
}
function cambiarImagen(delta) {
  indiceActual = (indiceActual + delta + imagenes.length) % imagenes.length;
  mostrarImagen(indiceActual);
}
function cargarMiniaturas() {
  const miniaturas = document.getElementById("miniaturas");
  imagenes.forEach((src, index) => {
    const mini = document.createElement("img");
    mini.src = src;
    mini.classList.add("img-thumbnail");
    mini.style.width = "80px";
    mini.onclick = () => {
      indiceActual = index;
      mostrarImagen(indiceActual);
    };
    miniaturas.appendChild(mini);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  mostrarImagen(indiceActual);
  cargarMiniaturas();
  const form = document.getElementById("form-comprador");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = {
      producto: "Producto AR",
      precio: 15000,
      nombre: document.getElementById("nombre").value,
      domicilio: document.getElementById("domicilio").value,
      localidad: document.getElementById("localidad").value,
      codigoPostal: document.getElementById("codigo-postal").value,
      telefono: document.getElementById("telefono").value,
      correo: document.getElementById("correo").value
    };
    try {
      const res = await fetch("/datos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });
      const respuesta = await res.json();
      alert(respuesta.mensaje);
    } catch (error) {
      alert("❌ Error al enviar los datos.");
      console.error(error);
    }
  });
});