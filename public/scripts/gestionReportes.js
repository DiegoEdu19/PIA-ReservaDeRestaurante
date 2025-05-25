const ctx = document.getElementById('reservas');

function obtenerReservas() {
    fetch('/getDatos')
        .then(res => {
        if (!response.ok) {
        return response.text().then(text => { throw new Error(text) });

            return res.json();
        }
        }).then(data => {
            const chart = "#reservas";
    })
}

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});