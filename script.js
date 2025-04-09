const productos = [
  { id: 1, nombre: "Camiseta ROMA 24/25", precio: 49.99, imagen: "img/roma.jpg" },
  { id: 2, nombre: "Camiseta River 1996", precio: 34.99, imagen: "img/river.jpg" },
  { id: 3, nombre: "Camiseta BOCA 1996", precio: 19.99, imagen: "img/BOCA.png" },
];

const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");
const totalDisplay = document.getElementById("total");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function renderProductos() {
  productList.innerHTML = ""; // Limpia antes de renderizar
  productos.forEach((producto) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <div class="product-info">
        <h2>${producto.nombre}</h2>
        <p class="price">$${producto.precio}</p>
        <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
      </div>
    `;
    productList.appendChild(card);
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito();

  // Vibración (opcional, en móviles)
  if (navigator.vibrate) {
    navigator.vibrate(100);
  }
}

function actualizarCarrito() {
  if (cartCount) {
    cartCount.textContent = carrito.length;
  }
  const total = carrito.reduce((sum, item) => sum + item.precio, 0);
  if (totalDisplay) {
    totalDisplay.textContent = total.toFixed(2);
  }
}

renderProductos();
actualizarCarrito();

const menuToggle = document.getElementById("menu-toggle");
const menuList = document.getElementById("menu-list");

menuToggle.addEventListener("click", () => {
  menuList.classList.toggle("hidden");
});
