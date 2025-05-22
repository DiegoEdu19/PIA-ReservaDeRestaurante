async function validarYActualizarHorarios() {
  try {
    // Primero validamos los horarios
    const filas = $('#formHorarios tbody tr');
    let error = false;
    let mensajeError = '';

    filas.each(function () {
      const dia = $(this).find('.dia').text().trim();
      const abierto = $(this).find('.abierto input').is(':checked');
      const hora_apertura = $(this).find('.hora_apertura input').val();
      const hora_cierre = $(this).find('.hora_cierre input').val();

      if (abierto) {
        if (!hora_apertura || !hora_cierre) {
          error = true;
          mensajeError += `Faltan horas para el día ${dia}\n`;
        }
      }
    });

    if (error) {
      alert(mensajeError);
      return; // No continuar si hay error
    }

    // Recopilar horarios desde la tabla para enviar
    const horarios = [];

    filas.each(function () {
      const dia = $(this).find('.dia').text().trim();
      const abierto = $(this).find('.abierto input').is(':checked');
      const hora_apertura = $(this).find('.hora_apertura input').val() || null;
      const hora_cierre = $(this).find('.hora_cierre input').val() || null;

      horarios.push({ dia, abierto, hora_apertura, hora_cierre });
    });

    // Enviar petición PUT para actualizar horarios (restaurante id 1)
    const response = await fetch('/horarios/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(horarios),
    });

    const dataRespuesta = await response.json();

    if (response.ok) {
      alert(dataRespuesta.mensaje);
    } else {
      alert("Error al actualizar horarios: " + dataRespuesta.mensaje);
    }

  } catch (error) {
    alert("Error en la solicitud: " + error.message);
  }
}

// Función para cargar los horarios y llenar la tabla cuando se carga la página
async function cargarHorarios() {
  try {
    const res = await fetch('api/horarios/1');

    if (!res.ok) {
      throw new Error('Error del servidor: ' + res.status);
    }

    const horarios = await res.json();
    console.log('Horarios recibidos:', horarios);

    // Asegurar que horarios sea un arreglo
    if (!Array.isArray(horarios)) {
      throw new Error('La respuesta no es un arreglo');
    }

    $('#formHorarios tbody tr').each(function () {
      const dia = $(this).find('.dia').text().trim();
      const horario = horarios.find(h => h.dia === dia);

      if (horario) {
        $(this).find('.abierto input').prop('checked', horario.abierto);

        if (horario.abierto) {
          $(this).find('.hora_apertura input').val(horario.hora_apertura);
          $(this).find('.hora_cierre input').val(horario.hora_cierre);
        } else {
          $(this).find('.hora_apertura input').val('');
          $(this).find('.hora_cierre input').val('');
        }
      }
    });

  } catch (error) {
    console.error('Error al cargar horarios:', error);
    alert('No se pudieron cargar los horarios: ' + error.message);
  }
}

// Asociar la función validarYActualizarHorarios al botón
$('#actualizarHorario').on('click', validarYActualizarHorarios);

// Ejecutar la carga inicial al cargar la página
$(document).ready(() => {
  cargarHorarios();
});