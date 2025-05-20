$(document).ready(() => {
  fetch('/api/usuarios')
    .then(res => res.json())
    .then(data => {
      const tbody = $('#empleados-tbody');
      tbody.empty(); // Limpiar por si acaso

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
});