async function cargarDatosReservas() {
    const res = await fetch('/api/reporteReservas');
    const data = await res.json();

    const fechas = data.map(d => d.fecha);
    const cantidades = data.map(d => parseInt(d.cantidad));

    // Cargar gráfico
    const ctx = document.getElementById('graficoReservas').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: fechas,
            datasets: [{
                label: 'Cantidad de Reservas',
                data: cantidades,
                backgroundColor: 'rgba(13, 110, 253, 0.7)',
                borderColor: 'rgba(13, 110, 253, 1)',
                borderWidth: 1
            }]
        },
        options: {
            animation: {
                duration: 1000,
                easing: 'easeOutBounce'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });

    // Cargar tabla
    const tabla = document.getElementById('tablaReservas');
    tabla.innerHTML = '';
    data.forEach(({ fecha, cantidad }) => {
        tabla.innerHTML += `
            <tr>
                <td>${fecha}</td>
                <td>${cantidad}</td>
            </tr>
        `;
    });
}

cargarDatosReservas();