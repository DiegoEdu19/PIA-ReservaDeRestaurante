$(document).ready(function () {

    // --- Cargar reservas existentes al cargar la página ---
    function cargarReservas() {
        fetch('/listar')
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(data => {
                const tabla = $('#tablaReservas');
                tabla.empty(); // Limpia el contenido anterior

                if (!Array.isArray(data)) {
                    console.error('Error: La respuesta del servidor no es un array.', data);
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
                const tabla = $('#tablaReservas');
                tabla.empty();
                tabla.append(`<tr><td colspan="9" class="text-danger">Error al cargar reservas: ${error.message || error}</td></tr>`);
            });
    }

    // --- Función para formatear fecha ---
    function formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        const opciones = { day: 'numeric', month: 'short' };
        return fecha.toLocaleDateString('es-ES', opciones);
    }

    // --- Función para cargar los estados desde el backend ---
    function cargarEstadosReserva() {
        fetch('/estados')
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
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
                console.error('Error al cargar los estados de reserva:', error);
                $('#estado').append('<option disabled>Error al cargar estados</option>');
            });
    }

    function cargarRestaurante() {
    fetch('/api/restaurantes')
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
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
            console.error('Error al cargar los restaurantes:', error);
            $('#restaurante').append('<option disabled>Error al cargar restaurantes</option>');
        });
}
    // --- Evento para agregar nueva reserva ---
    $('#form-agregar-reserva').on('submit', function (e) {
        e.preventDefault();

        const nuevaReserva = {
            nombre: $('#nombre').val(),
            personas: $('#personas').val(),
            fecha: $('#fecha').val(),
            hora: $('#hora').val(),
            hora_fin: $('#hora_fin').val(),
            telefono: $('#telefono').val(),
            estado_id: $('#estado').val(),
            id_restaurante: $('#restaurante').val()
        };

        fetch('/reservas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaReserva)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json(); // o response.text() si tu backend no retorna JSON
            })
            .then(() => {
                alert('Reserva creada exitosamente');
                $('#form-agregar-reserva')[0].reset();
                cargarReservas(); // Recarga la tabla
            })
            .catch(error => {
                alert('Error al crear la reserva');
                console.error('Error al crear la reserva:', error);
            });
    });

    // --- Llamadas al iniciar ---
    cargarReservas();
    cargarEstadosReserva();
    cargarRestaurante()
});

  

  