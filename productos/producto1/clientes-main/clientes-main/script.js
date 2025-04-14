document.getElementById('form-compra').addEventListener('submit', function (e) {
  e.preventDefault();

  // Obtener los datos del formulario
  const nombre = e.target.nombre.value;
  const email = e.target.email.value;
  const direccion = e.target.direccion.value;
  const localidad = e.target.localidad.value;
  const codigoPostal = e.target.codigoPostal.value;
  const telefono = e.target.telefono.value;
  const talle = e.target.talle.value;

  // Crear el objeto cliente
  const cliente = {
    nombre,
    email,
    direccion,
    localidad,
    codigoPostal,
    telefono,
    talle
  };

  // Obtener la lista de clientes desde localStorage
  let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

  // Agregar el nuevo cliente
  clientes.push(cliente);

  // Guardar en localStorage
  localStorage.setItem('clientes', JSON.stringify(clientes));

  // Confirmación visual
  alert('Compra confirmada! Redirigiendo a Mercado Pago...');

  // Limpiar formulario
  e.target.reset();

  // Esperar un poquito antes de redirigir (para asegurar que se guarden los datos)
  setTimeout(() => {
    // 👉 CAMBIÁ ESTE LINK por el de tu botón de pago de Mercado Pago
    window.location.href = 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=TU_LINK_REAL';
  }, 500);
});

