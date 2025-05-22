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
              <button class="btn btn-sm btn-danger eliminarEmpleado" data-id="${empleado.id_empleado}""><i class="bi bi-trash"></i></button>
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

    $('#empleados-tbody').on('click','.eliminarEmpleado', async function () {
    const idEmpleado = $(this).data('id');

    if (!idEmpleado) {
      alert("ID de empleado no encontrado");
      return;
    }

    if (!confirm("¿Estás seguro que deseas eliminar este empleado?")) return;

    try {
      const response = await fetch(`/usuarios/${idEmpleado}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensaje);
        cargarEmpleados();
      } else {
        alert("Error al eliminar: " + (data.mensaje || "Error desconocido"));
      }
    } catch (error) {
      alert("Error en la solicitud: " + error.message);
    }
  });
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
    nombre: $('#nombre').val().trim(),
    apellidos: $('#apellidos').val().trim(),
    correo: $('#correo').val().trim(),
    telefono: $('#telefono').val().trim(),
    contrasena: $('#contrasena').val().trim(),
    id_rol: $('#selectRol').val(),
    id_restaurante: $('#selectRestaurante').val()
  };

  // Validación: verificar si hay campos vacíos
  if (
    !nuevoEmpleado.nombre ||
    !nuevoEmpleado.apellidos ||
    !nuevoEmpleado.correo ||
    !nuevoEmpleado.telefono ||
    !nuevoEmpleado.contrasena ||
    !nuevoEmpleado.id_rol ||
    !nuevoEmpleado.id_restaurante
  ) {
    alert("Por favor, completa todos los campos antes de continuar.");
    return;
  }

  try {
    const response = await fetch('/agregarUsuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoEmpleado)
    });

    const resultado = await response.json();

    if (!response.ok) {
      alert("Error: " + (resultado.mensaje || "Error desconocido"));
      throw new Error(resultado.mensaje || "Error en la respuesta del servidor");
    }

    alert("Empleado agregado correctamente");
    // Limpia el formulario si deseas
    $('#form-agregar-empleado')[0].reset();
    cargarEmpleados();
  } catch (error) {
    console.error("Error al agregar empleado:", error);
  }
});

