const productos = [
    { id: 1, nombre: "Camiseta RIVER PRIMER UNIFORME 24/25", precio: 26000, imagen: "img/RIVER25.jpeg", link: "camisetas/river25.html", },
    { id: 2, nombre: "Camiseta RIVER TERCER UNIFORME 24/25", precio: 26000 , imagen: "img/RIVERT25.jpeg", link: "camisetas/river-tercera25.html" },
    { id: 3, nombre: "Camiseta BOCA UNIFORME 24/25", precio: 26000, imagen: "img/BOCA25.jpeg", link: "camisetas/boca25.html" },
    { id: 4, nombre: "Camiseta BOCA TERCER UNIFORME 24/25", precio: 26000, imagen: "img/BOCAT25.jpeg", link: "camisetas/boca-tercera-25.html" }
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
  