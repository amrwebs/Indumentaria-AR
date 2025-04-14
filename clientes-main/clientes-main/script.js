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

  // Guardar en localStorage
  let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  clientes.push(cliente);
  localStorage.setItem('clientes', JSON.stringify(clientes));

  // Mostrar mensaje
  alert('Compra confirmada! Redirigiendo a Mercado Pago...');

  // Limpiar el formulario
  e.target.reset();

  // Aquí no es necesario crear un link de Mercado Pago ya que el script de Mercado Pago
  // ya se encarga de redirigir al pago cuando se muestra el botón en la página
});
