const productos = [
  { id: 1, nombre: "Camiseta ROMA 24/25", precio: 46000, imagen: "img/roma1.jpg", link: "productos/producto1/producto1.html" },
  { id: 2, nombre: "Camiseta AFA SUPLENTE 24/25", precio: 46000, imagen: "img/AFA-SUPLENTE-25.JPEG", link: "productos/producto1/producto2.html" },
  { id: 3, nombre: "Camiseta ATLETICO DE MADRID", precio: 46000, imagen: "img/ATLETICO1.JPEG", link: "productos/producto1/producto3.html" },
  { id: 4, nombre: "Camiseta PALMEIRAS", precio: 46000, imagen: "img/palmeiras-23-1.JPG", link: "productos/producto1/producto4.html" }
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
