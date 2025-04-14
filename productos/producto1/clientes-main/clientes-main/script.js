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

  // Obtener la lista de clientes desde localStorage (si no hay, se crea un array vacío)
  let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

  // Agregar el nuevo cliente a la lista
  clientes.push(cliente);

  // Guardar la lista actualizada de clientes en localStorage
  localStorage.setItem('clientes', JSON.stringify(clientes));

  // Mostrar mensaje de confirmación
  alert('Compra confirmada! Redirigiendo a Mercado Pago...');

  // Limpiar el formulario
  e.target.reset();

  // Redirigir a Mercado Pago (cambiá el link por el real)
  window.location.href = 'https://www.mercadopago.com.ar'; // ← Link de pago real
});
