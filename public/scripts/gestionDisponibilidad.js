$(document).ready(function () {
  const id_restaurante = 1; 

  function cargarCapacidad() {
    $.ajax({
      url: `/api/horarios/${id_restaurante}`, 
      type: 'GET',
      success: function (horarios) {
        if (Array.isArray(horarios) && horarios.length > 0) {
          $('#capacidadPorReserva').val(horarios[0].capacidad || 0);
        }
      },
      error: function (xhr) {
        console.error('Error al cargar capacidad:', xhr.responseJSON?.mensaje || xhr.statusText);
      }
    });
  }

  $('form').submit(function (e) {
    e.preventDefault();

    const capacidadMaxima = parseInt($('#capacidadMaxima').val(), 10);
    const intervaloReservas = parseInt($('#intervaloReservas').val(), 10);
    const capacidadPorReserva = parseInt($('#capacidadPorReserva').val(), 10);

    $.ajax({
      url: '/capacidad',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        id_restaurante,
        capacidad_maxima: capacidadMaxima,
        intervalo_reservas: intervaloReservas,
        capacidad_por_reserva: capacidadPorReserva
      }),
      success: function (response) {
        alert(response.mensaje || 'Capacidad actualizada correctamente');
        cargarCapacidad(); // Recarga el valor actualizado
      },
      error: function (xhr) {
        alert('Error al actualizar la capacidad: ' + (xhr.responseJSON?.mensaje || xhr.statusText));
      }
    });
  });

  // Llamar la función al iniciar
  cargarCapacidad();
});