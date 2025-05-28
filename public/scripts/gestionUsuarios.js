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
            <td>${empleado.contrasena}</td>
            <td>${empleado.nombre_rol || empleado.id_rol}</td>
            <td>${empleado.id_restaurante}</td>
            <td>
              <button class="btn btn-sm btn-primary editarEmpleado" data-id="${empleado.id_empleado}"><i class="bi bi-pencil"></i></button>
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

  $('#empleados-tbody').on('click', '.editarEmpleado', async function () {
  const idEmpleado = $(this).data('id');

  try {
    const response = await fetch(`/usuarios/${idEmpleado}`); // GET empleado por ID
    if (!response.ok) throw new Error("Error al obtener datos");

    const empleado = await response.json();

    // Llenar el formulario con datos actuales
    $('#nombre').val(empleado.nombre);
    $('#apellidos').val(empleado.apellidos);
    $('#correo').val(empleado.correo);
    $('#telefono').val(empleado.telefono);
    $('#contrasena').val('');  // Por seguridad, no mostrar la contraseña, el usuario debe ponerla si quiere cambiarla
    $('#selectRol').val(empleado.id_rol);
    $('#selectRestaurante').val(empleado.id_restaurante);

    // Guardar el id en un input oculto o variable global para el PUT
    $('#form-agregar-empleado').data('edit-id', idEmpleado);

    // Cambiar texto o estado del botón para indicar que estás editando
    $('#btn-submit-empleado').text('Guardar cambios');

  } catch (error) {
    alert('Error al cargar datos del empleado: ' + error.message);
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

  const idEmpleadoEditar = $(this).data('edit-id'); // Detecta si está en modo edición

  const empleadoData = {
    nombre: $('#nombre').val().trim(),
    apellidos: $('#apellidos').val().trim(),
    correo: $('#correo').val().trim(),
    telefono: $('#telefono').val().trim(),
    contrasena: $('#contrasena').val().trim(),
    id_rol: $('#selectRol').val(),
    id_restaurante: $('#selectRestaurante').val()
  };

  // Validación de campos vacíos (igual que antes)
  if (
    !empleadoData.nombre ||
    !empleadoData.apellidos ||
    !empleadoData.correo ||
    !empleadoData.telefono ||
    (!idEmpleadoEditar && !empleadoData.contrasena) ||  // Si es creación la contraseña es obligatoria, en edición no es obligatorio cambiarla
    !empleadoData.id_rol ||
    !empleadoData.id_restaurante
  ) {
    alert("Por favor, completa todos los campos antes de continuar.");
    return;
  }

  try {
    let response, resultado;

    if (idEmpleadoEditar) {
      // Modo edición - PUT
      response = await fetch(`/usuarios/${idEmpleadoEditar}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleadoData),
      });
      resultado = await response.json();

      if (!response.ok) {
        alert("Error al actualizar: " + (resultado.mensaje || "Error desconocido"));
        return;
      }

      alert("Empleado actualizado correctamente");

      // Resetear el modo edición
      $(this).removeData('edit-id');
      $('#btn-submit-empleado').text('Crear empleado');

    } else {
      // Modo creación - POST
      response = await fetch('/agregarUsuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleadoData),
      });
      resultado = await response.json();

      if (!response.ok) {
        alert("Error: " + (resultado.mensaje || "Error desconocido"));
        return;
      }

      alert("Empleado agregado correctamente");
    }

    // Limpiar formulario y recargar tabla
    $('#form-agregar-empleado')[0].reset();
    cargarEmpleados();

  } catch (error) {
    console.error("Error en la operación:", error);
    alert("Error en la operación: " + error.message);
  }
});

