$(document).ready(function () {

    let reservaEditandoId = null;

    function cargarReservas() {
        fetch('/listar')
            .then(response => {
                if (!response.ok) return response.text().then(text => { throw new Error(text) });
                return response.json();
            })
            .then(data => {
                const tabla = $('#tablaReservas');
                tabla.empty();

                if (!Array.isArray(data)) {
                    console.error('Respuesta no es un array:', data);
                    return;
                }

                data.forEach((reserva, index) => {
                    const fila = `
                        <tr>
                            <th scope="row">${String(index + 1).padStart(2, '0')}</th>
                            <td>${reserva.nombre}</td>
                            <td>${reserva.cantidad_personas}</td>  
                            <td>${formatearFecha(reserva.fecha)}</td>
                            <td>${reserva.hora_inicio}</td>  
                            <td>${reserva.hora_fin}</td>      
                            <td>${reserva.telefono}</td>
                            <td>${reserva.estado_nombre}</td>
                            <td>${reserva.id_restaurante}</td>       
                            <td>
                                <button class="btn btn-sm btn-warning btn-editar-reserva" data-id="${reserva.id_reserva}"><i class="bi bi-pencil"></i></button>
                                <button class="btn btn-sm btn-danger btn-eliminar-reserva" data-id="${reserva.id_reserva}"><i class="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    `;
                    tabla.append(fila);
                });
            })
            .catch(error => {
                console.error('Error al cargar reservas:', error);
                $('#tablaReservas').empty().append(`<tr><td colspan="9" class="text-danger">Error al cargar reservas: ${error.message || error}</td></tr>`);
            });
    }

    function formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        const opciones = { day: 'numeric', month: 'short' };
        return fecha.toLocaleDateString('es-ES', opciones);
    }

    function cargarEstadosReserva() {
        fetch('/estados')
            .then(response => {
                if (!response.ok) return response.text().then(text => { throw new Error(text) });
                return response.json();
            })
            .then(estados => {
                const $select = $('#estado');
                $select.empty();
                estados.forEach(estado => {
                    $select.append(`<option value="${estado.id_estado}">${estado.descripcion}</option>`);
                });
            })
            .catch(error => {
                console.error('Error al cargar estados:', error);
                $('#estado').append('<option disabled>Error al cargar estados</option>');
            });
    }

    function cargarRestaurante() {
        fetch('/api/restaurantes')
            .then(response => {
                if (!response.ok) return response.text().then(text => { throw new Error(text) });
                return response.json();
            })
            .then(restaurantes => {
                const $select = $('#restaurante');
                $select.empty();
                restaurantes.forEach(restaurante => {
                    $select.append(`<option value="${restaurante.id}">${restaurante.nombre}</option>`);
                });
            })
            .catch(error => {
                console.error('Error al cargar restaurantes:', error);
                $('#restaurante').append('<option disabled>Error al cargar restaurantes</option>');
            });
    }

    // Evento único para crear o actualizar reserva
    $('#form-agregar-reserva').on('submit', function (e) {
        e.preventDefault();

        const reservaData = {
            nombre: $('#nombre').val(),
            cantidad_personas: $('#personas').val(),
            fecha: $('#fecha').val(),
            hora_inicio: $('#hora').val(),
            hora_fin: $('#hora_fin').val(),
            telefono: $('#telefono').val(),
            estado_id: $('#estado').val(),
            id_restaurante: $('#restaurante').val()
        };

        const url = reservaEditandoId ? `/reservas/${reservaEditandoId}` : '/reservas';
        const metodo = reservaEditandoId ? 'PUT' : 'POST';

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservaData)
        })
        .then(response => {
            if (!response.ok) return response.text().then(text => { throw new Error(text) });
            return response.json();
        })
        .then(() => {
            alert(reservaEditandoId ? 'Reserva actualizada correctamente' : 'Reserva creada correctamente');
            $('#form-agregar-reserva')[0].reset();
            $('#btn-submit-reserva').text('Crear Reserva');
            reservaEditandoId = null;
            cargarReservas();
        })
        .catch(error => {
            alert('Error al guardar la reserva');
            console.error('Error al guardar la reserva:', error);
        });
    });

    // Cargar datos para edición
    $(document).on('click', '.btn-editar-reserva', function () {
        const id = $(this).data('id');
        fetch(`/reservas/${id}`)
            .then(response => {
                if (!response.ok) return response.text().then(text => { throw new Error(text) });
                return response.json();
            })
            .then(reserva => {
                $('#nombre').val(reserva.nombre);
                $('#personas').val(reserva.cantidad_personas);
                $('#fecha').val(reserva.fecha.split('T')[0]);
                $('#hora').val(reserva.hora_inicio);
                $('#hora_fin').val(reserva.hora_fin);
                $('#telefono').val(reserva.telefono);
                $('#estado').val(reserva.estado_id);
                $('#restaurante').val(reserva.id_restaurante);

                reservaEditandoId = id;
                $('#btn-submit-reserva').text('Actualizar Reserva');
            })
            .catch(error => {
                alert('Error al cargar la reserva para editar');
                console.error('Error al cargar la reserva:', error);
            });
    });

    // Eliminar reserva
    $(document).on('click', '.btn-eliminar-reserva', function (e) {
        e.preventDefault();
        const idReserva = $(this).data('id');
        if (!idReserva) {
            alert('No se pudo obtener el ID de la reserva.');
            return;
        }
        if (confirm('¿Seguro que deseas eliminar esta reserva?')) {
            fetch(`/reservasE/${idReserva}`, { method: 'DELETE' })
                .then(response => {
                    if (!response.ok) return response.text().then(text => { throw new Error(text) });
                    return response.json();
                })
                .then(() => {
                    alert('Reserva eliminada exitosamente');
                    cargarReservas();
                })
                .catch(error => {
                    alert('Error al eliminar la reserva');
                    console.error('Error al eliminar la reserva:', error);
                });
        }
    });

    // Carga inicial
    cargarReservas();
    cargarEstadosReserva();
    cargarRestaurante();

});
  

  