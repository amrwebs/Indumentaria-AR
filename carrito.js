const carritoContainer = document.getElementById("carrito-container");
const totalCarrito = document.getElementById("total-carrito");

// Obtener productos del carrito desde localStorage
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function renderCarrito() {
  carritoContainer.innerHTML = "";

  if (carrito.length === 0) {
    carritoContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
    totalCarrito.textContent = "0.00";
    return;
  }

  carrito.forEach((producto, index) => {
    const item = document.createElement("div");
    item.classList.add("product-card");
    item.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <div class="product-info">
        <h2>${producto.nombre}</h2>
        <p class="price">$${producto.precio}</p>
        <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
      </div>
    `;
    carritoContainer.appendChild(item);
  });

  const total = carrito.reduce((sum, item) => sum + item.precio, 0);
  totalCarrito.textContent = total.toFixed(2);
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
}

renderCarrito();
