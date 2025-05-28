$(document).ready(function () {
    $("#menuForm").on("submit", async function (e) {
        e.preventDefault();
        
        const formData = new FormData(this);

        try {
            const res = await fetch('/menuAdmin', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                alert('Menú actualizado correctamente');
                window.location.reload(); // Esto recarga para mostrar el nuevo PDF si fue guardado correctamente
            } else {
                const errText = await res.text();
                throw new Error(errText || 'Error al subir el archivo');
            }
        } catch (error) {
            alert('Error: ' + error.message);
            console.error('Error al subir menú:', error);
        }
    });
});