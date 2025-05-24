$(document).ready(function () {
    fetch('/listar')
      .then(response => {
          // Verifica si la respuesta es OK (status 200) y si el contenido es JSON
          if (!response.ok) {
              // Si no es OK, lanza un error para que lo capture el .catch()
              return response.text().then(text => { throw new Error(text) });
          }
          return response.json();
      })
      .then(data => {
        const tabla = $('#tablaReservas');
        tabla.empty(); // Limpia el contenido anterior

        // Asegúrate de que 'data' sea un array antes de iterar
        if (!Array.isArray(data)) {
            console.error('Error: La respuesta del servidor no es un array.', data);
            // Puedes mostrar un mensaje al usuario aquí, por ejemplo:
            // tabla.append('<tr><td colspan="9">No se pudieron cargar las reservas.</td></tr>');
            return; // Detiene la ejecución si no es un array
        }

        data.forEach((reserva, index) => {
          const fila = `
            <tr>
              <th scope="row">${String(index + 1).padStart(2, '0')}</th>
              <td>${reserva.nombre}</td>
              <td>${reserva.cantidad_personas}</td>  <td>${formatearFecha(reserva.fecha)}</td>
              <td>${reserva.hora_inicio}</td>       <td>${reserva.telefono}</td>
              <td>${reserva.estado_nombre}</td>     <td>
                <button class="btn btn-sm btn-warning"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          `;
          tabla.append(fila);
        });
      })
      .catch(error => {
        console.error('Error al cargar reservas:', error);
        // Puedes añadir lógica para mostrar el error al usuario
        const tabla = $('#tablaReservas');
        tabla.empty();
        tabla.append(`<tr><td colspan="9" class="text-danger">Error al cargar reservas: ${error.message || error}</td></tr>`);
      });

    function formatearFecha(fechaISO) {
      const fecha = new Date(fechaISO);
      const opciones = { day: 'numeric', month: 'short' };
      return fecha.toLocaleDateString('es-ES', opciones);
    }
  });