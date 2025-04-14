const productos = [
  { id: 1, nombre: "Camiseta ROMA 24/25", precio: 49999, imagen: "img/PRODUCTO1-ROMA25/1.jpeg", link: "productos/producto1/producto1.html" },
  { id: 2, nombre: "Camiseta River 1996", precio: 34999, imagen: "img/sinstock.jpg", link: "https://mpago.la/linkriver" },
  { id: 3, nombre: "Camiseta BOCA 1996", precio: 19999, imagen: "img/sinstock.jpg", link: "https://mpago.la/linkboca" },
  { id: 4, nombre: "Camiseta de Unión", precio: 19999, imagen: "img/sinstock.jpg", link: "https://mpago.la/linkunion" }
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

// Menú móvil
const menuToggle = document.getElementById("menu-toggle");
const menuList = document.getElementById("menu-list");
menuToggle.addEventListener("click", () => {
  menuList.classList.toggle("hidden");
});
