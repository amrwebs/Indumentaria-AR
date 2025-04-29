const productos = [
    { id: 1, nombre: "Campera RIVER ROMPEVIENTO BORDÓ", precio: 41000, imagen: "img/camp-rompe-25.JPEG", link: "camperas/camp-river-25-bordo.html", },
    { id: 2, nombre: "Campera BOCA ROMPEVIENTO AMARILLA", precio: 41000 , imagen: "img/camp-boca-a-25.JPEG", link: "camperas/camp-boca-amarilla.html" },
    { id: 3, nombre: "Campera BOCA ROMPEVIENTO BLANCA", precio: 41000, imagen: "img/camp-boca-b-25.JPEG", link: "camperas/camp-boca-blanca.html" },
    { id: 4, nombre: "Campera RIVER ROMPEVIENTO SALMÓN", precio: 41000, imagen: "img/camp-river-25.JPEG", link: "camperas/camp-river-salmon.html" },
    { id: 5, nombre: "Campera AFA ROMPEVIENTO DORADA", precio: 41000, imagen: "img/camp-afa1-25.JPEG", link: "camperas/camp-arg-dor.html" },
    { id: 6, nombre: "Campera AFA SEGUNDO UNIFORME 1994 (SIN STOCK)", precio: 41000, imagen: "img/sinstock.jpg", link: "" },
    { id: 7, nombre: "Campera AFA ROMPEVIENTO NEGRA", precio: 41000, imagen: "img/camp-afa2-25.JPEG", link: "camperas/camp-arg-negra.html" },
    { id: 8, nombre: "Campera BOCA ROMPEVIENTO AZUL OSCURO", precio: 41000, imagen: "img/boca40camp.JPEG", link: "camperas/camp-boca-azul.html" },
    { id: 9, nombre: "Campera RIVER ROMPEVIENTO GRIS MATE", precio: 41000, imagen: "img/river40camp.JPEG", link: "camperas/camp-river-gris.html" }
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
  
