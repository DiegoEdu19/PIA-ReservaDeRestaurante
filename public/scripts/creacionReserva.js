$('#form-agregar-reserva').on('submit', function (e) {
    e.preventDefault();

    const reservaData = {
        nombre: $('#nombre').val(),
        cantidad_personas: $('#personas').val(),
        fecha: $('#fecha').val(),
        hora_inicio: $('#hora').val(),
        telefono: $('#telefono').val(),
        estado_id: 1,
        id_restaurante: 1
    };

    fetch(url, {
        method: POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaData)
    })
        .then(response => {
            if (!response.ok) return response.text().then(text => { throw new Error(text) });
            return response.json();
        })
        .catch(error => {
            alert('Error al guardar la reserva');
            console.error('Error al guardar la reserva:', error);
        });
});