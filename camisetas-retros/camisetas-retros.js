const productos = [
  { id: 1, nombre: "Camiseta RIVER PRIMER UNIFORME 1996", precio: 30500, imagen: "img/1.jpeg", link: "river1996.html" },
  { id: 2, nombre: "Camiseta RIVER PRIMER UNIFORME 1998", precio: 30500 , imagen: "img/river-1998-1.JPEG", link: "river1998.html" },
  { id: 3, nombre: "Camiseta BOCA PRIMER UNIFORME 2002", precio: 30500, imagen: "img/boca-2002-1.JPEG", link: "boca-2002.html" },
  { id: 4, nombre: "CAMISETA BOCA PRIMER UNIFORME 2007", precio: 30500, imagen: "img/boca-2007-1.JPEG", link: "boca-2007.html" },
  { id: 5, nombre: "Camiseta AFA PRIMER UNIFORME 2006", precio: 30500, imagen: "img/afa-2006-1.JPEG", link: "afa-2006.html" },
  { id: 6, nombre: "Camiseta AFA SEGUNDO UNIFORME 1994", precio: 30500, imagen: "img/afa-1994-1.JPEG", link: "afa-1994.html" },
  { id: 7, nombre: "Camiseta BARCELONA PRIMER UNIFORME 2009", precio: 30500, imagen: "img/barcelona-2009-1.JPEG", link: "barcelona-2009.html" },
  { id: 8, nombre: "Camiseta NEWELL'S RETRO MARADONA (SIN STOCK)", precio: 34000, imagen: "img/sinstock.jpg", link: "newellsmaradona.html" },
  { id: 9, nombre: "Camiseta LANÚS EDICIÓN ESPECIAL (SIN STOCK)", precio: 30000, imagen: "img/sinstock.JPEG", link: "lanusedicion.html" }
];

const productList = document.getElementById("product-list");

function renderProductos() {
  productList.innerHTML = "";
  productos.forEach((producto) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <div class="product-info">
        <h2>${producto.nombre}</h2>
        <p class="price">$${producto.precio.toLocaleString()}</p>
        <a href="${producto.link}" target="_blank">
          <button>Comprar ahora</button>
        </a>
      </div>
    `;
    productList.appendChild(card);
  });
}

renderProductos();

function cambiarImagen(imagen) {
  const principal = document.getElementById("foto-principal");
  principal.src = imagen.src;
}

