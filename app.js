/* App logic & UI bindings */
(async function () {
  // ---------- Helpers ----------
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const fmtMoney = (n) => Number(n || 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  // ---------- Tabs / Router (se ata YA, sin bloquear la UI) ----------
  const tabs = $$('#tabs button');
  const sections = $$('.tab');
  const validTabs = ['dashboard','productos','categorias','vender','ventas','comprobante'];

  function activateTab(name) {
    if (!validTabs.includes(name)) name = 'dashboard';
    tabs.forEach(x => x.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    const btn = tabs.find(b => b.dataset.tab === name);
    btn?.classList.add('active');
    document.getElementById(name)?.classList.add('active');

    // Render lazy por pestaña
    if (name === 'dashboard') renderDashboard?.();
    if (name === 'productos') { loadCategoriasSelects?.(); renderProductos?.(); }
    if (name === 'categorias') { loadCategoriasSelects?.(); renderCategorias?.(); }
    if (name === 'ventas') renderVentas?.();
    if (name === 'comprobante') preloadNegocio?.();
  }

  function onHashChange() {
    const name = (location.hash || '').replace('#', '') || 'dashboard';
    activateTab(name);
  }

  tabs.forEach(b => b.addEventListener('click', (e) => {
    e.preventDefault();
    location.hash = b.dataset.tab;
  }));
  window.addEventListener('hashchange', onHashChange);
  onHashChange(); // primer render

  // ---------- Init storage (después, con try/catch) ----------
  try {
    await Store.init();
  } catch (e) {
    console.error('Store.init falló:', e);
    // La UI sigue funcionando aunque el storage no
  }

  // ---------- Dashboard ----------
  async function renderDashboard() {
    try {
      const productos = await Store.listProductos();
      const ventas = await Store.listVentas();
      const stock = productos.reduce(
        (acc, p) => acc + Object.values(p.talles || {}).reduce((a, b) => a + Number(b || 0), 0),
        0
      );
      const ingresos = ventas.reduce((acc, v) => acc + Number(v.total || 0), 0);
      $('#statProductos') && ($('#statProductos').textContent = productos.length);
      $('#statStock') && ($('#statStock').textContent = stock);
      $('#statVentas') && ($('#statVentas').textContent = ventas.length);
      $('#statIngresos') && ($('#statIngresos').textContent = fmtMoney(ingresos));
    } catch (e) { console.error('renderDashboard:', e); }
  }

  // ---------- Productos ----------
  const buscar = $('#buscar');
  const filtroCategoria = $('#filtroCategoria');
  $('#btnFiltrar')?.addEventListener('click', () => renderProductos());
  $('#btnNuevoProducto')?.addEventListener('click', () => openProductoDialog());

  async function loadCategoriasSelects() {
    try {
      const cats = await Store.listCategorias();
      if (filtroCategoria) {
        filtroCategoria.innerHTML = '<option value="">Todas las categorías</option>' +
          cats.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
      }
      const pCat = $('#pCategoria');
      if (pCat) {
        pCat.innerHTML = '<option value="">Sin categoría</option>' +
          cats.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
      }
    } catch (e) { console.error('loadCategoriasSelects:', e); }
  }

  async function nombreCategoria(id) {
    if (!id) return '';
    const cats = await Store.listCategorias();
    return (cats.find(c => c.id === id) || {}).nombre || '';
  }

  async function renderProductos() {
    try {
      const query = {
        texto: buscar?.value.trim() || '',
        categoriaId: filtroCategoria?.value || null,
      };
      const productos = await Store.listProductos(query);
      const tbody = $('#tablaProductos tbody');
      if (!tbody) return;
      tbody.innerHTML = '';
      for (const p of productos) {
        const stock = Object.values(p.talles || {}).reduce((a, b) => a + Number(b || 0), 0);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${(p.id || '').split('-')[0]}</td>
          <td>${p.sku || ''}</td>
          <td>${p.nombre || ''}</td>
          <td>${await nombreCategoria(p.categoriaId)}</td>
          <td>${p.color || ''}</td>
          <td>${fmtMoney(p.precio)}</td>
          <td>${stock}</td>
          <td>${p.foto ? `<img src="${p.foto}" style="width:36px;height:36px;object-fit:cover;border-radius:8px;border:1px solid #17372e">` : ''}</td>
          <td>
            <button class="btn" data-edit="${p.id}">Editar</button>
            <button class="btn" data-del="${p.id}">Eliminar</button>
          </td>`;
        tbody.appendChild(tr);
      }
      // acciones
      tbody.querySelectorAll('button[data-edit]').forEach(btn =>
        btn.addEventListener('click', async () => {
          const id = btn.dataset.edit;
          const p = (await Store.listProductos()).find(x => x.id === id);
          openProductoDialog(p);
        })
      );
      tbody.querySelectorAll('button[data-del]').forEach(btn =>
        btn.addEventListener('click', async () => {
          const id = btn.dataset.del;
          if (confirm('¿Eliminar producto?')) {
            await Store.deleteProducto(id);
            renderProductos();
            renderDashboard();
          }
        })
      );
      renderDashboard();
    } catch (e) { console.error('renderProductos:', e); }
  }

  // ---------- Diálogo Producto ----------
  const dlgProducto = $('#dlgProducto');
  const pSku = $('#pSku'), pNombre = $('#pNombre'), pCategoria = $('#pCategoria'),
        pColor = $('#pColor'), pPrecio = $('#pPrecio');
  const pTalles = $('#pTalles'), pTalleCustom = $('#pTalleCustom'), agregarTalle = $('#agregarTalle');
  const pFoto = $('#pFoto'), previewFoto = $('#previewFoto'), tomarFoto = $('#tomarFoto');
  let editingProductId = null;

  function openProductoDialog(p = null) {
    if (!dlgProducto) return;
    $('#dlgProductoTitle').textContent = p ? 'Editar producto' : 'Nuevo producto';
    editingProductId = p ? p.id : null;

    if (pSku) pSku.value = p?.sku || '';
    if (pNombre) pNombre.value = p?.nombre || '';
    if (pCategoria) pCategoria.value = p?.categoriaId || '';
    if (pColor) pColor.value = p?.color || '';
    if (pPrecio) pPrecio.value = p?.precio || 0;
    if (previewFoto) previewFoto.src = p?.foto || '';
    if (pFoto) pFoto.value = '';
    if (pTalles) {
      pTalles.innerHTML = '';
      const talles = p?.talles || {};
      for (const [t, c] of Object.entries(talles)) addTalleItem(t, c);
    }

    try { dlgProducto.showModal(); }
    catch {
      // fallback si showModal no existe
      dlgProducto.setAttribute('open', 'open');
    }
  }

  function addTalleItem(talle, cant = 0) {
    const row = document.createElement('div');
    row.className = 'talle-item';
    row.innerHTML = `<strong>${talle}</strong>
      <input type="number" min="0" value="${cant}">
      <button type="button" class="btn">Quitar</button>`;
    row.querySelector('button').addEventListener('click', () => row.remove());
    pTalles.appendChild(row);
  }

  $$('.chip').forEach(ch =>
    ch.addEventListener('click', () => addTalleItem(ch.dataset.size, 0))
  );

  agregarTalle?.addEventListener('click', () => {
    const t = pTalleCustom.value.trim();
    if (t) { addTalleItem(t, 0); pTalleCustom.value = ''; }
  });

  pFoto?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await fileToDataURL(file);
    previewFoto.src = url;
  });
  tomarFoto?.addEventListener('click', () => pFoto.click());

  $('#guardarProducto')?.addEventListener('click', async (ev) => {
    ev.preventDefault();
    try {
      const talles = {};
      pTalles.querySelectorAll('.talle-item').forEach((row) => {
        const t = row.querySelector('strong').textContent;
        const c = Number(row.querySelector('input').value || 0);
        talles[t] = c;
      });
      const prod = {
        id: editingProductId || undefined,
        sku: (pSku?.value || '').trim(),
        nombre: (pNombre?.value || '').trim(),
        categoriaId: pCategoria?.value || '',
        color: (pColor?.value || '').trim(),
        precio: Number(pPrecio?.value || 0),
        talles,
        foto: previewFoto?.src || ''
      };
      if (!prod.sku || !prod.nombre) return alert('Completá SKU y Nombre');

      await Store.saveProducto(prod);

      // cerrar diálogo
      try { dlgProducto.close(); } catch {}
      dlgProducto.removeAttribute('open');

      // refrescar
      renderProductos();
      renderDashboard();
      // ir a productos
      location.hash = 'productos';
    } catch (e) {
      console.error('guardarProducto:', e);
      alert('No se pudo guardar el producto');
    }
  });

  // ---------- Categorías ----------
  const dlgCategoria = $('#dlgCategoria');
  $('#btnNuevaCategoria')?.addEventListener('click', () => {
    $('#cNombre').value = '';
    try { dlgCategoria.showModal(); } catch { dlgCategoria.setAttribute('open','open'); }
  });

  $('#formCategoria')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const nombre = $('#cNombre').value.trim();
      if (!nombre) return;
      await Store.saveCategoria({ nombre });
      try { dlgCategoria.close(); } catch {}
      dlgCategoria.removeAttribute('open');
      await loadCategoriasSelects();
      renderCategorias();
    } catch (err) { console.error('saveCategoria:', err); }
  });

  async function renderCategorias() {
    try {
      const cats = await Store.listCategorias();
      const prods = await Store.listProductos();
      const tbody = $('#tablaCategorias tbody');
      if (!tbody) return;
      tbody.innerHTML = '';
      for (const c of cats) {
        const count = prods.filter(p => p.categoriaId === c.id).length;
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${(c.id || '').split('-')[0]}</td><td>${c.nombre}</td><td>${count}</td>
          <td><button class="btn" data-edit="${c.id}">Editar</button>
              <button class="btn" data-del="${c.id}">Eliminar</button></td>`;
        tbody.appendChild(tr);
      }
      tbody.querySelectorAll('button[data-edit]').forEach(btn =>
        btn.addEventListener('click', async () => {
          const id = btn.dataset.edit;
          const cats = await Store.listCategorias();
          const c = cats.find(x => x.id === id);
          $('#cNombre').value = c.nombre;
          try { dlgCategoria.showModal(); } catch { dlgCategoria.setAttribute('open','open'); }
          $('#formCategoria').onsubmit = async (e2) => {
            e2.preventDefault();
            c.nombre = $('#cNombre').value.trim();
            await Store.saveCategoria(c);
            try { dlgCategoria.close(); } catch {}
            dlgCategoria.removeAttribute('open');
            renderCategorias();
            loadCategoriasSelects();
          };
        })
      );
      tbody.querySelectorAll('button[data-del]').forEach(btn =>
        btn.addEventListener('click', async () => {
          const id = btn.dataset.del;
          if (confirm('¿Eliminar categoría?')) {
            await Store.deleteCategoria(id);
            renderCategorias();
            loadCategoriasSelects();
          }
        })
      );
    } catch (e) { console.error('renderCategorias:', e); }
  }

  // ---------- Vender ----------
  const skuVenta = $('#skuVenta'), talleVenta = $('#talleVenta'),
        cantidadVenta = $('#cantidadVenta'), ventaInfo = $('#ventaInfo');

  skuVenta?.addEventListener('change', loadTallesForSKU);

  async function loadTallesForSKU() {
    try {
      const p = await Store.getProductoBySKU(skuVenta.value.trim());
      if (!talleVenta) return;
      talleVenta.innerHTML = '<option value="">Seleccione un talle</option>';
      if (!p) { ventaInfo?.classList.remove('show'); return; }
      for (const [t, c] of Object.entries(p.talles || {})) {
        const opt = document.createElement('option');
        opt.value = t; opt.textContent = `${t} (stock ${c})`;
        talleVenta.appendChild(opt);
      }
      if (ventaInfo) {
        ventaInfo.textContent = `${p.nombre} — ${fmtMoney(Number(p.precio || 0))}`;
        ventaInfo.classList.add('show');
      }
    } catch (e) { console.error('loadTallesForSKU:', e); }
  }

  $('#registrarVenta')?.addEventListener('click', async () => {
    try {
      const sku = skuVenta?.value.trim();
      const talle = talleVenta?.value;
      const qty = Number(cantidadVenta?.value || 1);
      if (!sku || !talle || qty <= 0) return alert('Completá SKU, talle y cantidad');
      const p = await Store.getProductoBySKU(sku);
      if (!p) return alert('Producto no encontrado');
      const stockActual = Number(p.talles?.[talle] || 0);
      if (stockActual < qty) return alert('No hay stock suficiente');

      // descuenta
      p.talles[talle] = stockActual - qty;
      await Store.saveProducto(p);

      // registra
      const total = Number(p.precio) * qty;
      const venta = {
        fechaISO: new Date().toISOString(),
        total,
        items: [{ productoId: p.id, sku: p.sku, nombre: p.nombre, talle, cantidad: qty, precio: p.precio }],
      };
      const saved = await Store.saveVenta(venta);

      // refresh + recibo
      renderVentas(); renderProductos(); renderDashboard();
      abrirRecibo(saved);

      // reset
      if (cantidadVenta) cantidadVenta.value = 1;
      if (talleVenta) talleVenta.innerHTML = '<option value="">Seleccione un talle</option>';
      if (skuVenta) skuVenta.value = '';
      ventaInfo?.classList.remove('show');
    } catch (e) { console.error('registrarVenta:', e); }
  });

  // ---------- Ventas ----------
  async function renderVentas() {
    try {
      const ventas = await Store.listVentas();
      const tbody = $('#tablaVentas tbody');
      if (!tbody) return;
      tbody.innerHTML = '';
      for (const v of ventas) {
        const detalle = v.items.map(i => `${i.cantidad} x ${i.nombre} (${i.sku}) - Talle ${i.talle} a ${fmtMoney(i.precio)}`).join('<br/>');
        const tr = document.createElement('tr');
        const fecha = new Date(v.fechaISO);
        tr.innerHTML = `<td>${(v.id || '').slice(-5)}</td>
          <td>${fecha.toLocaleString('es-AR')}</td>
          <td>${fmtMoney(Number(v.total || 0))}</td>
          <td>${detalle}</td>
          <td>
            <button class="btn" data-print="${v.id}">Ver / Imprimir</button>
            <button class="btn solid" data-dl="${v.id}">Descargar</button>
          </td>`;
        tbody.appendChild(tr);
      }
      tbody.querySelectorAll('button[data-print]').forEach(btn =>
        btn.addEventListener('click', async () => {
          const ventas = await Store.listVentas();
          const v = ventas.find(x => x.id === btn.dataset.print);
          abrirRecibo(v);
        })
      );
      tbody.querySelectorAll('button[data-dl]').forEach(btn =>
        btn.addEventListener('click', async () => {
          const ventas = await Store.listVentas();
          const v = ventas.find(x => x.id === btn.dataset.dl);
          abrirRecibo(v, true);
        })
      );
    } catch (e) { console.error('renderVentas:', e); }
  }

  // ---------- Comprobante / Negocio ----------
  $('#guardarNegocio')?.addEventListener('click', async () => {
    try {
      const data = {
        nombre: $('#nbNombre')?.value,
        cuit: $('#nbCuit')?.value,
        dir: $('#nbDir')?.value,
        ciudad: $('#nbCiudad')?.value,
        tel: $('#nbTel')?.value,
      };
      await Store.setDoc('negocio', 'datos', data);
      alert('Datos guardados');
    } catch (e) { console.error('guardarNegocio:', e); }
  });

  async function preloadNegocio() {
    try {
      const n = await Store.getDoc('negocio', 'datos');
      if ($('#nbNombre')) $('#nbNombre').value = n?.nombre || '';
      if ($('#nbCuit')) $('#nbCuit').value = n?.cuit || '';
      if ($('#nbDir')) $('#nbDir').value = n?.dir || '';
      if ($('#nbCiudad')) $('#nbCiudad').value = n?.ciudad || '';
      if ($('#nbTel')) $('#nbTel').value = n?.tel || '';
    } catch (e) { console.error('preloadNegocio:', e); }
  }

  // ---------- Recibo ----------
  async function abrirRecibo(venta, autoDescargar = false) {
    const n = await Store.getDoc('negocio', 'datos');
    const tpl = document.importNode($('#tplRecibo').content, true);
    tpl.querySelector('#rNegocio').textContent = n?.nombre || 'INDUMENTARIA R';
    tpl.querySelector('#rCuit').textContent = n?.cuit ? 'CUIT/CUIL: ' + n.cuit : '';
    tpl.querySelector('#rDir').textContent = n?.dir ? n.dir : '';
    tpl.querySelector('#rCiudad').textContent = n?.ciudad ? '— ' + n.ciudad : '';
    tpl.querySelector('#rTel').textContent = n?.tel ? '— ' + n.tel : '';
    tpl.querySelector('#rNum').textContent = '#' + (venta.id || '').slice(-5);
    tpl.querySelector('#rFecha').textContent = new Date(venta.fechaISO).toLocaleString('es-AR');

    const tbody = tpl.querySelector('#rItems');
    venta.items.forEach((i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${i.nombre}</td><td>${i.sku}</td><td>${i.talle}</td><td>${i.cantidad}</td><td>${fmtMoney(i.precio)}</td><td>${fmtMoney(i.cantidad * i.precio)}</td>`;
      tbody.appendChild(tr);
    });
    tpl.querySelector('#rTotal').textContent = fmtMoney(venta.total);

    const wrap = document.createElement('div');
    wrap.appendChild(tpl);
    const w = window.open('', '_blank');
    w.document.write(
      '<html><head><title>Comprobante</title><link rel="stylesheet" href="style.css"></head><body>' +
        wrap.innerHTML +
        '</body></html>'
    );
    w.document.close();

    // Descargar PDF con html2canvas + jsPDF en la nueva ventana
    w.addEventListener('load', () => {
      const btn = w.document.getElementById('btnDescargarPDF');
      btn?.addEventListener('click', () =>
        descargarReciboComoPDF(w.document.querySelector('.recibo'))
      );
      if (autoDescargar) {
        setTimeout(() => descargarReciboComoPDF(w.document.querySelector('.recibo')), 400);
      }
    });
  }

  async function descargarReciboComoPDF(el) {
    const { jsPDF } = window.jspdf;
    const canvas = await html2canvas(el, { scale: 2, background: '#ffffff' });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const ratio = canvas.height / canvas.width;
    const imgW = pageW - 60, imgH = imgW * ratio;
    pdf.addImage(img, 'PNG', 30, 30, imgW, imgH);
    pdf.save('comprobante.pdf');
  }

  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // --------- kickoff mínimo tras init ----------
  // Cargamos categorías y dashboard de arranque
  await loadCategoriasSelects();
  renderDashboard();

})();
