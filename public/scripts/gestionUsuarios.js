$(document).ready(async function () {
  await cargarEmpleados();

  $("form").on("submit", async function (event) {
    event.preventDefault();

    const nombre = $('input[placeholder="Nombre"]').val().trim();
    const apellidos = $('input[placeholder="Apellidos"]').val().trim();
    const correo = $('input[placeholder="Correo"]').val().trim();
    const telefono = $('input[placeholder="Teléfono"]').val().trim();
    const contrasena = $('input[placeholder="Contraseña"]').val().trim();
    const rol = $("#selectRol").val(); 
    const restaurante = $("#selectRestaurante").val(); 

    if (!nombre || !apellidos || !correo || !telefono || !contrasena || !rol || !restaurante) {
      $('#alertBox').append(createAlert('info', 'Por favor, completa todos los campos.'));
      return;
    }

    const datosEmpleado = {
      nombre_empleado: nombre,
      apellido_empleado: apellidos,
      correo_empleado: correo,
      telefono_empleado: telefono,
      contrasena_empleado: contrasena,
      id_rol: rol,
      id_restaurante: restaurante
    };

    try {
      let response;
      if (window.usuarioEditandoId) {
        response = await fetch(`/usuarios/${window.usuarioEditandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosEmpleado),
        });
      } else {
        response = await fetch("/agregarUsuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosEmpleado),
        });
      }

      if (response.ok) {
        const mensaje = window.usuarioEditandoId
          ? "Empleado editado correctamente."
          : "Empleado agregado correctamente.";
        $("form")[0].reset();
        window.usuarioEditandoId = null;
        await cargarEmpleados();
        $('#alertBox').prepend(createAlert('success', mensaje));
      } else {
        const errorText = await response.text();
        $('#alertBox').prepend(createAlert('danger', 'Error: ' + errorText));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error.");
    }
  });
});

async function cargarEmpleados() {
  try {
    const res = await fetch('/api/usuarios');
    const empleados = await res.json();

    const $tbody = $("#empleados-tbody");
    $tbody.empty();

    empleados.forEach(empleado => {
      const $tr = $("<tr>");
      $tr.append(`
        <td>${empleado.id_empleado}</td>
        <td>${empleado.nombre_empleado} ${empleado.apellido_empleado}</td>
        <td>${empleado.correo_empleado}</td>
        <td>${empleado.telefono_empleado}</td>
        <td>${empleado.nombre_rol || empleado.id_rol}</td>
        <td>${empleado.nombre_restaurante || empleado.id_restaurante}</td>
        <td>
          <button class="btn btn-warning btn-sm mt-2" onclick="editarEmpleado(${empleado.id_empleado}, '${empleado.nombre_empleado}', '${empleado.apellido_empleado}', '${empleado.correo_empleado}', '${empleado.telefono_empleado}', '${empleado.contrasena_empleado}', '${empleado.id_rol}', '${empleado.id_restaurante}')">Editar</button>
          <button class="btn btn-danger btn-sm mt-2" onclick="eliminarEmpleado(${empleado.id_empleado})">Eliminar</button>
        </td>
      `);
      $tbody.append($tr);
    });

  } catch (error) {
    console.error('Error al cargar los empleados:', error);
    $('#empleados-tbody').html('<tr><td colspan="7" class="text-center">No se pudieron cargar los empleados.</td></tr>');
  }
}

window.editarEmpleado = function (id, nombre, apellidos, correo, telefono, contrasena, rol, restaurante) {
  window.usuarioEditandoId = id;
  $('input[placeholder="Nombre"]').val(nombre);
  $('input[placeholder="Apellidos"]').val(apellidos);
  $('input[placeholder="Correo"]').val(correo);
  $('input[placeholder="Teléfono"]').val(telefono);
  $('input[placeholder="Contraseña"]').val(contrasena);
  $('#selectRol').val(rol);
  $('#selectRestaurante').val(restaurante);
};

window.eliminarEmpleado = async function (id) {
  if (!confirm("¿Estás seguro de que quieres eliminar este empleado?")) return;

  try {
    const response = await fetch(`/usuarios/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      $('#alertBox').prepend(createAlert('success', 'Empleado eliminado correctamente.'));
      await cargarEmpleados();
    } else {
      const errorText = await response.text();
      $('#alertBox').prepend(createAlert('danger', "Error al eliminar empleado: " + errorText));
    }
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    alert("Ocurrió un error al intentar eliminar el empleado.");
  }
};

function createAlert(type, message) {
  let icon = '';
  switch (type) {
    case "success":
      icon = 'bi bi-check-circle';
      break;
    case "danger":
      icon = 'bi bi-exclamation-triangle';
      break;
    case "info":
      icon = 'bi bi-info-circle';
      break;
  }
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible mt-3" role="alert">
      <div><i class="${icon} me-2"></i>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  return wrapper;
}