function cargarEmpleados() {
  fetch('/api/usuarios')
    .then(res => res.json())
    .then(data => {
      const tbody = $('#empleados-tbody');
      tbody.empty();

      data.forEach(empleado => {
        const fila = `
          <tr>
            <td>${empleado.id_empleado}</td>
            <td>${empleado.nombre} ${empleado.apellidos}</td>
            <td>${empleado.correo}</td>
            <td>${empleado.telefono}</td>
            <td>${empleado.nombre_rol || empleado.id_rol}</td>
            <td>${empleado.id_restaurante}</td>
            <td>
              <button class="btn btn-sm btn-primary"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button>
            </td>
          </tr>
        `;
        tbody.append(fila);
      });
    })
    .catch(error => {
      console.error("Error al cargar empleados:", error);
      $('#empleados-tbody').html('<tr><td colspan="7" class="text-center text-danger">Error al cargar los datos</td></tr>');
    });
}

  $(document).ready(() => {
  // Cargar empleados (tu código ya está)
  cargarEmpleados();

  // Cargar restaurantes
  fetch('/api/restaurantes')
  .then(res => res.json())
  .then(data => {
    if (!Array.isArray(data)) throw new Error('Respuesta inesperada');
    const select = $('#selectRestaurante');
    select.empty().append('<option disabled selected>Selecciona un restaurante</option>');
    data.forEach(r => {
      select.append(`<option value="${r.id}">${r.nombre}</option>`);
    });
  })
  .catch(error => console.error('Error cargando restaurantes:', error));

// Cargar roles
fetch('/api/roles')
  .then(res => res.json())
  .then(data => {
    if (!Array.isArray(data)) throw new Error('Respuesta inesperada');
    const select = $('#selectRol');
    select.empty().append('<option disabled selected>Selecciona un rol</option>');
    data.forEach(r => {
      select.append(`<option value="${r.id}">${r.nombre}</option>`);
    });
  })
  .catch(error => console.error('Error cargando roles:', error));
});


$('#form-agregar-empleado').submit(async function (e) {
  e.preventDefault();

  const nuevoEmpleado = {
    nombre: $('#nombre').val(),
    apellidos: $('#apellidos').val(),
    correo: $('#correo').val(),
    telefono: $('#telefono').val(),
    contrasena: $('#contrasena').val(),
    id_rol: $('#selectRol').val(),
    id_restaurante: $('#selectRestaurante').val()
  };

  try {
    const response = await fetch('/agregarUsuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoEmpleado)
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    const data = await response.json();
    console.log('Empleado agregado:', data);

    cargarEmpleados();
    this.reset(); // Limpiar formulario

  } catch (error) {
    console.error('Error al agregar empleado:', error);
  }
});